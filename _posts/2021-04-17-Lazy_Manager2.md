---
layout: post
title:  "Lazy Manager2"
date:   2021-04-17 21:00:00
categories: [Tech]
excerpt: Lazy Manager2
tags:
  - c++
  - python
  - Project
---

# Lazy Manager2

기존 Lazy Manager는 c#으로 제작했었다.  
이번에 중간고사 기간에 공부도 하기 싫고해서 갑자기 Lazy Manager를 완성시키고자 프로젝트를 이어가게 되었다.  
다양한 언어들로 다양한 기능들을 구현해보며 어떤 환경에서 가장 최적화된 프로그램을 만들 수 있는지 실험을 해보았다.  

목표는 가장 쉬운 소스로 최대의 효율을 내는 프로그램을 만드는 것이다.  


### 현재 프로세스의 창을 실시간으로 비활성 캡처하는 부분  

**개발환경 : c#**  

이 부분은 openCV와 같이 사용하여 Image Recognition을 만들 예정이다.  
현재 실시간 비활성 캡처는 가능하다.  
게임에서 테스트를 해보았고, 다른 환경에서 역시 실시간 캡처가 가능하다.  
[참고 영상](https://youtu.be/BIDXSyxiv2M)  

### DLL Injection  

**개발환경 : c++**  

DLL Injection의 교과서적인 부분.  
메모장에 내 dll을 injection시키는 것이다.  
현재 잘 되는 것을 확인할 수 있다.  
![injection](/assets/images/Lazy_Manager2/injection.gif)  


### Python으로 전역후킹 및 키보드, 마우스 제어  

**개발환경 : Python3.9.4-32bit, Python3.9.2-64bit**  
**모듈 : pyautogui, pywinauto, keyboard, mouse**  

제1목표 : docker에 모든 환경들을 구축.  
제2목표 : 전역후킹이 되는 keybd, mouse제어 프로그램.  

docker에 모든 환경들을 구축하려고 생각중이지만, 상당히 어려운 것 같다.  

파이썬이 검색하다보니 제일 최적의 환경이 아닌가 싶어서 아마 파이썬으로 구현을 하게 될 것 같다.  

Python 3.9.2 64-bit 환경으로 실험을 하다가, hooking쪽에서 에러가 떠서,  
Python 3.9.4 32-bit로 환경을 바꾸었다.  
잘 작동된다.  

++시행착오 추가  
Python 3.9.4 32-bit로 global hooking을 짰는데 잘 돌아갔지만, 64-bit에서 pyautogui나 다른 모듈들을 사용할 수 있는 것 같았다.  
일단은 최종적으로 64-bit로 키보드, 마우스 hooking기능까지 다 짰다.  

4.17하루를 다 써가며 얻은 결과물이다...~~원래 시험공부는 내일부터지~~  
일단 시간이 나면 또 제작해보겠지만, 언제 시간이 날지 모르니 이대로 중단해놔야겠다.  
