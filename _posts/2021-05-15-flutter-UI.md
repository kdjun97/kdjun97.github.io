---
layout: post
title:  "Flutter UI"
date:   2021-05-15 21:00:00
categories: [Tech]
excerpt: Flutter로 UI 구현하기.  
tags:
  - Flutter

---

### Flutter UI 

**Development Environment:**  
    **- Flutter 1.22.6**
    **- Android Studio 4.1.0**

이번 글은 데이터 연결없이 UI(껍데기만)만 만든 앱의 output을 다룬다.  
이는 **모바일 앱 개발**이라는 수업에서 중간고사로 다뤘던 내용이다.  

중간고사였기 때문에 소스는 첨부할 수 없고, (github private으로 올릴 예정)  
다 만들고 난 후의 output만 영상으로 첨부한다.  

로그인이나 다른 부분들을 database로 연결하는 부분은 다음 포스팅에서 다룰 예정임.  

### 앱 소개  

처음 login을 하고난 뒤 앱이 시작된다.  
호텔의 정보가 담겨져 있는 앱이고, GirdView나 ListView로 호텔에 대한 정보를 볼 수 있다.  
예약이나 search 기능이 있다.  
Favorite hotel에 대한 정보를 볼 수 있고 본인의 profile을 확인할 수 있는 mypage가 있다.  
모든 부분들은 database와는 연동이 되지 않은 상태이고, 대신 route간에 정보의 교환이 이루어진다.  
database를 배우지 않았을 때(혹은 사용하지 않았을 때)도 충분히 이런 기능들을 구현 가능하다.  
실제 동작 부분은 아래 output에서 확인할 수 있다.  

### Output  

![output](/assets/images/flutter_UI/flutter_UI.gif)   