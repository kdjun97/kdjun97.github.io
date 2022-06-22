---
title: "[Flutter] Android 12 Bluetooth Permission Issue (using flutter_blue plugin)"
excerpt: "flutter_blue_plus를 이용한 bluetooth 통신 issue 해결(Android 12 Permission Issue)"

categories:
  - Flutter
tags:
  - [Flutter]

permalink: /flutter/flutter-blue-plus/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-06-21 08:30:00
last_modified_at: 2022-06-21 08:30:00
published: true
---

## 😒 Flutter와 Bluetooth 연동

인턴십에서 Flutter와 `Bluetooth`를 연동해야하는 프로젝트가 생겼다.  
IoT 앱을 개발하는 프로젝트였고, ESP Board와 connection을 맺고 서로 데이터를 송수신하는 기능이 필요하였다.  
처음에는 Android 11 Version을 사용하는 태블릿 기기에서 테스팅을 진행하였다.  

Flutter에서 Bluetooth 연결을 도와주는 plugin인 [flutter_blue (pub.dev)](https://pub.dev/packages/flutter_blue)를 사용하여 개발을 진행하였고, 무리 없이 connection이나 data가 잘 오가는 것을 확인했었다.  
하지만 2개월 뒤 태블릿 기기를 추가 구매하여 테스트를 하였을 때, 에러가 떴었다.  
분명 잘 되던 기능들이 왜 안될까 살펴보았고, 주된 내용은 `Android Permission`에 관한 내용이였다.~~scanning 자체가 되지 않음~~  

`이유는 Android 12 Version부터 Permission 정책이 바뀌었다는 점이었다.`  
즉, Android 12 Version 미만의 기기는 문제없지만 12 버전 위의 기기를 사용하려면 이 에러를 잡아야 한다는 말씀.  

---

## 🙄 어떻게 해결할까? 

많은 상상들을 했었다.  
어떻게 해결을 할 것인가?  

1. 안드로이드 11 버전 이하 기기만 사용할까?  
1. `AndroidManifest.xml`에 권한을 직접 주면 되는가?  
1. `Permission` 관련 plugin을 사용하여 앱 내에서 권한을 수동으로 체크해줄 것인가?  
1. `main.dart` 실행 시, permission을 바로 줘버려?  
1. 그것도 아니라면 flutter_blue 플러그인을 뜯어야하나?
1. 다른 플러그인을 사용할까?  
1. 아예 안되는건가? (Flutter로는 이러한 이슈가 계속 발생될 것 같으니 맘 편하게 native로 할까?)  
1. ~~오늘 저녁 뭐먹지?~~

상당히 heavy한 생각도 있었고, 이렇게 하면 될 것 같은데? 하는 생각도 있었다.  
손이 많이 가지 않는 것들에 한해 몇 가지 테스트를 하였고, 현실적으로 될 것 같은 후보군들을 테스트 하였다.  
그리고.... 여전히 오류는 해결되지 않았다.....  

그렇게 사안이 상당히 무거워지고 있을 어느날... ~~날이 적당한 어느날....~~  
`해결 방법을 찾게 되었다.`  

---  

## 🔓 해결  

사실 제일 좋은 방법은, `셋팅 단에서 해결되거나`, `permission을 앱 내에서 주는 방법`, `플러그인 변경` 순서였다.  

그 중, 하나의 방법인 `플러그인 변경` 방법으로 이슈를 해결하게 되였고, 과정은 아래와 같다.  

기존에 사용한 plugin : `flutter_blue: ^0.8.0`  
신규 찾은 plugin : `flutter_blue_plus: ^1.1.3` (자세한 정보는 아래 링크 참조)  
[flutter_blue_plus (pub.dev)](https://pub.dev/packages/flutter_blue_plus)  

새로 찾은 plugin을 채택한 이유는 `기존 flutter_blue의 upgrade버전`이면서 직면한 이슈에 대한 `Changelog`가 존재했기 때문.(Android Permission)   
따라서, 기존에 사용하던 함수의 틀에서 벗어나지 않지만, Android Version Issue 문제를 해결해주었다 라고 보았고, test를 해본 결과 안드로이드 11, 12 버전에서 flutter 앱과 Bluetooth 기기가 잘 통신하는 것을 볼 수 있었다.  

아래는 `flutter_blue` 에서 `flutter_blue_plus` plugin으로 교체한 소스 코드이다.  

```yaml
# 의존성 수정
dependencies:
  # flutter_blue: ^0.8.0
  # 기존 플러그인 삭제
  flutter_blue_plus: ^1.1.3
```

```dart
    // FlutterBlue flutterBlue = FlutterBlue.instance;
    // 기존 flutter_blue의 인스턴스 선언에서 아래와 같이 변경
    FlutterBluePlus flutterBlue = FlutterBluePlus.instance;
```

굉장히 짧은 코드 변경으로 issue를 해결할 수 있었다.  
사실 정말 native단을 만질 생각을 했었는데, plugin이 나와줘서 정말 다행이다..  

🔥 알게된 사실.  
잘 되던 코드가 버전 업에 인해 오류가 발생할 수 있다.  
당황하지 마라. 방법은 있다. 그게 뭐가 됐든...  
{: .notice--warning}  