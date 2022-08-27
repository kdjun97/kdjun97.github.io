---
title: "[Kotlin] Coroutine(코루틴)으로 Firebase Listener 동기 처리하기" 
excerpt: "코루틴을 사용하여 Firebase 비동기 작업 동기로 처리하기" 

categories:
  - Kotlin
tags:
  - [Kotlin]

permalink: /kotlin/kotlin-firebase-sync/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-08-23 05:00:00
last_modified_at: 2022-08-23 05:00:00
published: true
---

## 😒 포스팅 순서

> [참고하면 좋은 글 : Coroutine(코루틴 맛보기)](https://kdjun97.github.io/kotlin/kotlin-coroutine/)  

1. Firebase Listener에 대해 소개  
1. Coroutine 사용, DB 동기 처리 소개
1. 관련 Issue 발견

---  

## 🔥 1.Firebase Listener

나는 Kotlin으로 Firebase를 연동하여 앱을 만들고 있다.  
그 중 Firestore DB 쿼리 함수들은 모두 비동기로 처리가 된다는 사실을 알게 되었다.  
당연히, 쿼리가 10초 걸린다면 그 동안 아무것도 못하는 것 보다는 비동기를 통해 다른 작업을 하도록 하는게 맞다.  
하지만 아래와 상황은 불가피하다. 간단한 `pseudo-code`를 통해 확인하자.  

`pseudo-code`  

```kotlin
// fragment 안
...
1. 버튼을 누름. // fun btnPrssed()
2. Firestore DB 접근 후 정보를 받아옴. // text = DB.get()
3. 받아온 정보를 TextView에 표시 // txtView.text = text
...
```  

`build.gradle(App)`  

```gradle
dependencies {
  ...
  implementation 'com.google.firebase:firebase-firestore:19.0.0'
  ...
}
```  

`실제 코드`  

```kotlin
var text : String = ""

fun btnPrssed(view: View) {
  text = getName()
  txtView.text = text
}

fun getName() : String {
  val db = FirebaseFirestore.getInstance()
  var userName : String = ""
  db.collection("user").document("uid").get().addOnCompleteListener {
	  userName = it.result["name"].toString()
  }

  return userName
}

```  

굉장히 간단한 코드다.  
버튼을 눌러 정보를 받고, 그 정보를 TextView에 표시하는 코드이다.  
Listener를 달았으니, DB를 가져오는 작업이 끝난다면 return이 되겠지? 라고 생각하며 코드를 짤 수 있다.  
기대 동작 순서 : **1->2->3**  

하지만 위 코드의 2번 Firebase 작업이 <u>비동기로 돌아가기 때문에</u> 실제 동작 순서는 아래와 같다.  
실제 동작 순서 : **1->3->2**  
조금 더 직관적으로 말하자면, getName 함수 안에서는 DB에서 값을 가져오기 전에 이미 `빈 스트링 ""`을 return하고 함수를 빠져나온다.  

이러한 과정을 처음 겪게 되면 디버깅에 꽤나 많은 시간이 걸린다.  
DB 값을 가져오는 과정에서 Log를 찍어보면 정보는 제대로 가져오지만, 3번 과정의 txtView.text에 값은 들어가지 않기 때문에 뭐가 잘못되었는지 헤맬 수 있다.  

현재 문제점은 실행 순서이다. 따라서, 기대했던 동작 순서를 보장해주면 된다.  
즉, `Firebase Listener`작업(DB에서 데이터 가져오는 작업)이 다 끝날 때 까지 기다린 후 3번을 실행하면 해결될 문제이다.  

이를 위해 코루틴을 사용하여 동기 작업을 할 것이다.  

---  

## 🧩 2.Coroutine 사용

`build.gradle(App)`  

```gradle
dependencies { 
  // For Coroutine
  implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.5.1"
  implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.5.1"
}
```  

`Kotlin Code`  

```kotlin
var text: String = ""

fun btnPrssed(view: View) {
  CoroutineScope(Dispatchers.Main).launch {
    CoroutineScope(Dispatchers.IO).launch {
      text = getName()
	}.join()
    txtView.text = text
  }
}

suspend fun getName() : String {
  val db = FirebaseFirestore.getInstance()
  var userName : String = ""
  db.collection("user").document("uid").get().addOnCompleteListener {
    userName = it["name"].toString()
  }.await()

  return userName
}
```  

인터넷 작업 혹은 DB 처리를 하기 위해 `IO Dispatcher`를 사용하였다.  
위와 같이 해결해주면 textView.text에 원했던 값이 들어가게된다.  
그런데, 내 생각이 틀렸음을 알게 되었다.  

---  

## ❓ 3.관련 이슈 발견

위에서 코루틴 디스패처를 두 개 써주었다.  
Main과 IO를 써주었고 Main은 UI작업, IO는 인터넷 작업에 필요하여 써주었다.  
이렇게 서로 다른 역할을 나누어 비동기 처리를 해주면 속도가 더 빨라질 것을 기대하며 두 개의 디스패처를 사용하였지만, 문제가 생겼다.  

`기대했던 Flow`  

![expected_flow](/assets/images/post_img/kotlin/kotlin-firebase-sync/expected_flow.png)  

`실제 Flow`  

![real_flow](/assets/images/post_img/kotlin/kotlin-firebase-sync/real_flow.png)  

위와 같이 생각했던 대로 흘러가지 않는다는 점이었다.  
이는 Firebase.Listener()에서 따로 비동기로 돌기 위한 쓰레드를 생성해주는 것으로 보인다.  
따라서 `Dispatcher.IO`로 코루틴을 시작하였으나, IO처리는 원하는 데로 되지 않는다.  

Firebase Listener는 만든 사람이 비동기적으로 돌리기 위해 쓰레드를 생성하게끔 만들지 않았을까? 하고 생각해본다.  

요약하자면 Firebase 작업이 Dispatcher.IO에서 돌아가는 줄 알았으나 아니었고, 이는 변경을 해야할 필요가 있어 보인다.  

위의 간단한 코드를 제대로 동작하기 위해서 나는 `LiveData를 사용`하였다.  
String을 return하지 않고, <u>LiveData를 update하여 이 값을 UI에서 observing하는 방법을 사용</u>하였다.  
혹은 이것 말고도 다른 방법이 있을 것이다.  
나중에 리팩토링을 하고 지금은 이 방법을 사용하는 것으로 이번 이슈는 마무리하자..(다 뜯어고치기 힘들다..)  

알게된 점 : 코루틴 스케줄링은 어렵다.. 그래도 하나 더 알아서 이득봤다  