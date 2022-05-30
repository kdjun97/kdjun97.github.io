---
title: "[Lazy Manager2] 다양한 환경에서 필요한 기능들의 퍼포먼스 비교"
excerpt: "Python, C#, C++에서 기능들을 구현해보고 최종적으로 어떤 언어로 Lazy Manager를 개발할지 결정해보자"

categories:
  - Automation Solution
tags:
  - [Automation Solution, C#, C++, Python]

permalink: /automation-solution/lazy-manager2/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2021-04-17 21:00:00
last_modified_at: 2022-04-30 21:30:00
published: true
---

# 🦥 Lazy Manager2

기존 Lazy Manager는 c#으로 제작했었다. (아래 링크 참고)  
> [Lazy Manager 포스트로 이동](https://kdjun97.github.io/automation-solution/lazy-manager/)  

이번에 중간고사 기간에 공부도 하기 싫고해서 갑자기 Lazy Manager를 완성시키고자 프로젝트를 이어가게 되었다.  
다양한 언어들로 다양한 기능들을 구현해보며 어떤 환경에서 **가장 최적화된 프로그램**을 만들 수 있는지 실험을 해보는게 목적이다.  

다시 한 번 강조하지만 최종 목표는 `가장 쉬운 소스로 최대의 효율을 내는 프로그램을 만드는 것`이다.  
아래의 내용들은 Lazy Manager에 들어갈 기능들을 실험해본 것이다.  

---  

### 🍉 현재 프로세스의 창을 실시간으로 비활성 캡처하는 부분  

**개발환경 : C#**  
**결과 : 만족스러운 속도와 구현 가능을 검증**  

이 부분은 openCV와 같이 사용하여 Image Recognition을 만들 예정이다.  
현재 실시간 비활성 캡처는 가능하다.  
게임에서 테스트를 해보았고, 다른 환경에서 역시 실시간 캡처가 가능하다.  
참고 영상을 보면 알겠지만 이미지 캡처 속도가 굉장히 빠르다.  
> [참고 영상](https://youtu.be/BIDXSyxiv2M)  

---  

### 🍒 DLL Injection  

**개발환경 : C++**  
**결과 : 기능 검증 완료**  

DLL Injection은 만일의 사태를 위해 다른 프로세스에 침투하기 위해 구현을 해보았다.  

DLL Injection의 교과서적인 부분.  
메모장에 내 dll을 injection시키는 것이다.  
Injection이 성공하면 MessageBox를 띄우게 했다.  
현재 잘 되는 것을 확인할 수 있다.  
![injection](/assets/images/post_img/lazy-manager2/injection.gif)  

---  

### 🍇 Python으로 전역후킹 및 키보드, 마우스 제어  

**개발환경 : Python3.9.4-32bit, Python3.9.2-64bit**  
**모듈 : pyautogui, pywinauto, keyboard, mouse, psutil**  
**결과 : 기능 검증 완료, 코드의 간편함 최고**  

제1목표 : docker에 모든 환경들을 구축.  
제2목표 : 전역후킹이 되는 keybd, mouse제어 프로그램.  

docker에 모든 환경들을 구축하려고 생각중이지만, 상당히 어려운 것 같다.(도커 활용은 나중으로 미루기로..)  

++  
Python 3.9.2 64-bit 환경으로 실험을 하다가, hooking쪽에서 에러가 떠서,  
Python 3.9.4 32-bit로 환경을 바꾸었다.  
3.9.4 32-bit에서의 hooking. 이번에도 KeyLogger를 만들어보았다. 잘 작동된다.  
![python_global_hooking](/assets/images/post_img/lazy-manager2/python_global_hooking.gif)  

++시행착오 추가  
Python 3.9.4 32-bit로 global hooking을 짰는데 잘 돌아갔지만, 64-bit에서 pyautogui나 다른 모듈들을 사용할 수 있는 것 같았다.  
일단은 최종적으로 64-bit로 키보드, 마우스 hooking기능까지 다 짰다.  

4.17하루를 다 써가며 얻은 결과물이다...~~원래 시험공부는 내일부터지~~  
일단 시간이 나면 또 제작해보겠지만, 언제 시간이 날지 모르니 이대로 중단해놔야겠다.  

---  

#### 🍐 ++추가++ Python이 좋다면서 LazyManager3에서 c#을 선택한 이유

c#에선 템플릿 매칭을 통한 이미지 처리, python에서는 imagesearch를 해보았다.  
c#에선 굉장히 빠른 속도로 이미지를 처리하는 반면, python에서는 c#과 비교해 느린 퍼포먼스를 보여주었다.  
python에서 실시간으로 화면을 캡처하는 코드 역시 만들어보았지만, image가 느리게 업데이트되는 모습을 보여주었다.  

이미지 처리 속도 : c# > python  
키보드 맵핑 기능 : c#과 python이 비슷하였다.  
코드 효율 : c# < python  
{: .notice--success}  

하지만 추후 이미지 처리기능까지 생각을 해보았을 때, python을 선택하는 것보다 c#을 선택하는 것이 맞다고 판단하여 추후 프로젝트는 c#으로 할 예정이다.   
추후 LazyManager3에서 c#을 개발언어로 선택한 이유중 하나가 여기있다.~~사실 C# WinForm이 간편해서인 이유도 존재한다~~  