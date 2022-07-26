---
title: "[IoT] 앱과 연동하는 IoT (BLE 통신 예제) - 2편"
excerpt: "Flutter App과 ESP32 BLE 통신 예제"

categories:
  - IoT
tags:
  - [IoT, Flutter, Arduino]

permalink: /iot/esp-ble-with-flutter2/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-07-17 10:00:00
last_modified_at: 2022-07-17 10:00:00
published: true

---  

## 🙄 What to do?

> 1편 내용에서 이어지니 1편을 보지 않았다면 위 링크를 타고 정독한 후 읽길 바란다.  
> [전편 참고 : [IoT] 앱과 연동하는 IoT (BLE 통신 예제) - 1편](https://kdjun97.github.io/iot/esp-ble-with-flutter1/)  

우리는 앱을 만들 것이다.  
더 정확히는 IoT기기에 달린 센서와 데이터를 주고받는 앱을 만들 것이다.  
아래에서 이번 프로젝트의 목표를 알아보자.  

`Data Read`  
받을 데이터 : `토지 수분 함량`  
센서에서는 1초마다 정보를 보내준다고 하였다. -> 즉, 센서에서 보내는 데이터를 받고 읽을 수 있으면 된다.  

`Data Write`  
보낼 데이터 : `Water Valve open/close 값`  

이 프로젝트에서는 실제 농장과 토지가 없으므로, 간이로 테스트를 하겠다.  

`Our Goal`  
앱 : ESP 보드에서 1초마다 주는 데이터를 주는 값을 <u>UI에 표시</u>  
보드 : **Arduino IDE**에서 시리얼 모니터로 <u>보드에 들어오는 값을 확인</u>  

앱에서 받는 데이터는 토지 수분 함량이라 생각하고, 우리가 보드에 줄 데이터는 버튼 pressed 유무라고 생각하자.  
실제로는 data parsing, 서버에 upload, logic 처리 등 다양한 작업들이 있겠지만, 지금은 **기능을 검증하는 단계**이기 때문에 아주 간단한 형태로 `검증`을 목표로 한다.  

잊지 말자. 이 프로젝트의 전제는 **"하드웨어 팀에서 센서 처리를 다 완료하였고, 앱과 보드가 BLE로 통신하는 부분만 처리한다"**  이다.  
다른 부분은 생각하지 않고, 오로지 앱과 보드의 connection 및 데이터 송수신 기능만 구현해보겠다.  
이제 시작해보자.  

---  

### 🛹 앱과 보드 연결

ESP32 보드를 서버, 앱을 클라이언트로 작동시킬 것이다.  
보드에 업로드하는 코드는 [ESP32 BLE + 앱 연동 기초 예제(2)](https://kdjun97.github.io/iot/arduino-ble-testing/)를 참고하자.  

보드에서 UUID와 CHARACTERISTIC과 DEVICE_NAME을 설정해주었다.  
따라서, 우리도 앱에서 같은 값을 주어 디바이스를 찾아 연결을 할 것이다.  
```dart
final String SERVICE_UUID =           "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
final String CHARACTERISTIC_UUID_RX = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
final String CHARACTERISTIC_UUID_TX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
final String TARGET_DEVICE_NAME =     "ESP32 TEST";
```

연결 과정을 간략히 보자면 아래와 같다.  

1. 서버가 클라이언트가 감지할 수 있는 정보를 뿌리며 서버를 알림 (advertising)  
1. 클라이언트는 scanning을 하며 server를 찾음
1. 위의 값들을 통해 자신이 맞는 서버를 찾아서 connection 요청을 함
1. 클라이언트는 수신할 데이터를 listen함 (listener 설정)
1. 클라이언트가 서버로 데이터를 write하면, 서버측의 callback 함수가 작동하여 시리얼 모니터에 출력해준다 (MyCallbacks)  

정석은 ListView로 Scanning 가능한 device들을 보여주고, 유저가 connection 요청을 하는 것이다.  
하지만 이번 예제에서는 그냥 시간에 따른 scanning 결과를 보여주어 안정성이 떨어진다(시간 내 connection을 하지 못하면 재연결 불가)  
기능 검증을 위해 빠르게 만들어보고, 코드 리팩토링은 나중에 하는걸로 하자..  

이번 포스팅에서는 3번까지만 다뤄 보도록 하겠다.  

---  

#### 🌼 서버 advertising

> [코드 출처](https://blog.naver.com/chandong83/222028742891)  

`서버 advertising 및 연결 관련 함수`  

```cpp
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

// 연결 상태(연결/해제) 콜백함수 등록
pServer->setCallbacks(new MyServerCallbacks());

// 서비스 시작
// 아직 외부에 표시가 안됨
pService->start();
    
// 어드버타이징 시작
// 이떼 모바일에서 스캔하면 표시됨.
pServer->getAdvertising()->start();

void loop() {
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
		/ 이전 상태를 갱신 함
      oldDeviceConnected = deviceConnected;
  }
}
```

---  

#### 🌻 클라이언트 scanning

`BLUETOOTH Permission(AndroidManifest.xml)`  

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.esp32">
		// Add BLUETOOTH Permission
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```  

```dart
late List<ScanResult> scanResult; // Bluetooth Device Scan List
late BluetoothDevice targetDevice;
late BluetoothCharacteristic targetCharacteristicRx;
late BluetoothCharacteristic targetCharacteristicTx;

// Scan을 시작함. List에 넣기만 하는 함수.
Future<void> startScan() async {
  print("Start Scan!");
      
  // Start scanning 3초간 진행됨.
  flutterBlue.startScan(timeout: const Duration(seconds:3), allowDuplicates: false);
      
  // Scan이 시작되는 동안에 받는 listener 관련 액션을 수행함.
  flutterBlue.scanResults.listen((results) {
  },onError: (e) =>print(e)
  ).onData((data) {print(data.length); scanResult=data;});
  // Stop scanning
  flutterBlue.stopScan();
  Future.delayed(const Duration(seconds: 5) , (){scanDevice();});      
}
// TODO: 비동기 처리 문제가 있지만, 일단은 넘어감.
// 좋지 않은 코드임. 응용하길 바람.

// Scan List에 있는 Device들 중, 내가 원하는 Device를 찾는 함수
Future<void> scanDevice() async {
  for (ScanResult r in scanResult) {
    if (r.device.name == TARGET_DEVICE_NAME)
    {
      print("Target : ${r.device.name} Found!");
      if (!isConnected) {
        targetDevice = r.device;
        // Device Connect를 여기서 함.
        await connectToDevice(targetDevice);
      }
    }
  }
}
// Duplication 방지를 위해 isConnected 조건문을 줬음.
// 이 역시 비동기 처리 문제가 있음.
```

--- 

#### 🌹 서버 클라이언트 연결

```dart
// 디바이스 연결을 위한 함수
Future<void> connectToDevice(BluetoothDevice device) async {
  if (device == null) return;
      
  if (!isConnected) {
    await device.connect();
    isConnected = true;
    await discoverServices(device);
  }
}
```  

---  

#### 🌸 클라이언트 설정

```dart
// 필요한 값들(서비스, 캐릭터리스틱 등)을 셋팅해줌
Future<void> discoverServices(BluetoothDevice device) async {
  if (device == null) return;
      
  // 서비스 리스트 중 내 기기에 맞는걸? 찾아야함.
  List<BluetoothService> services = await device.discoverServices();
  services.forEach((service) {
    if (service.uuid.toString() == SERVICE_UUID) {
      service.characteristics.forEach((characteristic) {
        print(characteristic.uuid);
        if (characteristic.uuid.toString() == CHARACTERISTIC_UUID_RX) {
          targetCharacteristicRx = characteristic;
        }
        else if (characteristic.uuid.toString() == CHARACTERISTIC_UUID_TX) {
          targetCharacteristicTx = characteristic;
      
          characteristic.setNotifyValue(true);
          characteristic.value.listen((value) {
            if (value.length >0) {
              receivedValue=value[0].toString();
              print("**[$receivedValue]**");
            }
            setState(() {}); // rebuild를 위함
          });
        }
      });
    }
  });
}
```

---

#### 🌷 연결 끝

위 코드를 응용하면 디바이스와 연결할 수 있을 것이다.  
하지만, 위 코드에서는 안정성의 문제가 있다.  
블루투스 연결이 갑자기 끊겼을 경우, 혹은 재연결 등의 문제가 있다.  
물론, 연결이 끊겼을 때, listener를 없애주고, 관련된 모든 값들을 dispose하면 되지만 그 부분은 추가적으로 다루지 않겠다.  

원하는 디바이스를 찾을 때까지 scanning을 하고, scanning된 device가 ListView 목록에 뜨도록 변경한 뒤,  
disconnect 메소드를 만들어 깔끔히 연결 처리를 해준다면, connection 부분은 끝났다고 할 수 있다.  

이어지는 3편에서 데이터 송수신에 대해 알아보도록 하자.  

> [3편에서 이어집니다](https://kdjun97.github.io/iot/esp-ble-with-flutter3/)  

🔥 포스팅에 틀린 내용이 있다면 알려주시면 감사하겠습니다!  
{: .notice--warning}   