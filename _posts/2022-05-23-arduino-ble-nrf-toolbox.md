---
title: "[Arduino] ESP32 BLE + 앱 연동 기초 예제(3)"
excerpt: "nRF ToolBox를 이용한 테스팅"

categories:
  - IoT
tags:
  - [IoT, Arduino]

permalink: /iot/arduino-ble-nrf-toolbox/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-05-23 10:10:00
last_modified_at: 2022-05-23 10:10:00
published: true
---

🔥 총 3편으로 구성된 예제이다.  
{: .notice--warning}  

> [1편](https://kdjun97.github.io/iot/arduino-ide-setting/)  
> [2편](https://kdjun97.github.io/iot/arduino-ble-testing/)  

# 테스팅 전 준비물

`준비물`  

`OS`: `Windows`  
`보드`: `ESP32 DevKit V1`  
`Arduino` : `1.8.19 Version`  
`설치 앱`: `nRF Toolbox for Bluetooth LE`  

---  

### nRF ToolBox Testing  

**1.** 플레이스토어에서 `nRF Toolbox for Bluetooth LE` 검색 및 설치  

![Untitled](/assets/images/post_img/arduino-ble-nrf-toolbox/Untitled.png)  

**2.** `nRF Toolbox 앱 실행 (Utils services → UART 클릭)`  

![Untitled](/assets/images/post_img/arduino-ble-nrf-toolbox/Untitled1.png)  

**3.** `Permission`  
    
![Untitled](/assets/images/post_img/arduino-ble-nrf-toolbox/Untitled2.png)  

**4.** `UART Service Click` (미리 생성한 이름을 알고 있기에 그것을 선택)  

```cpp
void setup() {
  //시리얼 활성
  Serial.begin(115200);
    
  // BLE 생성 "UART Service" 라는 장치명 사용
  BLEDevice::init("UART Service");
```

![Untitled](/assets/images/post_img/arduino-ble-nrf-toolbox/Untitled3.png)  

**5.** `Input Test` (하단에 `**115200 보드레이크**` 변경)  

**Arduino upload speed**를 `115200`으로 맞췄기 때문에 전부 맞춰줘야한다.  
    
```cpp
void setup() {
  //시리얼 활성
  Serial.begin(115200);
```
![Untitled](/assets/images/post_img/arduino-ble-nrf-toolbox/Untitled4.png)  

**6.** `Output test`  

![Untitled](/assets/images/post_img/arduino-ble-nrf-toolbox/Untitled5.png)  

위와 같이 nRF ToolBox 앱을 통해서 보드에 데이터가 전송되고,  
보드로부터 데이터가 실시간으로 찍히는 것을 볼 수 있다.  

---

#### Test 끝!  

💡 어떻게 ESP Board와 앱이 연결될 수 있나요??  
{: .notice--info}   

BLE 통신과 ESP 보드가 어떻게 통신을 하는지에 대해 알아볼 필요가 있다.  
이 부분은 따로 포스팅을 통해 자세히 알아보자.  

아래는 uart nRF ToolBox의 opensource 중, service uuid에 대한 부분이다.  
![src](/assets/images/post_img/arduino-ble-nrf-toolbox/uuid.JPG)  

```cpp
#define SERVICE_UUID           "6E400001-B5A3-F393-E0A9-E50E24DCCA9E" // 서비스 UUID
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E" // ESP32가 데이터를 입력 받는 캐릭터리스틱 UUID (Rx)
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E" // ESP32에서 외부로 데이터 보낼 캐릭터리스틱 UUID (Tx)
```  

앱과 아두이노에서 맵핑이 위와 같이 이루어졌기 때문에 수월하게 connection이 가능하다.  

지금 단계에서는 우리가 짠 ble_uart 소스 코드와 nRF ToolBox 앱의 셋팅이 같다라고만 이해하자!

> [Github OpenSource](https://github.com/NordicSemiconductor/Android-nRF-Toolbox/blob/c73f0099ab85e1c5e01afb9c83fbcb98dd335024/profile_uart/src/main/java/no/nordicsemi/android/uart/data/UARTManager.kt)  
> 궁금하다면 이 소스코드를 보면 도움이 될 것이다!