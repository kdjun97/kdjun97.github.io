---
title: "[Kotlin] No cached version of xxx available for offline mode"
excerpt: "gradle offline mode 에러"

categories:
  - Kotlin
tags:
  - [Kotlin, Android Studio]

permalink: /kotlin/gradle-offline-mode/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-07-15 10:00:00
last_modified_at: 2022-07-15 10:00:00
published: true

---  

## 🙄 직면한 에러..

한 프로젝트에서 두 명이 협업하는 상황이다.  
나는 A 부분을 수정하였고, 팀원은 B 부분을 수정하였다.  
각자의 수정 부분을 merge 후 A와 B부분이 합쳐진 code를 실행했을 때 문제가 생겼다.  

Build Error: `No cached version of androidx.paging:paging-runtime:3.1.1 available for offline mode.`  

에러가 엄청 많이 떴었고, 내가 담당한 부분이 아니었다.  
분명 팀원의 환경에선 잘 돌아가던 코드가 내 코드에서 작동을 하지 않아 당황했다.  

---  

### 😎 해결 과정

처음엔 gradle version 때문인가? 해서 version을 낮춰보기도 없애보기도 했다.  
이것저것 삽질 30분 정도 하다가 퇴근.  

퇴근 후, 집에서 다시 천천히 에러 메시지를 읽었다.  
그러다가 `offline mode` 라는 부분을 확인했다.  

gradle쪽에 문제가 있었던 부분은 맞았고, gradle build를 offline mode로 허용하지 않아 생긴 문제였다.  

나는 실제 기기를 USB 디버깅해서 테스트하였는데, 이 때 gradle의 offline 설정이 필요한가보다.(틀리다면 알려주세요!)  
이제 아래에서 해결 과정을 정리해보겠다.  

원인 : 협업을 하며 gradle이 변경되었을 때 일어난 에러.  
변경된 gradle에 build 설정이 문제였다.  

해결 : gradle build mode 변경 `(Toggle offline mode 버튼 이용)`  
**1.** 아래의 그림에서 Gradle을 클릭  
**2.** 아래의 그림 2번 버튼을 눌러 그림의 highlight 효과 제거  

![sovled](/assets/images/post_img/kotlin/gradle-offline-mode/solve.png)  

이렇게 하고 난 뒤, 다시 build해보면 앱이 잘 작동하는 모습을 볼 수 있을 것이다!  