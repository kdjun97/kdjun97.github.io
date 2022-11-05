---
title: "[IoT] 자동 전등 제어 회로 재설계"  
excerpt: "자동 전등 제어 프로젝트 회로 리팩토링?"

categories:
  - IoT
tags:
  - [IoT]

permalink: /iot/auto-led-circuit-design/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-11-03 10:00:00
last_modified_at: 2022-11-03 10:00:00
published: true
---

# ✔️ 개발환경

개발 툴 : Arduino IDE 1.8.19  
센서 : CDS sensor(조도 센서), DHT-22(온습도 센서)  
Actuator : LED, USB LED(Lamp)    
MCU : NodeMCU(ESP 8266)  
Module : SSD1306(OLED), 2-channel Relay  
Connector Adapter : USB_A type Adapter(C415)  
Register : 220Ω, 4.7kΩ  

[자동 전등 제어 프로젝트 참고](https://kdjun97.github.io/iot/auto-led-control-with-oled/)  
[작동 영상 : Youtube](https://youtu.be/c-hRML66dDU)  
[Github Link](https://github.com/kdjun97/iot-led-control-with-oled)  

---  

## 🔨 회로 리팩토링? 시작

**목표 : 앞 전의 프로젝트 회로를 리팩토링? 하기**  

선이 너무 복잡하다고 언젠가는 리팩토링(회로에서도 이 용어가 맞나 모르겠다 일단 이렇게 쓰겠다)하기로 마음먹었는데, 같이 수업을 듣는 형이 선을 사주셔서 이 기회다 싶어서 나도 리팩토링하기로 했다.(감사요~ㅋ)  

아래는 구매한 목록이다.  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/auto-led-circuit-design/buy.png">
  <img src="/assets/images/post_img/iot/auto-led-circuit-design/buy.png" alt="buy">
</a>  

아래는 작업 전 사진이고 목표는 깔끔하고 직관적인 선의 배치이다.  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/auto-led-circuit-design/before.jpg">
  <img src="/assets/images/post_img/iot/auto-led-circuit-design/before.jpg" alt="before">
</a>  

---  

## 😛 Step1

💡 참고로 모든 과정에서, NodeMCU에 전원을 빼고 진행하였음.  
{: .notice--warning}   

우선, ESP8266의 스펙이다.  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/auto-led-circuit-design/esp8266_pin_map.png">
  <img src="/assets/images/post_img/iot/auto-led-circuit-design/esp8266_pin_map.png" alt="esp8266_pin_map">
</a>  

Step1을 밟아가며 가벼운 것들을 우선적으로 정리를 할 생각이다.  

제일 먼저 할 작업은 NodeMCU 위와 아래 부분의 3.3V, GND 선 정리였다.   
그 후, **cds 센서**와 맵핑되어있는 `A0`에 할당된 선을 정리해주었다.  
기존 D0에 할당된 LED를 재배치하고, 저항을 `270Ω -> 220Ω`으로 교체하였다.  

Step1이 끝나고 NodeMCU 전원을 넣었을 때, 정상적으로 잘 작동됨을 확인하였기 때문에 쓰무쓰하게 step2로 넘어가보겠다.  
아래는 step1 과정이 완료된 사진이다.  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/auto-led-circuit-design/step1.jpg">
  <img src="/assets/images/post_img/iot/auto-led-circuit-design/step1.jpg" alt="step1">
</a>  

---  

## 😏 Step2

기존에는 NodeMCU의 usb 연결 부분과 DHT-22 센서가 거의 겹쳐서 불편했었다.  
꼭 배치를 바꾸자 생각했었는데, step2에서 이를 진행할 것이다.  

step2의 목표는 dht-22 센서와 관련된 선들을 정리하는 것이다.  

dht-22는 왼쪽부터 전원, 데이터(out), GND 핀으로 구성되어있다.  
따라서, 전원과 GND에 맞게 선을 재배열하고, D3에서 데이터를 출력할 것이기 때문에 D3로 핀을 할당하여 선을 재배치한다.  

정리가 끝난 후, 다시 전원을 넣고 잘 작동되는지 확인해본다.  
display에 잘 나오므로 step3으로 넘어가보자.  

아래는 step2 과정이 완료된 사진이다.  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/auto-led-circuit-design/step2.jpg">
  <img src="/assets/images/post_img/iot/auto-led-circuit-design/step2.jpg" alt="step2">
</a>  

step2만 거쳤는데도 벌써 깔끔해졌다...  

---  

## 🙄 Step3

OLED 재배치.  
이번 step3에서는 **OLED를 재배치하고 cds에 걸리는 저항을 4.7kΩ으로 변경**하였다.  
OLED 핀에는 왼쪽 핀부터 VCC(3.3V), GND, SCL(D1), SDA(D2)에 할당하였다.  
물론 기존과 같지만, 선 배치를 다시 해줌으로써 깔끔하게 변했다.  

현재까지 cds, LED, dht22와 OLED까지 배치를 다시하고, 전원을 다시 꽂았을 때, 잘 작동하는 것을 확인할 수 있었다.  
이제 마지막 step4(USBLED)가 남았다.  
step3의 결과는 아래와 같다!  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/auto-led-circuit-design/step3.jpg">
  <img src="/assets/images/post_img/iot/auto-led-circuit-design/step3.jpg" alt="step3">
</a>  

step4에서 알게된건데 cds 이상하게 꽂음ㅋ  
다시 꽂음 그래서.  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/auto-led-circuit-design/step3_2.jpg">
  <img src="/assets/images/post_img/iot/auto-led-circuit-design/step3_2.jpg" alt="step3_2">
</a>  

---  

## 🤪 Step4

마지막 USBLED의 배치.  
이게 제일 어려웠다.  
처음에 dht22 오른쪽에 배치했다가, cds 센서와 너무 가까워서 light intensity 값에 영향을 자꾸 미쳐서 왼쪽 끝으로 배치를 바꾸었다.  
step4 과정에서 이뻤던 선이 점점 다시 복잡해진다는 것을 느꼈다.  
더 잘할 수 있지만 일단은 늦었으니 여기서 hold하는 걸로..  
작동은 잘 한다.  

아래는 완성된 회로.  
before -> after를 비교하면 굉장히 깔끔해졌음을 알 수 있다!  

remind를 위해 before 사진부터 다시 보여주겠다.  

`Before`  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/auto-led-circuit-design/before.jpg">
  <img src="/assets/images/post_img/iot/auto-led-circuit-design/before.jpg" alt="before">
</a>  

`After`  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/auto-led-circuit-design/step4.jpg">
  <img src="/assets/images/post_img/iot/auto-led-circuit-design/step4.jpg" alt="step4">
</a>  

---  

## ✏️ 실험? 끝..

일단 너무 재밌었던 시간이었다.  
정돈되지 않은 선을 보면 스트레스를 받았었는데 이제서야 선들이 자리를 잡은 것 같다.  
**브레드보드의 어디에 센서를 위치할까?** 를 생각하면서 배치를 바꾸는게 가장 어려웠던 것 같다.  

오랜만에 포스팅이었는데 재밌는 주제여서 짜릿했다.  
하지만 다시 하기는 싫다(처음부터 제대로 해야지...)  