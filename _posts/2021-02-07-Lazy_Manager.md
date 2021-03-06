---
layout: post
title:  "Lazy Manager"
date:   2021-02-07 14:40:30 +0800
categories: [Tech]
excerpt: Only Key Logger
tags:
  - Project
  - c#
---

## Program info  

Program Name: Lazy Manager
Version: 0.1  
Development Environment: c#  
Function: 
- Process Title 변경  
- Key Mapping 가능  
- 실시간 Key Logger 확인 가능  
- 방향키 인식 가능(시각화)  

---  

## 들어가면서..  

본 프로그램은 c#으로 만들었고, 아주 오래전에 만들어서 기능적으로 미완성된 부분이 많다.  
처음에는 사무자동화를 위한 종합적인 프로그램을 만드려고 하였으나, Key Mapping부분만 완성이 되고, 나머지 기능은 미완성인 상태이다.  
따라서, 완성된 부분에서 살짝 수정해서 만든 `Key Logger`만 포스팅하고 나중에 부가적인 기능이 완성이 되면 추가하는 형식으로 글을 적겠다.~~언제가 될진 모르겠다(안만든지 오래돼서...)~~  
Key Logger를 선택한 이유는 다른 프로그램들 보다 훨씬 흥미롭게 보이기 때문이다.(적어도 나는 흥미를 느꼈었다)  
또한, gbc 보안주차에 다뤘던 내용이기도 하기 때문에 Key Logger라는 프로그램을 만들게 되었다.  

원래는 Program Manager라는 사무자동화 프로그램을 만드려고 했었고, 생각했던 기능은 아래와 같다.  
1. 전역 후킹을 이용한 Key Mapping 기능.  
2. keybd.ini를 읽어서 사용자 정의 Key Mapping Macro 기능.  
3. ImageSearch 기능.  
4. Mouse Control 기능.  
5. DLL injection(필요하다면?)  
6. 키보드, 마우스입력은 비활성창에서도 가능해야함.  

하지만 이 모든 기능은 앞서 말했듯이, 전부 구현을 하지는 못했다.  
언젠가는 완성을 시킬것이라고 약속을 하며, 여기서는 Key Logger에 대한 부분만 언급하겠다.  

---   

## 키로거(Key Logger)가 무엇인가?  

먼저, 내가 만든 Key Logger에 대한 영상을 첨부하겠다.  
![keylogger_gif](/assets/images/KeyLogger/keylogger.gif)  
이것만 봐도 `Key Logger`가 무슨 느낌인지 충분히 알 것이다.  
단순히 말 그대로 Key Logger(키 로그를 입력하는 프로그램)이다.  
이런식으로 전역적으로 키보드를 후킹해서, 실시간으로 어떤 키가 눌렸는지 알려주는 프로그램을 c#으로 만들어봤다.~~사실 이걸 위해 만든건 아니지만~~  
> 참고: Hooking(후킹)은 이벤트가 Windows Message Queue 에서 Application Message Queue 로 넘어갈 때, 메세지를 중간에서 가로채는 것을 뜻한다.  

<!-- ![hookProc](/assets/images/KeyLogger/hookProc.PNG) -->  
우리는 Global Hooking을 이용하여, 키보드든 마우스든 이벤트를 가로챌 수 있다.  
++ 하지만, 이런 후킹을 막는 프로그램이 있기에 DLL Injection이라는 기술을 생각했었다  
GHOST gbc 보안주차에서도 다뤘던 내용이기에, 키로거를 만들어 보았고, 악용하면 충분히 타격이 큰 프로그램임에는 틀림없다.  
우리는 착한 어린이들이니까 악용할 생각은 하지말자.  

---  

## 구현해야 할 기능(혹은 전체적인 틀)  

어쨋든 미래에 만들어야 할 프로그램이므로, 보기 쉽게 간단히 정리를 해보겠다.  
1. 후킹을 이용하여, 마우스와 키보드 입력을 가로채어 조작하는게 첫번째 목표이다.(구현 완료)  
2. 비활성 부분은 PID나 Process Name을 이용하여 handle을 따서 SendMessage를 통해 혹은 PostMessage를 통해 메세지를 보내는 것으로 생각하고 있다.  
3. OpenCV를 이용하여 Image를 처리하는 방식으로 ImageSearch에 대해 구현하려고 한다.  
4. 마지막으로, 아래와 같이 키보드와 마우스 정보가 들어있는 파일을 읽어 사용자 정의 프로그램을 만들고자 한다.  
![keybd_info](/assets/images/KeyLogger/keybd_info.PNG)  
parsing 하는 부분은 만들어진 상태임.  
![parsing](/assets/images/KeyLogger/parsing.png)  

소스코드 : [여기](https://github.com/kdjun97/cs_FileIO)  

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
