---
title: "[Kotlin] Coroutine(코루틴) 맛보기?" 
excerpt: "코루틴에 대해 간략히 알아보기" 

categories:
  - Kotlin
tags:
  - [Kotlin]

permalink: /kotlin/kotlin-coroutine/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-08-05 03:00:00
last_modified_at: 2022-08-05 03:00:00
published: true
---

## ❓ 동기, 비동기에 대해

코루틴에 대해 이야기하기 전에, 동기와 비동기에 대해 먼저 얘기를 해보자.  

**동기(Synchronous)와 비동기(Asynchronous)**는 코딩을 하거나 앱을 만들면서 많이 들어봤을 것이다.  
이해하기 쉽게 아래 그림을 보고 설명을 보도록 하자.  

![sync_async](/assets/images/post_img/kotlin/kotlin-coroutine/syn_asyn.png)  

> [그림 출처](https://goodenoughyoungyeom.netlify.app/Web%20Development/[Web%20Development]%EB%8F%99%EA%B8%B0%EC%99%80%EB%B9%84%EB%8F%99%EA%B8%B0%EC%B2%98%EB%A6%AC/)  

### ⌛ 동기(Synchronous)

`순차적으로 코드가 실행되는 방식`  

```kotlin
Log.d("msg", "1")
Log.d("msg", "2")
Log.d("msg", "3")
Log.d("msg", "4")
```  

**출력**  
```kotlin
1
2
3
4
```  

이렇게 위에서 아래로 순차적으로 코드가 실행되며 **한 작업이 끝나면 다음 코드가 실행되는 방식**이 `동기`이다.  

---

### ⏳ 비동기(Asynchronous)

`코드의 연산이 끝날 때까지 기다리지 않고 다음 코드를 실행하는 방식`  

```kotlin
Log.d("msg", "1")
Handler(Looper.getMainLooper()).postDelayed({
    Log.d("msg", "2")
}, 3000)
Log.d("msg", "3")
```  

**출력**  
```kotlin
1
3
2
```  

위 코드에서 우리가 기대한 바는, 1을 출력하고 3초를 기다리고 2를 출력한 뒤, 3을 출력하는 것이다.  
하지만, 출력은 1,3,2 순서로 찍혔다.  
이러한 코드 진행 방식(작업이 끝날 때까지 기다려주지 않음)이 `비동기`이다.  

---  

다시 돌아와서 위 동기, 비동기 그림을 살펴보자.  

동기는 코드의 연산이 끝날 때까지 기다린다는 점에서 안전하지만, 느리다.  
하지만 비동기는 더 빠르다는 것을 알 수 있다.(다른 작업을 함께 수행하여 효율적)  

우리가 서버에서 데이터를 받아와 페이지를 그리는 과정을 가진다고 생각해보자.  
시간이 얼마나 걸릴지는 모른다. 1초 혹은 10초도 걸릴 수 있다.  
그 시간동안 기다리는 것<u>(동기적 처리)</u>은 페이지 로딩 시간을 길게 가져갈 것이다.  
이런 경우, 데이터 처리 과정을 비동기로 돌리는 것이 유저에게 로딩창을 계속 보이지 않게 하는 해결책이 될 수 있겠다.  

**비동기 처리**는 <u>앱의 퍼포먼스와 유저의 만족도를 같이 향상</u>시킬 수 있다.  

---  

## ❓ What is Coroutine?

코루틴에 대해 이야기 할 시간이다.  
이번 포스팅에서는 간략하게 알아보도록 하자.  
또한, Coroutine을 사용한 동기 작업에 대해 초점을 맞추도록 하겠다.  

`Coroutine`은 사용은 Android에서 권장하는 방법이고, **백그라운드 스레드에서 코드를 처리할 때 사용하는 방법**이다.  
그렇다고 Coroutine == Thread는 아니다. Coroutine이 더 가볍다고 한다.  
**Co + Routine**의 합성어로 **Co**는 `함께, 동시에`의 뜻을, **Routine**은 `작업`의 뜻을 가진다고 생각하면 이해하기 편할 것 같다.  

이러한 코루틴이 필요한 부분은 아무래도 서버 작업이 필요한 부분이나 DB, Room DB 접근 등이 되겠다.  
아래 예제를 통해 이해해보자.  

### 💉 의존성

`app.gradle(module)`  

```gradle
dependencies {
    ...
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.5.1"
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.5.1"
}
```  

---  

### 🔭 Coroutine Scope

Coroutine은 CoroutineScope 안에서 실행된다.  
그 중, `Coroutine Scope`에는 GlobalScope와 CoroutineScope가 존재함.  
둘에 대해 알아보자.  

**GlobalScope** : 앱의 생명주기와 함께 동작. 앱 시작부터 앱 끝까지 실행되는 코루틴의 경우 적합.  
**CoroutineScope** : 원할때만 시작하고 완료되면 닫아주는 코루틴의 경우에 적합. 보통 버튼을 눌러 서버에 접속하거나 API 호출 등에서 자주 이용됨.  

```kotlin
CoroutineScope(Dispatchers.Main).launch {
	// Your Code
}

GlobalScope.launch {
	// Your Code
}
```  

---  

### 🎲 Coroutine Dispatchers

우리는 코루틴을 사용할 때 적절한 Dispatcher를 사용해야한다.  
코루틴의 디스패처는 `Main, IO, Default 등`이 있다.  

- Dispatchers.**Main** : UI 작업, Toast 메시지 등 View 작업에 사용됨.  
- Dispatchers.**IO** : 네트워크, 디스크, DB 접근 등의 작업에 사용됨. 입출력에 최적화 되어있음.  
- Dispatchers.**Default** : CPU를 많이 쓰는 작업에 최적화. 데이터 정렬, 복잡한 연산에 사용됨.  

아래와 같이 이용할 수 있겠다.  

```kotlin
CoroutineScope(Dispatchers.Main).launch {
	// View 작업
	CoroutineScope(Dispatchers.IO).launch {
		// DB 접근 등 IO 작업
	}
	// View 작업
}
```  

---  

### ⌛ Coroutine 동기 작업

코루틴 내부에서도 동기적으로 작업을 할 수 있다.  
아래 예시들을 통해 알아보자.  

#### 🌴 join()

```kotlin
CoroutineScope(Dispatchers.Default).launch {
	launch{
		for (i in 0..1000)
			Log.d("test", "$i")
	}.join()
	launch{
		for (i in 0..1000)
			Log.d("test", "$i")
	}
}
```  

위에서 0..1000의 integer를 출력하고, 1000..2000의 integer를 출력하고싶다.  
하지만 코루틴은 비동기적으로 실행이 된다고 하였으니, 출력이 뒤죽박죽 될 것이다.(join()이 없었다면 말이다)  
우리는 이러한 경우 `join()`을 사용하여 동기적으로 실행되도록 코드를 짤 수 있다.  

---  

#### 🌿 async await()

```kotlin
CoroutineScope(Dispatchers.Default).async {
	val res1 = async {
		...
	}
	val res2 = async {
		...
	}
	val list = listOf(res1, res2)
	list.awaitAll()
	Log.d("test","task1,2 수행 완료")
}
```

혹은 res1이 끝난 뒤 res2를 실행시키고 싶다면, 아래와 같은 형태로도 코드를 짤 수 있다.  

```kotlin
CoroutineScope(Dispatchers.Default).async {
	val res1 = async {
		...
	}.await()
	val res2 = async {
		...
	}
}
```

---  

#### 🌵 suspend fun

suspend 함수는 `다른 suspend 함수 안` 혹은 `코루틴 내`에서만 호출할 수 있다.  

```kotlin
suspend fun test() {
	for (i in 0..100000)
		Log.d("test","$i")
}

CoroutineScope(Dispatchers.Default).launch {
	Log.d("test","res1 시작 전")
	test()
	Log.d("test","res1 시작 후")
}
```  

100,000까지 출력한 뒤, **res1 시작 후** 라는 메시지가 출력된다.  

---  

주로 나는 이런 식으로 많이 사용한다.  

```kotlin
CoroutineScope(Dispatchers.Main).launch {
	// View Update
	CoroutineScope(Dispatchers.IO).launch {
		// 서버 혹은 DB 작업
	}.join()
	// View Update
}
```  

이번 포스팅에서는 Coroutine에서 동기로 작업 진행에 대해 중점적으로 알아보았다.  
앱 개발시, DB에서 값을 가져오는 동시에 View를 Update하는 비동기 작업을 진행하는 코드에서  
값을 가져오지 않은 채로 View Update를 시도할 때 에러가 많이 났었고, 언제 한 번 코루틴을 부분적 동기로 돌리는 부분에 대해 정리를 해보고자 했었는데 그게 이번 포스팅이 된 것 같다.  

Coroutine에 대한 더 자세한 정보는 검색을 통해서 알아보는 것을 추천한다!  