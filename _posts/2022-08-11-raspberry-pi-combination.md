---
title: "[Raspberry Pi] 온습도(DHT-22), 토양 수분 함량 함께 측정하기(FC-28)"  
excerpt: "2가지 센서 같이 사용해보기"

categories:
  - IoT
tags:
  - [IoT, Raspberry Pi, Python]

permalink: /iot/raspberry-pi-combination/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-08-11 10:00:00
last_modified_at: 2022-08-11 10:00:00
published: true
---

## 🔧 개발환경

Python 3.9.2  
Firebase  
Raspberry Pi 4 8GB RAM  
Rasberry Pi OS (64-bit) (Debian Bullseye)  
FC-28 (Soil Moisture Sensor)  
DHT-22(AM2302) Sensor  
MCP3008 I/P for ADC  
BreadBoard (400 tie-point)  

---

## 🌻 시작

> [이전 글 참고 : 라즈베리파이로 온습도 측정해보기](https://kdjun97.github.io/iot/raspberry-pi-dht22/)  
> [이전 글 참고 : 라즈베리파이로 토양 수분 함량 측정해보기1](https://kdjun97.github.io/iot/raspberry-pi-soil-moisture1/)  
> [이전 글 참고 : 라즈베리파이로 토양 수분 함량 측정해보기2](https://kdjun97.github.io/iot/raspberry-pi-soil-moisture2/)  

이 전에 라즈베리파이로 `온습도 측정`, `토양 수분 함량 측정`을 해보았다.  
각각의 프로젝트로 진행하였으나, 이제는 하나로 합칠 때가 왔다.  
나는 `카메라, 온습도 측정, 토양 수분 함량 측정` 3개의 기능을 합칠 것이지만, camera는 나중에 코드를 넣어보기로 하고 지금은 `온습도 측정 + 토양 수분 함량 측정`기능을 합쳐보자.  
이 전에 했던 작업들이므로 빠르고 간결하게 지나가겠다.  
`python nohup`을 이용하여 background 작업으로 2개의 코드를 돌릴 것이고, 라즈베리파이랑 센서만 잘 연결해보자.  

---

## 📎 PinMapping

`토양 수분 함량 센서`  

**R-Pi4 > MCP3008**  

Pin 1 (3.3V) > VDD  
Pin 1 (3.3V) > VREF  
Pin 6 (GND) > AGND  
Pin 23 (SCLK) > CLK  
Pin 21 (MISO) > D_OUT  
Pin 19 (MOSI) > D_IN  
Pin 24 (CE0) > CS/SHDN  
Pin 6 (GND) > DGND  

**R-Pi4 > FC-28**  

Pin 1 (3.3V) > VCC  
Pin 6 (GND) > GND  

**FC-28 > MCP3008**  

AO > CH0  

`온습도 센서`  

**R-Pi4 > DHT-22(AM2302)**  

Pin 1 (3.3V) > Pin 1 (VCC)  
Pin 6 (GND) > Pin 3 (GND)  
Pin 7 (GPCLK0) > Pin 2 (SIG)  

자세한 부분은 아래 사진을 참고하자.  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/raspberry-pi-combination/pin_map.png">
  <img src="/assets/images/post_img/iot/raspberry-pi-combination/pin_map.png" alt="pin_map">
</a>  

실제 사진은 이렇다.(짧은 선이 없어 선 정리를 못한 부분은 양해 부탁)  

![picture](/assets/images/post_img/iot/raspberry-pi-combination/picture.jpg)  

---

## ✏️ Python Code

저번 코드들을 동시에 실행한다고 보면 된다.  
따라서, 이번 포스팅의 제일 위쪽에 링크에 있는 코드를 그대로 쓸 것이다.  
실제 사용 때는 `python nohup`을 사용해 background로 코드를 실행시킬 것이다.  
[python background 실행 : nohup](https://kdjun97.github.io/python/python-background/)   

---  

## 🎥 실험 영상

실험을 위해 온습도 측정은 10초 간격으로,  
토양 수분 함량 측정 간격은 100초 간격으로 진행하였다.  
영상에서도 보면 알 수 있듯이, 센서로부터 데이터 수신이 불안정한 모습을 보여주고 있다.  
점퍼선의 접합 외에는 파이썬 코드나 실험 환경 등을 모두 통일시켰고, 점퍼 선을 건드렸을 때, 측정 값이 왔다갔다 거리는 현상을 볼 수 있다.  
따라서, 값의 측정이 잘 되다 안되다 하는 것은 점퍼 선 연결의 문제로 종결짓고 이 프로젝트를 마무리 하겠다.  

[Youtube Link](https://youtu.be/SaE2Zf9jL40)  