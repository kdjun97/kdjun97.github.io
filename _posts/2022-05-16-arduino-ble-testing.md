---
title: "[Arduino] ESP32 BLE + 앱 연동 기초 예제(2)"
excerpt: "BLE 통신으로 데이터 주고 받기 예제"

categories:
  - IoT
tags:
  - [IoT, Arduino]

permalink: /iot/arduino-ble-testing/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-05-16 22:20:00
last_modified_at: 2022-05-16 22:20:00
published: true
---

🔥 총 3편으로 구성된 예제이다.  
{: .notice--warning}

### BLE Testing

**1.** `파일 → 예제 → ESP32 BLE Arduino → BLE_uart`  

![Untitled](/assets/images/post_img/arduino-ble-testing/Untitled.png)  
    
**2.** `코드 복사 붙여넣기`  

> 코드 출처 : [https://blog.naver.com/chandong83/222028742891](https://blog.naver.com/chandong83/222028742891)  
    
```cpp
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h> 
#include <BLE2902.h>  //ble 관련 라이브러리들 헤더
    
BLEServer *pServer = NULL;             // ESP32의 서버(Peripheral, 주변기기) 클래스
BLECharacteristic * pTxCharacteristic; // ESP32에서 데이터를 전송하기 위한 캐릭터리스틱
bool deviceConnected = false;          // BLE 연결 상태 저장
bool oldDeviceConnected = false;       // BLE 이전 연결 상태 저장
uint8_t txValue = 0;
    
#define SERVICE_UUID           "6E400001-B5A3-F393-E0A9-E50E24DCCA9E" // 서비스 UUID
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E" // ESP32가 데이터를 입력 받는 캐릭터리스틱 UUID (Rx)
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E" // ESP32에서 외부로 데이터 보낼 캐릭터리스틱 UUID (Tx)
    
// ESP32 연결 상태 콜백함수
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      //onConnect 연결 되는 시점에 호출 됨
      deviceConnected = true;
    };
    
    void onDisconnect(BLEServer* pServer) {
      //onDisconnect 연결이 해제되는 시점에 호출 됨
      deviceConnected = false;
    }
};
  
// ESP32 데이터를 입력 받는 콜백함수
class MyCallbacks: public BLECharacteristicCallbacks {  
    void onWrite(BLECharacteristic *pCharacteristic) {
      //onWrite 외부에서 데이터를 보내오면 호출됨 
      //보내온 데이터를 변수에 데이터 저장
      std::string rxValue = pCharacteristic->getValue();
      
      //데이터가 있다면..
      if (rxValue.length() > 0) {
        //시리얼 모니터에 출력
        Serial.println("*********");
        Serial.print("Received Value: ");
        for (int i = 0; i < rxValue.length(); i++)
          Serial.print(rxValue[i]);
    
        Serial.println();
        Serial.println("*********");
      }
    }
};
    
void setup() {
  //시리얼 활성
  Serial.begin(115200);
    
  // BLE 생성 "UART Service" 라는 장치명 사용
  BLEDevice::init("UART Service");
    
  // 서버(Peripheral, 주변기기) 생성
  pServer = BLEDevice::createServer();
  // 연결 상태(연결/해제) 콜백함수 등록
  pServer->setCallbacks(new MyServerCallbacks());
    
  // 서비스 UUID 등록 
  BLEService *pService = pServer->createService(SERVICE_UUID);
    
  // ESP32에서 외부로 데이터 보낼 캐릭터리스틱 생성 (Tx)
  // 캐릭터리스틱의 속성은 Notify만 가능하게 함
  pTxCharacteristic = pService->createCharacteristic(
										CHARACTERISTIC_UUID_TX,
										BLECharacteristic::PROPERTY_NOTIFY
									);
  // Client(Central, 모바일 기기등)에서 pTxCharacteristic 속성을 읽거나 설정할수 있게 UUID 2902를 등록
  // Client가 ESP32에서 보내는 데이터를 받기위해 해당 설정이 필요함.
  pTxCharacteristic->addDescriptor(new BLE2902());
    
  // Client가 ESP32로 보내는 캐릭터리스틱 생성 (Rx)
  // write 속성 활성
  BLECharacteristic * pRxCharacteristic = pService->createCharacteristic(
											 CHARACTERISTIC_UUID_RX,
											BLECharacteristic::PROPERTY_WRITE
										);
  // pRxCharacteristic에 client가 보낸 데이터를 처리할 콜백 함수 등록
  pRxCharacteristic->setCallbacks(new MyCallbacks());
    
  // 서비스 시작
  // 아직 외부에 표시가 안됨
  pService->start();
    
  // 어드버타이징 시작
  // 이떼 모바일에서 스캔하면 표시됨.
  pServer->getAdvertising()->start();
  Serial.println("Waiting a client connection to notify...");
}
    
void loop() {
    // BLE가 연결되었다면
    char txBuffer[10];
    if (deviceConnected) {
        sprintf(txBuffer, "%d\n", txValue); // 숫자를 문자로 변경해서 앱에서 보기 편하게 함
        pTxCharacteristic->setValue((uint8_t*)txBuffer, strlen(txBuffer));
        //notify 함수를 이용해 setValue로 써넣은 값을 외부로 전송함
        pTxCharacteristic->notify();
        //txValue를 증가
        txValue++;
        //10ms 대기
        //notify의 경유 indicate와 다르게 전송 후 확인이 없어서 연속해서 전송하게되면 Client가 데이터를 못 받을수 있다.
    delay(1000); // bluetooth stack will go into congestion, if too many packets are sent
  }
    
    // 연결상태가 변경되었는데 연결 해제된 경우
    if (!deviceConnected && oldDeviceConnected) {
        delay(500); // 연결이 끊어지고 잠시 대기
        //BLE가 연결되면 어드버타이징이 정지 되기때문에 연결이 해제되면 다시 어드버타이징을 시작시킨다.
        pServer->startAdvertising(); // 어드버타이징을 다시 시작시킨다.        
        Serial.println("start advertising");
    
        // 이전 상태를 갱신 함
        oldDeviceConnected = deviceConnected;
    }
    // 연결상태가 변경되었는데 연결 된 경우
    if (deviceConnected && !oldDeviceConnected) {
		// 이전 상태를 갱신 함
        oldDeviceConnected = deviceConnected;
    }
}
```  

**3.** `업로드`  

![Untitled](/assets/images/post_img/arduino-ble-testing/Untitled1.png)  
    
![Untitled](/assets/images/post_img/arduino-ble-testing/Untitled2.png)  

**4.** `시리얼 모니터 실행`  

![Untitled](/assets/images/post_img/arduino-ble-testing/Untitled3.png)  

**5.** `실행된 시리얼 모니터`  

![Untitled](/assets/images/post_img/arduino-ble-testing/Untitled4.png)  

⚠️ [3편에서 이어집니다](https://kdjun97.github.io/iot/arduino-ble-nrf-toolbox/)  
{: .notice--info} 