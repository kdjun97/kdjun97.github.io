---
title: "[Raspberry Pi] Kotlin 앱으로 라즈베리파이 카메라 원거리 원격 제어"  
excerpt: "앱으로 라즈베리파이 카메라 원격 제어(원거리)"

categories:
  - IoT
tags:
  - [IoT, Raspberry Pi, Python, Kotlin]

permalink: /iot/raspberry-pi-with-kotlin/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-08-03 04:00:00
last_modified_at: 2022-08-03 04:00:00
published: true
---

## 🔧 개발환경

Python 3.9.2  
Firebase  
Raspberry Pi 4 8GB RAM  
카메라 모듈 V2, 8MP (RPI 8MP CAMERA BOARD)  
Rasberry Pi OS (64-bit) (Debian Bullseye)  
Kotlin  

---  

## 📱 앱 + 라즈베리파이 컨트롤

> [이전 글 참고 : Real Time Data Listener](https://kdjun97.github.io/iot/raspberry-pi-real-time-cloud/)  

이번 프로젝트에서는 `listener`를 이용하여 라즈베리파이를 컨트롤 할 계획이라 했었다.  
앱에서 버튼 클릭을 감지하였을 때, 라즈베리파이가 사진을 찍게 만들어보자.  

`LiveData, Coroutine, Cloud Firestore, Python, Raspberry-Pi, Glide`를 이용하였다.  

과정은 이렇다.  

**1.** Cloud에 버튼 클릭 감지 변수(Boolean)를 만듦(예시 필드명:`cameraButton`).  
**2.** R.PI Python code에서 `cameraButton에 listner(on_snapshot)를 붙임`  
**3.** 앱에서 버튼 클릭시, `cameraButton : true`로 바꾸고 `addSnapshotListener 붙임`  
**4.** R.PI Python code, (if cameraButton) 찰칵!  
**5.** `cameraButton : false`로 다시 바꿔줌  
**6.** `addSnapshotListener에서 false 감지`(true 됐다가 false를 감지)  
**7.** LiveData Update 및 listener Detach  
**8.** View 단에서는 `LiveData를 Observe` 하다가, 값이 바뀌면 UI Update  

조금 더 간략히 하고자 아래에 flow를 그려보았다.  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/raspberry-pi-with-kotlin/flow.JPG">
  <img src="/assets/images/post_img/iot/raspberry-pi-with-kotlin/flow.JPG" alt="flow">
</a>  

전체 코드는 이때까지의 예제와 위 flow를 보면 충분히 만들 수 있을 것이다.  
라즈베리파이에서는 `$ nohup python camera.py &` 명령으로 background에서 파이썬 코드를 작동시키자.  

이렇게 만들면, 경기도에서 포항에 있는 라즈베리파이에 카메라를 찍으라고 명령할 수 있다(원거리 통신 가능)  
실행 영상을 끝으로 포스팅을 마무리 하겠다.  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/raspberry-pi-with-kotlin/result.gif">
  <img src="/assets/images/post_img/iot/raspberry-pi-with-kotlin/result.gif" alt="result">
</a>  