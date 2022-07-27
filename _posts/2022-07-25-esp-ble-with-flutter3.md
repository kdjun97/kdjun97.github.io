---
title: "[IoT] 앱과 연동하는 IoT (BLE 통신 예제) - 3편"
excerpt: "Flutter App과 ESP32 BLE 통신 예제"

categories:
  - IoT
tags:
  - [IoT, Flutter, Arduino]

permalink: /iot/esp-ble-with-flutter3/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-07-25 10:00:00
last_modified_at: 2022-07-25 10:00:00
published: true

---  

## 🔥 간단한 리뷰..

> [1편 참고](https://kdjun97.github.io/iot/esp-ble-with-flutter1/)  
> [2편 참고](https://kdjun97.github.io/iot/esp-ble-with-flutter2/)   
> [아두이노 코드 출처](https://blog.naver.com/chandong83/222028742891)  

2편에서의 4번, 5번에 해당하는 데이터 송수신 부분에 대해 알아보도록 하자.  

---  

### 📲 앱과 보드 통신 (Data Read)

서버는 notify로 증가하는 데이터를 앱에 계속 보냄.  

`서버 코드`  

```cpp
// ESP32에서 외부로 데이터 보낼 캐릭터리스틱 생성 (Tx)
// 캐릭터리스틱의 속성은 Notify만 가능하게 함
pTxCharacteristic = pService->createCharacteristic(
  CHARACTERISTIC_UUID_TX,
	BLECharacteristic::PROPERTY_NOTIFY
);
// Client(Central, 모바일 기기등)에서 pTxCharacteristic 속성을 읽거나 설정할수 있게 UUID 2902를 등록
// Client가 ESP32에서 보내는 데이터를 받기위해 해당 설정이 필요함.
pTxCharacteristic->addDescriptor(new BLE2902());

void loop() {
  // BLE가 연결되었다면
  char txBuffer[10];
  if (deviceConnected) {
    sprintf(txBuffer, "%d\n", txValue);
    pTxCharacteristic->setValue((uint8_t*)txBuffer, strlen(txBuffer));
    //notify 함수를 이용해 setValue로 써넣은 값을 외부로 전송함
    pTxCharacteristic->notify();
    //txValue를 증가 (txValue는 정수로 선언되어있음)
    txValue++;
    //notify의 경유 indicate와 다르게 전송 후 확인이 없어서 연속해서 전송하게되면 Client가 데이터를 못 받을수 있다.
    delay(1000); // bluetooth stack will go into congestion, if too many packets are sent
  }
}
```

앱은 listener를 설정해 들어오는 값에 반응을 한다.  

`클라이언트 코드`  

```dart
targetCharacteristicTx = characteristic;
        
characteristic.setNotifyValue(true);
characteristic.value.listen((value) {
  if (value.length >0) {
    receivedValue=value[0].toString();
    print("**[$receivedValue]**");
  }
  setState(() {});
});
```

조금 다른 예제로 string에 반응하는 코드이다.  
보드 팀에서 보내주는 데이터가 temp:27 과 같은 값이라면?(온도:27도)  
split을 이용하여 원하는 데이터 포맷이 날아오면 반응을 할 수 있다.  
하지만 아래의 방법은 <u>length 20</u>까지만 허용이 된다.  
MTU가 `20`으로 제한되어있기 때문. 따라서 `MTU Negotiation`을 해야한다.  

```dart
// MTU 협상 (connectToDevice 함수 안)
await espController.targetDevice.connect(autoConnect: false);
espController.isConnected = true;
// MTU 50으로 설정
await espController.targetDevice.requestMtu(50);
int mtu = await espController.targetDevice.mtu.first;
// 협상 결렬? 그럼 다시 협상 ㄱㄱ
while (mtu != 50) {
  print("Waiting for requested MTU");
  await Future.delayed(Duration(seconds: 1));
  mtu = await espController.targetDevice.mtu.first;
}
print('*********************DEVICE CONNECTED*********************');
await DiscoverServices().discoverServices(espController);
```

```dart
// ASCII Code가 들어왔을 때, string 으로 변환해줌 (ex [65 69 80 90 88])
// 실제로 string 데이터가 들어오면 List<int> 형태로 들어온다
// 그리고 int값은 ASCII Code 값이다.
characteristic.value.listen((value) {
  String boardValue = String.fromCharCodes(value);
  if (boardValue.split(':')[0] == "code") {
    Your code...
  }
})
```

---  

### 📲 앱과 보드 통신 (Data Write)  

클라이언트가 서버로 데이터를 write하면, 서버측의 callback 함수가 작동하여 시리얼 모니터에 출력 (MyCallbacks)  
`서버 코드`  

```cpp
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
    
      Serial.println("\n*********");
    }
  }
};

// Client가 ESP32로 보내는 캐릭터리스틱 생성 (Rx)
// write 속성 활성
BLECharacteristic * pRxCharacteristic = 
  pService->createCharacteristic(
		CHARACTERISTIC_UUID_RX,
		BLECharacteristic::PROPERTY_WRITE
  );
// pRxCharacteristic에 client가 보낸 데이터를 처리할 콜백 함수 등록
pRxCharacteristic->setCallbacks(new MyCallbacks());
```

또한, 클라이언트는 connection 하며 Rx 정보를 잡아줬고, Rx.write로 데이터를 write해줌.  

`클라이언트 코드`  

```dart
// 메시지 전송 처리
void sendMessage() {
  writeData(msgController.text);
  msgController.clear();
}

writeData(String data) async {
  if (targetCharacteristicRx == null) return;
      
  List<int> bytes = utf8.encode(data);
  await targetCharacteristicRx.write(bytes);
}
```

---  

### 🌻 전체 흐름 + 마무리

위 과정까지 다 한다면, connetion 및 데이터 송수신이 가능할 것이다.  
아쉽게도 사진은 없다. 실제 보드를 가지고 테스트 하고 몇 개월이 지나고 포스팅을 하기 때문...  
지금은 보드가 없어 구동 사진을 첨부할 순 없지만, 작동되는 코드이니 안심하도록  

만약 Android Version 12.0 이상을 사용하는데, Bluetooth 관련 에러가 뜬다면, 아래로 가도록  
[이 포스팅으로 가시오](https://kdjun97.github.io/flutter/flutter-blue-plus/)  

이제 진짜 전체 흐름을 정리해보자.  

![flow](/assets/images/post_img/iot/esp-ble-with-flutter3/flow.png)  

이번 포스팅은 협업을 한다는 전제 + BLE 통신을 한다는 전제로 작성되었다.  
수 많은 상황들이 있겠지만, 이렇게 시나리오를 미리 짜고, 시나리오에 맞게 기능을 검증하는 해보았다.  
이제 검증이 완료되었으니, 보드 팀이 센서작업을 해주어 데이터를 전송해주면 앱에서 뽑을 수 있을 것이다.  
또한 보드로 데이터를 보낼 수 있으니, 근거리 통신은 가능하겠다!  

잘 짜여진 코드도 아니고, 기능 검증을 위해 빠른 시간 내에 코드를 짜서 그런지, 코드 내에 수정할 부분이 많다.  
하지만 필요한 부분만 응용하여 쓴다면 좋은 예시가 될 것이다!  

🔥 포스팅에 틀린 내용이 있다면 알려주시면 감사하겠습니다!  
{: .notice--warning}   