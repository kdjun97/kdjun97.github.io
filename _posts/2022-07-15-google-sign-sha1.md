---
title: "[Kotlin] Error: com.google.android.gms.common.api.ApiException: 10"
excerpt: "google sign 관련 에러 (SHA-1 인증서 키 설정)"

categories:
  - Kotlin
tags:
  - [Kotlin]

permalink: /kotlin/google-sign-sha1/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-07-15 08:40:00
last_modified_at: 2022-07-15 08:40:00
published: true

---  

### 🙄 에러 발생

팀원과 협업 하던 도중, google sign 관련 리팩토링을 진행하였다.  
프로젝트 생성 및 초기 셋팅은 팀원이 했기 때문에, 나의 인증서 키나 어떠한 셋팅도 들어가있지 않은 상태.  

로직을 다 짰고, 리팩토링이 완료되었다고 생각하고 build! 했지만 error 발생.  

Error: `com.google.android.gms.common.api.ApiException: 10`  

정확히는 구글 로그인이 되지 않았음.  

```kt
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == GOOGLE_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
              // account 부분에서 catch문 걸림
              var account = task.getResult(ApiException::class.java)
              ...
            }
            ...
        }
        ...
}
```  

위 소스코드(Google SignIn 부분) account부분에서 catch문이 발동된다.  
문제는, 저 부분을 초기 내가 만들지 않았다.  

원래 google-sign을 이용하려면 SHA-1 설정, firebase에 등록, OAuth? 뭔가 많은 것을 했었다.    
하지만 1년 전에 구글 sign 관련 기능을 만들고 너무 오랜만이라 기억이 나지 않았고 이번 google sign 부분은 내가 만들지 않았다는 것이 문제였다.    

출근 5시간동안 깔끔하게 에러만 보다가 해결한 과정을 아래에서 다뤄보자.  

---  
### 📎 해결 과정

> 참고 : https://goni9071.tistory.com/489  

Error: `com.google.android.gms.common.api.ApiException: 10`  

삽을 많이 푼 결과 이 에러는 FingerPrint가 일치하지 않을 때 발생한다고 한다.(인증이 일치하지 않을 때 발생)  

이 에러는 총 3가지 조건을 본다고 한다.  

1. 테스트하는 앱 
2. 구글 API OAuth 인증 
3. Firebase Project  

나 같은 경우, 모든 경우에 해당한다고 볼 수 있었다.  
특히 디버깅 중인 앱이라면 작업 컴퓨터가 달라졌을 때, FingerPrint가 달라진다고 한다.  
즉, 협업할 때, 컴퓨터가 바뀌면 구글 API에서 인증을 추가적으로 받아야 함.  

---  

#### 🔐 SHA-1 디버그 키

첫번째로, `디버그 인증서 (SHA-1)`를 확인한다.  

![sha1](/assets/images/post_img/kotlin/google-sign-sha1/sha1.png)  

위 그림처럼 우측에 1번 Gradle을 클릭하고, 2번 코끼리 아이콘을 클릭한다.  

![signingReport](/assets/images/post_img/kotlin/google-sign-sha1/signingReport.png)  

그리고 난 뒤, 창이 뜨면, `signingReport`를 타이핑 하고, run(enter)한다.  

![result](/assets/images/post_img/kotlin/google-sign-sha1/result.png)  

`SHA-1` 키를 쉽게 획득할 수 있다.  

---  

#### 🍩 Google Cloud Console 설정

Google Sign을 이용할 것이기 때문에, 우리도 `Google Cloud Console`에 설정을 해주어야 한다.  

![oauth](/assets/images/post_img/kotlin/google-sign-sha1/oauth.png)  

`사용자 인증 정보 만들기` 클릭  
만약 초기 상태(빈 화면)이라면 우측 상단에 `프로젝트 만들기`를 클릭하여 프로젝트 생성 후 사용자 인증 정보 만들기를 누르면 된다.  

![oauth2](/assets/images/post_img/kotlin/google-sign-sha1/oauth2.png)  

그 후, `OAuth 클라이언트 ID` 클릭  

![oauth3](/assets/images/post_img/kotlin/google-sign-sha1/oauth3.png)  

애플리케이션 유형 : Kotlin이니 `Android`  
이름 : `자유형식, 식별하기 쉬운 이름`  
패키지 이름 : **AndroidManifest.xml**의 최상단 package="`com.~~`"의 highlight 부분  
ex) `com.example.nuru`  
SHA-1 인증서 디지털 지문 : `위에서 뽑은 SHA-1 키`  

---  

#### 🔥 Firebase 프로젝트 설정  

`Firebase 본인 프로젝트` - `프로젝트 설정`에 들어간다.  
나의 경우, 이미 셋팅이 되어있었다.  

![firebase](/assets/images/post_img/kotlin/google-sign-sha1/firebase.png)   

💡 SHA-1가 두 줄인 이유는 팀원 1, 내가 올린 부분 1 이렇게 총 2개이다.  
{: .notice--info}  

이미 셋팅 되어있는(팀원이 셋팅해놓은) 설정에서 나의 `SHA-1`키를 등록시켜 주자.  
위의 `SHA-1` 키를 붙여넣기 하면 등록이 쉽다.  

이렇게 Firebase 프로젝트 설정까지 완료하였으면, 자신의 환경에서 정상적으로 `Google Sign In`이 가능해졌을 것이다.  

~~이 SHA-1 등록으로 오늘 5시간가량 날렸다.~~  

---  

#### 🙄 의문점 

`google-service.json`을 바꾸지 않았음에도 왜 작동이 될까?  
또한, `Google Map API`를 사용하는 경우에 에러가 뜬다.  
물론 내 파트가 아니라 손대지는 않았지만 어떤 부분을 바꾸어 주어야 할까? 의문점이 든다.  

어쨋든, 위 인증키를 설정하면, 더이상 `com.google.android.gms.common.api.ApiException: 10` 에러는 나지 않는다.  

다시 한 번 말하지만, 나의 상황은 이미 팀원이 `Google-Sign-In` 기능을 만들고 난 후, 기능이 잘 작동되는 상황에서 리팩토링하기 위해 접근한 상황이었다.  

혼자 하는 프로젝트에서의 설정은 쉽지만(혼자 초기 셋팅하면 끝이니까) 협업을 할 때, 이렇게 인증서를 등록해야하는 경우에서 나의 포스팅이 도움이 되길 바란다.  

❓ google-service.json을 바꾸지 않아도 정상 작동하는 문제  
협업에서 Google Map API 설정 문제에 대해 답을 아시는 분은 알려주시면 감사하겠습니다!  
{: .notice--warning}   