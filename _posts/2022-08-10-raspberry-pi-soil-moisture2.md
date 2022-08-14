---
title: "[Raspberry Pi] 토양 수분 센서(FC-28) 이용해보기(2)"  
excerpt: "라즈베리파이로 토양 수분 함량 측정 후 firebase에 올려보자"

categories:
  - IoT
tags:
  - [IoT, Raspberry Pi, Python]

permalink: /iot/raspberry-pi-soil-moisture2/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-08-10 08:00:00
last_modified_at: 2022-08-10 08:00:00
published: true
---

> [이전 글 참고 : 토양 수분 센서(FC-28) 이용해보기(1)](https://kdjun97.github.io/iot/raspberry-pi-soil-moisture1/)  

## 🔧 개발환경

Python 3.9.2  
Raspberry Pi 4 8GB RAM  
Rasberry Pi OS (64-bit) (Debian Bullseye)  
FC-28 (Soil Moisture Sensor)  
MCP3008 I/P for ADC  
BreadBoard (400 tie-point)  

---  

## 🌼 방향

방향을 조금 바꾸어야할 것 같다.  
분명 어제 실험을 했을 때는 잘 나왔던 측정값이, 오늘은 제대로 나오지 않았다.  
오차 범위가 좀 컸고 1초마다 측정 자체가 잘 안되는 현상을 발견하였다.  

`원래 계획`  
bouncing value를 삭제하기 위해 상위 하위 index들을 잘라낸다.   
그리고 평균을 낸 수분 함량을 firebase에 upload  
이 계획은 측정이 잘 되었을 때의 것이다.  

`바뀐 계획`  

실험을 하며 2가지의 문제점이 있었다.  
**1.** 하드웨어적인 문제.  
선을 건드리기 전까지 1초마다 측정값이 오지 않았다.  
아예 측정값이 10분동안 1개인 경우도 존재하였음.  
하지만 선을 조금만 건드리면 1초마다 측정이 잘 되는 모습을 보였다.  
-> 선 연결에 문제가 있어보임. 혹은 빵판의 문제  
-> 긴 선들이 많이 연결되어있고 + 빵판에 들어간 선들이 헐렁하다.  
현재로선 빵판 재구매 혹은 선을 자를 수 없기 때문에 hold.  

**2.** , 값의 측정(오차, bouncing)의 문제도 있다.  
내가 측정하고 있는 값이 신뢰할만한 값인지 잘 모르겠고, 센서가 정확한지 알아볼 필요가 있었다.(사실 측정되는 값만 봤을 때 센서를 못믿겠음)  

이 상황에서 수분함량을 구해서 워터펌프를 작동시킨다고 해도, 언제 워터펌프 가동을 멈출지 등의 문제가 있을 것이다.  
따라서 DB에 올리는 값은 본래 list의 상하위 20%정도를 삭제한 뒤 남은 list의 중간값을 측정값이라 간주하고 진행할 것이다.  
-> 이렇게 되면 오차가 아주 커지는 상황은 막을 수 있지만, 중간값을 단순히 쓴다는 것은 작은 오차를 막을 순 없다.  

지금은 가지고 있는 장비에서 결과물을 뽑아내보고, 후에 더 좋은 장비를 구매하여 재시도할 필요가 있어보인다.    

---  

## 🌼 Python Code

우선, python 코드를 작성하겠다.  
온습도, 카메라, 토양 수분 함량 측정 등의 다양한 작업들이 python code로 돌아갈 것이다.  
하지만 이 기능들을 모두 합친 코드가 아닌 `nohup`을 이용하여 background로 각각 돌려줄 것이기 때문에, 토양 수분 함량 측정에 대한 부분만 신경써서 코드를 짜면 되겠다.  

```python
import spidev
import time
import threading
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore # For cloud

cred = credentials.Certificate("./Key/serviceKey.json")
firebase_admin.initialize_app(cred)
farmId = "UW62BfvIjSLGGlinjkwx"
db = firestore.client()
max_index = 24 # 가지고 있을 list 최대 갯수

delay = 1 # 측정 딜레이 (1초마다)
wait_time = 300 # 처음 기다리는 시간(이 시간에도 측정은 함)
timer_time = 600 # 타이머가 도는 시간(총 600초)
measure_time = 280 # 측정 시간 total 280초
slicing_percent = 15 # 앞 뒤로 자를 percentage (15%씩 자름)

# Open Spi Bus
# SPI 버스 0과 디바이스 0을 열고
# 최대 전송 속도를 1MHz로 설정
spi = spidev.SpiDev()
spi.open(0,0) # open(bus, device)
spi.max_speed_hz = 1000000 # set transfer speed

# To read SPI data from MCP3008 chip
# Channel must be 0~7 integer
def readChannel(channel): 
  val = spi.xfer2([1, (8+channel)<<4, 0])
  data = ((val[1]&3) << 8) + val[2]
  return data

# 0~1023 value가 들어옴. 1023이 수분함량 min값
def convertPercent(data):
  return 100.0-round(((data*100)/float(1023)),1)

def list_update(li, element):
  global max_index

  if (len(li) >= 24):
    li.pop(0)
  
  if (len(li) <= 23):
    li.append(float('$0.2f'%element))

  return li

def measure_soil_moisture():
  global wait_time, timer_time, delay, measure_time, slicing_percent
  t = threading.Timer(timer_time, measure_soil_moisture) # 정해준 타이머마다 반복
  t.daemon = True # 데몬쓰레드 설정 (메인 쓰레드가 죽으면 죽음)
  t.start()

  print(f'Waiting First {wait_time} min...')
  start = time.time()
  while True:
    if (time_diff(start, wait_time)):
      break
    val = readChannel(0)
    time.sleep(delay)
  
  li = []
  print("Measuring...")
  start = time.time()

  try:
    while True:
      if(time_diff(start, measure_time)):
        break
      val = readChannel(0)
	  if (val != 0):
        percent = convertPercent(val)
        print(val, "/", percent, "%")
        li.append(percent)
      time.sleep(delay)

    upload_soil_moisture(li)
  
  except KeyboardInterrupt:
    spi.close()
    print("Key Interrupt!")

def upload_soil_moisture(li):
  global farmId
  ref = db.collection(u'farmInformation').document(f'{farmId}')
  ref_data = ref.get().to_dict()

  li.sort()
  s_per = int(len(li)*slicing_percent/100)
  result = li[s_per:len(li)-s_per]
  print(result)

  if (len(result) != 0):
    measured_value = result[int(len(result)/2)]
    print(measured_value)
    measured_list = list_update(ref_data['soil_moisture'], measured_value)

    ref.update({
      u'soil_moisture' : measured_list
    })
    print(f'{measured_list} upload complete')

# 시간 차 계산 함수
def time_diff(start, target_time):
  diff = int((time.time()) - start)
  return True if diff >= target_time else False

measure_soil_moisture()

while True:
  time.sleep(10) # For loop
```  

아래는 결과 사진이다.  

![result](/assets/images/post_img/iot/raspberry-pi-soil-moisture2/result.JPG)  

함량은 53% 혹은 76% 둘 사이서 오차범위 +-0.4 정도를 가지는 것 같았다. (bouncing value 무시)  
이것 역시 list로 가지고, 앱에서 그래프로 보여줄 것이다.  

다른 센서로 실험을 해보고 싶었으나, 여건이 되지 않았기 때문에 이정도에서 테스트는 마무리해보도록 하자.  

---  

## 🙂 끝으로...

일단은 유의미한 값이 나오긴 했다.  
그래도 물을 주었을 때 토양에서 수분 함량을 측정하니 말이다.  
하지만 어떠한 문제(코드의 문제 ex:readChannel 함수, 선 연결의 문제, 센서의 문제 등)로 아주 기대했던 값은 나오지 않았으나 그래도 만족스러운 실험이었다.  

끝으로 내가 실험해봤으면 하는 것들을 나열해보고 마무리하겠다.  
아마 아래 후보들을 실험하면 accuracy를 많이 높일 수 있을거라 생각한다.  

**1.** python code의 문제.  
이건 소프트웨어적 문제다.  
readChannel 부분의 함수에서 식의 오류 가능성.  

**2.** fc-28 센서의 문제  
센서가 불량이라 수분 함량을 제대로 측정하지 못함.  
실험했을 때, 센서의 금속 부분을 물에 푹 담궜음에도 max값은 100이 나온적이 없음.  
-> 센서를 사는 것이 방법.  

**3.** 선 연결 or 빵판의 문제  
점퍼 선이 현재 긴 것 뿐이다.  
이것들을 빵판에 연결하였을 때 연결 부분이 붕 뜨게 되는 현상을 발견하였다.  
아마 선이 긴 것 혹은 빵판의 문제라고 본다  
-> 이 역시 짧은 선 교체 혹은 빵판 교체로 해결 가능할 것으로 보임.  

**4.** 아예 python 코드 통 편집  
RPI.GPIO 패키지를 이용하는 예제를 많이 보았다.  
그것을 이용해야할까?  

**5.** 아두이노 우노 보드 사용  
검색해보니 아두이노 보드를 사용해서 (아두이노는 AO, DO가 있음) 쉽게 수분 함량을 측정할 수 있는 것으로 보였다.  
아두이노 보드를 사용해보는 것도 좋을 것 같다.  
이렇게 되면 아두이노 보드에서 데이터를 라즈베리파이로 전송해야하기 때문에 일부러 하지는 않았다.  

다양한 환경에서 실험하며 위 5가지를 추려보았고, 아쉽게도 지금은 5가지 전부를 하지 못한 채 실험을 마무리해보겠다.  