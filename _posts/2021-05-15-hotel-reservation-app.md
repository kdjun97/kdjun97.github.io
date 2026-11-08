---
title: "[Flutter] Hotel 예약 앱 UI 만들기"
excerpt: "Database 연동 없이 호텔 예약 앱을 만들어보자"

categories:
  - Flutter
tags:
  - [Android, Flutter]

permalink: /flutter/hotel-reservation-app/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: "2021-05-15 21:00:00"
last_modified_at: "2021-05-15 21:00:00"
published: true
---

### 🏨 Hotel Reservation App(UI)

**Development Environment:**  
  - **Flutter 1.22.6**  
  - **Android Studio 4.1.0**  

이번 글은 데이터 연결없이 UI(껍데기만)만 만든 앱의 output을 다룬다.  
이는 **모바일 앱 개발**이라는 수업에서 대략 10일동안 작은 프로젝트로 다뤘던 내용이다.  

💡 로그인이나 다른 부분들을 database로 연결하는 부분은 다음 포스팅에서 다룰 예정임.  
{: .notice--info}

---

### ✔️ 앱 소개 및 배운점 

처음 login을 하고난 뒤 앱이 시작된다.  
호텔의 정보가 담겨져 있는 앱이고, GirdView나 ListView로 호텔에 대한 정보를 볼 수 있다.  
예약이나 search 기능이 있고, detail page에서 호텔 이미지를 더블클릭하면 favorite list에 저장된다.    
Favorite hotel에 대한 정보를 볼 수 있고 본인의 profile을 확인할 수 있는 mypage가 있다.  
모든 부분들은 database와는 연동이 되지 않은 상태이고, 대신 route간에 정보의 교환이 이루어진다.  
database를 배우지 않았을 때(혹은 사용하지 않았을 때)도 충분히 이런 기능들을 구현 가능하다.  

이 앱을 만들면서 widgets의 종류나 flutter에서 구현할 수 있는 기능들에 대해 다양하게 배울 수 있었다.  
예를 들면, `DatePicker`, `Hero`, `Dismissible`, `Rive` 등을 써봄과 써보지 않음은 분명히 큰 차이가 있을 것이다.  

또한, 실제로 내가 사용하던 앱의 기능들을 직접 개발할 수 있다는 자신감 또한 얻었다.  

---  

### ✏️ Output  

> 실제 앱이 동작하는 아래 영상으로 이 글을 마무리하겠다.  

![output](/assets/images/post_img/hotel-reservation-app/hotel_ui.gif)   