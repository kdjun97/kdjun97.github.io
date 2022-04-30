---
title: "[Lazy Manager] Global Hooking을 이용한 Key Logger 기능"
excerpt: "C#으로 개발한 key logger 소개"

categories:
  - Automation Solution
tags:
  - [C#, Automation Solution]

permalink: /automation-solution/lazy-manager/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2021-02-07 14:30:30
last_modified_at: 2022-04-29 14:30:30
published: true
---

## 들어가면서..  

본 프로그램은 c#으로 만들었고, 아주 오래전에 만들어서 기능적으로 미완성된 부분이 많다.  
처음에는 사무자동화를 위한 종합적인 프로그램을 만드려고 하였으나, 일부 기능만 완성이 되고, 나머지 기능은 미완성인 상태이다.  
따라서, 기능의 베이스가 되는 후킹을 응용하여 만든 `Key Logger`만 포스팅하고 나중에 부가적인 기능이 완성이 되면 추가하는 형식으로 글을 적겠다.~~언제가 될진 모르겠다(안만든지 오래돼서...)~~  
Key Logger를 선택한 이유는 다른 프로그램들 보다 훨씬 흥미롭게 보이기 때문이다.(적어도 나는 흥미를 느꼈었다)  
또한, gbc 보안주차에 다뤘던 내용이기도 하기 때문에 Key Logger라는 프로그램을 만들게 되었다.  

원래는 Program Manager라는 사무자동화 프로그램을 만드려고 했었고~~(초기에 생각한 이름이라 지금은 Lazy Manager로 바뀌었다)~~, 생각했던 기능은 아래와 같다.  
1. 전역 후킹을 이용한 Key Mapping 기능.  
2. keybd.ini를 읽어서 사용자 정의 Keyboard 액션 처리 기능.  
3. ImageSearch 기능.  
4. Mouse Control 기능.  
5. DLL injection(필요하다면?)  
6. 키보드, 마우스입력은 비활성창에서도 가능해야함.  

하지만 이 모든 기능은 앞서 말했듯이, 전부 구현을 하지는 못했다.  
언젠가는 완성을 시킬것이라고 약속을 하며, 여기서는 Key Logger에 대한 부분만 언급하겠다.  

---   

### 참고 : Hooking(후킹)의 원리

`Hooking(후킹)`은 이벤트가 OS Message Queue 에서 Application Message Queue 로 넘어갈 때, `메시지를 중간에서 가로채는 것`을 뜻한다.  

### 일반적인 Windows 메시지 처리

1. `사용자의 입력이 있을 때` 사용자의 input은 `OS Message Queue`에 쌓이게 된다.  
2. `OS Message Queue`에서는 해당 `Application Message Queue`에 입력된 값의 정보를 주게 된다.  
3. `Application Message Queue`에서는 2에서 정보를 받으면 `event handler를 호출`한다.  

여기서 2번의 과정을 가로채는 것이 `후킹`이라고 하며 `Message Hooking`이라고도 불린다.  
`OS Message Queue`와 `Application Message Queue` 사이에 갈고리(hook)을 걸었다고 하여 `hooking`이라 불린다.  

아래는 이해를 돕기 위한 그림이다.  
![hooking](/assets/images/post_img/lazy-manager/hooking.JPG)  

Application Message Queue에 가기 전에 메시지를 가로챘기 때문에 그 메시지를 방치, 변경, 삭제가 가능하고 이는 다양하게 활용 가능하다.    
예를 들면 `응용프로그램이 메시지를 받지 않게 할 수도 있고(block), 원하는 메시지 값을 바꿀 수도 있다!(a 입력시 b입력되게 만듦)`  
~~벌써부터 재밌지 않은가?~~  

> [참고](https://ccurity.tistory.com/390)  
> [참고2](https://ffoorreeuunn.tistory.com/29)  
> [MSDN 공식 문서](https://docs.microsoft.com/en-us/windows/win32/winmsg/hooks)  

---

## 키로거(Key Logger)가 무엇인가?  

위와 같이 hook을 건 상태에서 키보드에 대한 정보를 우리가 가진다고 보면 이해가 빠를 것이다.  
물론, 응용프로그램에게도 메시지를 보낸다.  

이해를 돕기 위해 내가 만든 Key Logger에 대한 영상을 첨부하겠다.  
![Key_Logger](/assets/images/post_img/lazy-manager/keylogger.gif)  

이 영상으로 `Key Logger`가 무슨 느낌인지 충분히 감이 올 것이다.  
단순히 말 그대로 Key Logger(키 로그를 입력하는 프로그램)이다.  
이런식으로 전역적으로 키보드를 후킹해서, 실시간으로 어떤 키가 눌렸는지 알려주는 프로그램을 c#으로 만들어봤다.~~사실 이걸 위해 만든건 아니지만~~  

우리는 Global Hooking을 이용하여, 키보드든 마우스든 이벤트를 가로챌 수 있다.  
++ 하지만, 이런 후킹을 막는 프로그램이 있기에 DLL Injection이라는 기술을 생각했었다(추후에 다룰 예정)  
GHOST gbc 보안주차에서도 다뤘던 내용이기에, 키로거를 만들어 보았고, 악용하면 충분히 타격이 큰 프로그램임에는 틀림없다.  

🔥 우리는 착한 어린이들이니까 악용할 생각은 하지말자.  
{: .notice--danger}  

---  

## 구현해야 할 기능(혹은 전체적인 틀)  

어쨋든 미래에 만들어야 할 프로그램이므로, 보기 쉽게 간단히 정리를 해보겠다.  
1. 후킹을 이용하여, 마우스와 키보드 입력을 가로채어 조작하는게 첫번째 목표이다.(구현 완료)  
2. 비활성 부분은 PID나 Process Name을 이용하여 handle을 따서 SendMessage를 통해 혹은 PostMessage를 통해 메세지를 보내는 것으로 생각하고 있다.  
3. OpenCV를 이용하여 Image를 처리하는 방식으로 ImageSearch에 대해 구현하려고 한다.  
4. 마지막으로, 아래와 같이 키보드와 마우스 정보가 들어있는 파일을 읽어 사용자 정의 프로그램을 만들고자 한다.  
![keybd_info](/assets/images/post_img/lazy-manager/keybd_info.PNG)  

parsing 하는 부분은 만들어진 상태임.  

![parsing](/assets/images/post_img/lazy-manager/parsing.png)  

소스코드 : [여기](https://github.com/kdjun97/cs-file-IO)  

~~일단 DLL Injection은 빼고 구현을 할 것이다.~~  

---  

## 기대효과  

사실 사람은 반복 작업을 하는 것을 아주 지루하게 느낀다.  
나 역시 그렇게 느꼈었고, 그래서 이 프로그램을 생각하게 되었다.  
예를 들어, 어떤 특정 버튼을 계속 눌러야할 때, 너무 귀찮지 않은가?  
혹은 반복되는 키보드 입력으로 너무 힘들거나, 단 한번의 키 입력으로 100번의 키 입력 효과를 나타내는 편리한 기능을 생각해본 적이 있을 것이다.  
보통 이런 경우는, 사무적인 업무에서 많이 발생된다.  
따라서, 나는 이러한 귀찮은 업무를 대신해주는 혹은 더 편리한 기능을 제공해주는 프로그램을 만들어 인간이 더 편리하게 작업을 했으면 한다.  
물론, 많은 사람들이 이러한 생각을 하고 도움을 주는 프로그램을 만들었을 것이다.  
하지만 A회사에서 A프로그램을, B회사에서 B프로그램을 만드는 것 처럼, A회사 프로그램을 다른 회사에서는 사용할 수 없다.  
이 프로그램은 사용자 정의 맵핑기능이 있어 더욱 많은 사용자들(기업들)이 입맛대로 바꾸어 사용할 수 있다는 장점이 있을 것이다.  
또한, 활성창에서 이벤트 처리가 이루어지는 것이 아닌, 비활성창에서도 이벤트 처리를 할 수 있게 함으로써 사용자의 편의를 더욱 생각했다.(동시에 많은 일을 할 수 있음)  

💡 [Lazy Manager2 포스트](https://kdjun97.github.io/automation-solution/lazy-manager2/)에서 이어진다  
{: .notice--info}  