---
title: "[Arduino] ESP32 BLE + 앱 연동 기초 예제(3)"
excerpt: "nRF Connect 앱을 이용한 테스팅"

categories:
  - IoT
tags:
  - [IoT, Arduino]

permalink: /iot/arduino-ble-nrf-connect/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: "2022-05-23 10:10:00"
last_modified_at: "2022-06-01 08:10:00"
published: true
---  

🔥 총 3편으로 구성된 예제이다.  
이 글을 포스팅 할 5.23 당시에는 nRF Toolbox라는 앱으로 테스팅을 진행했었다.  
하지만, 현재 nRF Toolbox앱은 테스팅 진행이 되지 않아 다른 앱으로 다시 포스팅을 함을 알린다.  
{: .notice--warning}  

## ✏️ 테스팅 전 준비물

`OS`: `Windows`  
`보드`: `ESP32 DevKit V1`  
`Arduino` : `1.8.19 Version`  
`설치 앱`: `nRF Connect for Mobile`    

### 🛠️ nRF Connect Testing

**1.** 플레이스토어에서 `**nRF Connect for Mobile**` 검색 및 설치  
    
![Untitled](/assets/images/post_img/arduino-ble-nrf-connect/Untitled.png)  
    
**2.** `nRF Connect 앱 실행 (자동 스캐닝이 안된다면, 메인 화면 우측 상단에 SCAN 터치)`   
    
![Untitled1](/assets/images/post_img/arduino-ble-nrf-connect/Untitled1.png)  
    
**3.** `UART Service 우측 CONNECT Click` (미리 생성한 이름을 알고 있기에 그것을 선택)  
    
```cpp
void setup() {
  //시리얼 활성
  Serial.begin(115200);
    
  // BLE 생성 "UART Service" 라는 장치명 사용
  BLEDevice::init("UART Service");
```

![Untitled2](/assets/images/post_img/arduino-ble-nrf-connect/Untitled2.png)  
    
**4.** `Upload Speed Setting` (하단에 `**115200 보드레이크**` 변경)  

**Arduino upload speed**를 `115200`으로 맞췄기 때문에 전부 맞춰줘야한다.  
    
```cpp
void setup() {
  //시리얼 활성
  Serial.begin(115200);
```
![Untitled3](/assets/images/post_img/arduino-ble-nrf-connect/Untitled3.png)  
    
**5.** `RX Characteristic 우측 상세 버튼 누르기`  
    
![Untitled4](/assets/images/post_img/arduino-ble-nrf-connect/Untitled4.png)  
    
**6.** `Write Value Test`  

원하는 value를 적고 SEND를 누르자.  
이 예제의 경우 hi를 보내보겠다.  
    
![Untitled5](/assets/images/post_img/arduino-ble-nrf-connect/Untitled5.png)  
    
**7.** `앱에서 확인`  
    
![Untitled6](/assets/images/post_img/arduino-ble-nrf-connect/Untitled6.png)  
    
**8.** `시리얼 모니터에서 확인`  
    
![Untitled7](/assets/images/post_img/arduino-ble-nrf-connect/Untitled7.png)  
    
**9.** `Read Value Test(Enable CCCDs)`  

CCCD를 Enable 해줌으로 Charcteristic 값을 읽을 수 있게 됨  
    
![Untitled8](/assets/images/post_img/arduino-ble-nrf-connect/Untitled8.png)  
    
**10.** `화살표 방향으로 핸드폰을 swipe`  

보드에서 보내는 값을 잘 읽어들이는 것을 확인할 수 있다  
    
![Untitled9](/assets/images/post_img/arduino-ble-nrf-connect/Untitled9.png)  

---

#### 🍒 Test 끝!  

💡 어떻게 ESP Board와 앱이 연결될 수 있나요??  
{: .notice--info}   

BLE 통신과 ESP 보드가 어떻게 통신을 하는지에 대해 알아볼 필요가 있다.  
이 부분은 따로 포스팅을 통해 자세히 알아보자.  

지금 예제에서는 그저 누군가가 만들어놓은 앱과 보드가 데이터를 주고받을 수 있다는 점.  
그리고 우리가 이러한 앱을 만들 것이라는 점만 알도록 하자!  