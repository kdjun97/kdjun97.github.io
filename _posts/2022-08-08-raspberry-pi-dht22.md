---
title: "[Raspberry Pi] DHT-22(AM2302) 온습도 센서 이용하기"  
excerpt: "라즈베리파이로 온습도를 측정하고 firebase에 올려보자"

categories:
  - IoT
tags:
  - [IoT, Raspberry Pi, Python]

permalink: /iot/raspberry-pi-dht22/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-08-08 06:00:00
last_modified_at: 2022-08-08 06:00:00
published: true
---

## 🔧 개발환경

Python 3.9.2  
Raspberry Pi 4 8GB RAM  
Rasberry Pi OS (64-bit) (Debian Bullseye)  
DHT-22(AM2302) Sensor  

---  

## 😅 온습도 센서 사용

라즈베리파이 혹은 아두이노로 온습도를 측정할 수 있다는 사실을 알고 있었나?  
센서는 `주로 DHT-11 혹은 DHT-22`를 사용한다고 한다.  
하지만 DHT-11은 DHT-22에 비해 **정밀도가 낮다**는 문제점이 있기 때문에, 이번 프로젝트에서는 DHT-22 센서를 사용할 것이다.  

---  

## 💧 DHT-22(AM2302) 소개

**1.** 온습도를 동시에 측정 가능  
**2.** 낮은 가격(그리 비싸지 않음 1만원 아래)  
**3.** DHT-11보다 높은 정밀도  

![dht22](/assets/images/post_img/iot/raspberry-pi-dht22/dht22.png)  
왼쪽 핀부터 1번(전원), 2번(데이터), 3번(GND)  

`스펙`  

- 동작 전압 : 3.3V~5V  
- 핀구성 : 3핀(VCC / GND / SIG)
- 온도 측정 범위 : -40º to 80ºC (+-0.5ºC)  
- 습도 측정 범위 : 0 ~ 100%  (+-2ºC)
- 크기 : 3.1 x 1.9 x 0.8 cm
- 용도 : 대기의 온, 습도 측정에 사용

---  

## 〰️ 핀 맵

**R-Pi4 > DHT-22(AM2302)**  

Pin 1 (3.3V) > Pin 1 (VCC)  
Pin 6 (GND) > Pin 3 (GND)  
Pin 7 (GPCLK0) > Pin 2 (SIG)  

아래의 사진을 참고하자.  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/raspberry-pi-dht22/mapping.png">
  <img src="/assets/images/post_img/iot/raspberry-pi-dht22/mapping.png" alt="pin_map">
</a>  

---  

## 🌿 온습도 측정

우선, `Adafruit_DHT` 라이브러리 설치  

`$ sudo pip3 install Adafruit_DHT`  

![adafruit](/assets/images/post_img/iot/raspberry-pi-dht22/adafruit.JPG)  

`파이썬 코드 작성`  

```python
import Adafruit_DHT as dht
import time

while True:
    humidity, temperature = dht.read_retry(dht.DHT22, 4)
    print("Temp={0:0.1f}*C  Humidity={1:0.1f}%".format(temperature, humidity))   
	time.sleep(1)
```

실행 후, 에어컨 앞에 가져가보았다.  
아래 사진과 같이 온도가 떨어지는 모습을 볼 수 있다.  
습도는 사무실이 너무 더워서? 그런것인지 잘 모르겠으나 맞는지를 확인할 방법이 없어 일단 패스.  

![result](/assets/images/post_img/iot/raspberry-pi-dht22/result.JPG)  

정확한 온습도는 나중에 알아보기로 하고, 일단은 온습도가 측정이 된다는 것을 확인하였음.  

---

## 🔥 Firebase에 올리기

측정한 값을 python으로 출력만 하면 무용지물이다.  
DB에 값을 올리는 작업을 진행해보자.  

나중에 이 올려놓은 값을 앱에서 읽을 것이고, UI에 보여주게 될 것이다.  

나는 firebase에 접근하여, 온습도 list를 update해줄 것이다.  
list의 max size는 24로 잡고, time_interval 간격으로 update할 계획.  
아래 파이썬 코드를 보자.  

```python
import Adafruit_DHT as dht
import time
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore # For cloud

cred = credentials.Certificate("./Key/serviceKey.json")
firebase_admin.initialize_app(cred)
farmId = "UW62BfvIjSLGGlinjkwx"
db = firestore.client()
max_index = 24 # 가지고 있을 list 최대 갯수
time_interval = 10 # 1시간 간격으로 데이터 측정

def list_update(li, element):
  global max_index
  
  if (len(li) >= 24):
    li.pop(0)
  
  if (len(li) <= 23):
    li.append(float('%0.2f'%element))
  
  return li

def upload(h, t):
  ref = db.collection(u'farmInformation').document(f'{farmId}')
  ref_data = ref.get().to_dict()
  update_h_list = list_update(ref_data['humidity'], h)
  update_t_list = list_update(ref_data['temperature'], t)
  
  ref.update({
    u'humidity' : update_h_list,
    u'temperature' : update_t_list
  })

while True:
  humidity, temperature = dht.read_retry(dht.DHT22, 4)
  print("Temp={0:0.1f}*C  Humidity={1:0.1f}%".format(temperature, humidity))
  print("Firebase Uploading...")
  upload(humidity, temperature)
  print("Firebase Upload Complete!")
  time.sleep(time_interval)
```
라즈베리파이에서 위 코드로 온습도를 측정하며 firebase에 계속 올려준다.  
굉장히 간단한 코드이고 잘 작동하는 것을 확인하였다.  

`결과`  
<a href="https://kdjun97.github.io/assets/images/post_img/iot/raspberry-pi-dht22/cloud.JPG">
  <img src="/assets/images/post_img/iot/raspberry-pi-dht22/cloud.JPG" alt="cloud">
</a>  

앱에서는 이 값을 firebase에서 읽어 그래프를 그려줄 것이다.  

---   

## 🔭 끝으로..

이번 온습도 프로젝트는 야외에서 하지 않고, 사무실 내에서 측정했기 때문에 조금 아쉬움이 있었다.  
다음 번에는 배터리를 가지고 바깥에서도 실험을 해보고 싶다.  

그리고 생각 외로 쉽게 온도, 습도가 측정되어 놀라웠다.  
재밌었다.