---
title: "[Kotlin] 코틀린 CodeLab1"  
excerpt: "LiveData, ViewModel, Hilt, SafeArgs, Coroutine, RecyclerView 등 사용"

categories:
  - Kotlin
tags:
  - [Kotlin]

permalink: /kotlin/kotlin-codelab1/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2023-01-15 10:00:00
last_modified_at: 2023-01-15 10:00:00
published: true
---

# 🤫 CodeLab

Nuru 회사에서 일을 하면서 `LiveData`, `RecyclerView`, `ViewModel`, `Hilt`, `SafeArgs`, `Coroutine` 등 다양한 기술들을 사용하여 앱을 만들었다.  
원래는 하나 하나의 기술들에 대해 포스팅하려 했으나, 일단 전체적으로 맛만 보고 세부적인 부분들은 미래의 나에게 맡기도록 하겠다.  

우선, 이 코드랩은 `Nuru(스마트 임산물 관리 앱)`에 적용된 기술들을 공부 목적으로 재구성 한 것이다.  
다시 한 번 언급하지만, 이 포스팅은 **간략히** 쓰인 기술들에 대해 소개만 할 것이다.  

<u>실행 영상</u>은 아래와 같고, **Github Link** 또한 링크를 걸어두었다.  
참고하면 좋을 것 같다.  

[CodeLab Github Link](https://github.com/kdjun97/kotlin-codelab)  
[Youtube Link](https://www.youtube.com/watch?v=uXY01RfmYW0)  

---  

# 🤠 ViewModel

ViewModel은 **Activity, Fragment**보다 긴 `LifeCycle`을 가진다.  

앱에서는 `화면 회전`, `다른 페이지로 이동` 등 다양한 상황들이 연출된다.  
이러한 상황에서 데이터의 보존은 필수적이다.  
다시 말해, 특정 정보를 잃지 않고 계속 가지는 상태가 필요하다.  

이 때, `ViewModel`이 쓰인다.  
화면 회전(가로-세로)이 일어나면 **Activity**가 `onDestory`되고 다시 `onStart`된다.  
이 경우, activity보다 lifecycle이 긴 viewmodel에서 데이터를 가지고 있어야 데이터를 보존할 수 있다.  

따라서, 우리는 viewmodel에서 데이터를 가지고 그것을 UI에 사용하거나 할 것이다.  
~~Activity, Fragment LifeCycle에 대해서도 포스팅해야하는데... 귀찮다..~~  

코드랩에서는 ViewModel에서 데이터를 가지고 있다.  

---  

# 🧐 RecyclerView

앱에서 많은 데이터를 보여줄 때 목록을 스크롤하여 보여줄 수 있는 `RecyclerView`를 쓸 수 있다(Flutter 에서는 ListView, GridView 등을 사용)  

`RecyclerView`는 이름 그대로 재활용 가능한 View다.  
`Adapter에 연결하여 같이 사용`하고, `ViewHolder`를 이용하여 RecyclerView의 **View**를 `재활용하여 사용`한다.  

ListView와는 달리, `화면에 표시할 수 있는 정도의 View만 생성`하여 **불필요한 resource를 줄이기 때문**에 `ListView보다 성능이 좋다는 이점`이 있다.  

또한 Binding하여 각 view 객체에 따른 onClick 버튼 또한 처리해줄 수 있다.  

RecyclerView는 글 하나를 따로 써야할 정도로 적을 게 많기 때문에, 이번 코드랩에서 사용되었다 정도만 언급하고 넘어가도록 하겠다.  

이번 코드랩에서 Add Button을 누르면 id, name, contents가 적힌 List가 하나씩 추가되는 기능을 넣었고 여기에 `RecyclerView가 사용`되었다.  

---  

# 💉 Hilt

`DI(Dependency Injection)`을 위해 사용되는 Hilt.  
Testing과 의존성 분리를 위해 사용한다.  

이번 코드랩에서는 MissionRepository를 주입시키는 데에 사용되었다.  

MainActivity에서 MyViewModel을 사용 ->  
MyViewModel은 파라미터로 MissionRepository가 필요 ->  
Hilt가 이를 자동으로 처리해줌(@로 위치 잡아줌) ->  
`MissionModule.kt`에서 singleton으로 MissionRepository()를 return해줌 ->  
MyViewModel이 사용될 때마다 Hilt가 추적해서 MissionRepository를 파라미터로 넣어줌.  

Hilt 역시 자세한 포스팅이 필요하기 때문에 이까지만 언급하고 넘어가도록 하겠다.  

---  

# 🤩 LiveData

LiveData는 data의 변경을 `Observing 가능한` 친구이다.  
즉, 앱 UI에서 변화되는 data가 존재하면, 우리는 LiveData로 observing하여 이를 처리해줄 수 있다.  

변화를 감지(Observing)하고 만약 변화되었다면, UI를 Update해주는 형식으로 사용된다.  

이 코드랩에서는 `버튼을 누르면 숫자가 증가`하고  
숫자의 변화에 따라 UI를 변경(TextView Update)하는 방식을 사용했다.  

흐름은 아래와 같다.  

FirstFragment에서 `viewModel.fetchData().observe()` -> LiveData 관찰 시작  
FirstFragment에서 bntAdd() -> `myViewModel.addMission1()` -> 버튼 누르면 숫자 증가  

`myViewModel.fetchData()`함수에서는 MissionRepository의 LiveData 관찰 ->  
Add 버튼을 누르면 LiveData value 증가 ->  
상태의 변화가 생김 ->  
observing 발동 ->  
FirstFragment에서 `TextView의 값 변경 일어남`  

이러한 과정으로 LiveData를 Observing할 수 있다.  
하지만 추후에 알게된 사실인데, 이렇게 observing을 많이 붙이면 메인 쓰레드가 힘들어한단다.  

따라서, `flow`라는 것을 공부하여 `emit, collect`하게 코드를 바꿀 생각이다.  

---  

# 🙄 SafeArgs

SafeArgs로 Fragment간 데이터 교환을 할 수 있다.  
Flutter로 따지면 NameRoute에 Parameter를 태워 가는 느낌?  

본 코드랩에서는 fragment끼리 페이지 번호를 `SafeArgs`로 넘겨 `ToastMessage`를 띄웠다.  

---  

# 🐍 Coroutine

코루틴은 비동기 처리를 도와준다.  
예를 들어, 사용자가 id, password를 입력했다.  
이 로그인 과정이 3초가 걸린다고 생각하면, 3초간 아무것도 하지 않는 것은 비효율적이다.  

따라서, 코루틴으로 로그인 과정을 비동기로 처리하고, 나머지 UI 작업들이나 다른 것들을 수행할 수 있게 한다.  

이 코드랩에서는 `Coroutine + suspend fun`을 이용하여 증가하는 숫자를 나타내는 예제를 진행했다.  

쓰다보니 다 하나씩 포스팅해야할 것 같다..  
일단은 스킵!  

---  

# 😘 끝으로...

MVVM Design Pattern을 최대한 적용시키려 노력하였고,  
내가 생각하는 앱 개발에서 많이 쓰이는 기술들을 codelab을 통해 연습해보았다.  

뭔가 설명이 부실한 것 같다면, 후에 각각의 세부적인 내용들로 다시 포스팅하겠다.  

6개월쯤 전에 했던 코드랩을 지금에서야 포스팅한다..  
많이 까먹은 부분도 있지만 역시 flutter와 다른 느낌으로 kotlin도 재밌는 것 같다.  

⚠️ 내용 중 틀린 부분이 있다면 메일or댓글 부탁드립니다.  
지적은 환영입니다!  
{: .notice--warning}  