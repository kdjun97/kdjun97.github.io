---
title: "[Raspberry Pi] 라즈베리파이 4 설치 및 카메라 연동"  
excerpt: "Raspberry Pi 4를 설치하고 카메라 기능을 연동해보자!"

categories:
  - IoT
tags:
  - [IoT, Raspberry Pi]

permalink: /iot/raspberry-pi-install/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-07-28 10:00:00
last_modified_at: 2022-07-29 10:00:00
published: true

---  

# 😆 Raspberry Pi 4 구매  

**2022.07.28** 드디어!! 기다리던 라즈베리파이4가 왔다!!  
`Nuru Project`에서 농장 온,습도 제어 및 카메라 모듈 사용이 필요했기 때문.  
처음 다뤄보는 라즈베리파이였고 중간중간에 어려움이 있어 포스팅으로 과정을 남긴다.  

온,습도 보다 제일 급했던건 카메라였기 때문에, 카메라 모듈을 포함하여 라즈베리파이를 먼저 구매하였다.  
회사에서 비용처리를 해주어 좋은 스펙의 기기를 구매하였다.  
아래에선 어떤 제품을 샀는지에 대해 언급해보겠다.  

먼저 라즈베리파이 본체.  
`Raspberry Pi 4 Computer Model B 8GB RAM`  
- 64-bit quad-core Cortex-A72 processor
- 8GB LPDDR4 RAM
- 2 micro HDMI ports
- 2 USB 3.0 ports
- 2 USB 2.0 ports
- Gigabit Ethernet port
- 802.11b/g/n/ac wireless
- Bluetooth 5.0
- 5V/3A USB-C power supply required

위와 같은 스펙을 가지고 있다.  

OS를 깔기 위해 SD 카드 역시 구매.  
`SD Card`
- MicroSDHC/XC, Class10, UHS-I (U1), 95MBs [액센 캐릭터 마이크로 SD카드] MicroSDXC 64GB  

카메라 기능 사용을 위해 카메라 모듈 구매  
`카메라 모듈`  
라즈베리파이 카메라모듈 V2, 8MP (RPI 8MP CAMERA BOARD)  

아, 방열판과 케이스도 샀다.  
당연히 전원 어댑터도 포함!!   

25만원 정도 들었던 것 같다.  

---  

## 🐣 라즈베리파이 4 설치

샀으니 설치도 하고 써보기도 해야지.  
설치는 아래와 같은 과정을 거친다.  

1. 본인 컴퓨터에 라즈베리파이 Imager를 설치한다.  
1. USB 리더기에 Micro SD Card를 삽입한다.
1. 그 USB를 본체에 꼽고 Imager를 통해 라즈베리파이 OS를 굽는다.    
1. 라즈베리파이에 Micro SD카드를 연결, 모니터, 키보드, 마우스 연결하고 전원을 킨다.  

글은 어렵다. 나는 그림이 좋다.  

**1.** [이 링크에서](https://www.raspberrypi.com/software/) Download for Windows를 클릭  
![link](/assets/images/post_img/iot/raspberry-pi-install/link.JPG)  

**2.** Raspberry Pi Imager 실행  

**3.** 운영체제 OS 선택 클릭  
![imager](/assets/images/post_img/iot/raspberry-pi-install/imager.JPG)  

**4.** Raspberry Pi OS (other) 클릭  
![select1](/assets/images/post_img/iot/raspberry-pi-install/select1.JPG)  

**5.** Raspberry Pi OS (64-bit) 클릭  
![select2](/assets/images/post_img/iot/raspberry-pi-install/select2.JPG)  

**6.** Option 선택  
- SSH 사용 체크 
  - 비밀번호 인증 사용 체크  
- 사용자 이름 및 비밀번호 설정  
  - 이름 : pi  
  - 비밀번호 : 원하는거1234  
- WIFI 설정  
  - SSID : 와이파이 명  
  - 비밀번호 : 와이파이 비밀번호  
- 나머지는 기본 셋팅  
![option1](/assets/images/post_img/iot/raspberry-pi-install/option1.JPG)  
![option2](/assets/images/post_img/iot/raspberry-pi-install/option2.JPG)  

**7.** 저장소 선택 및 쓰기 버튼 클릭  

이제 OS가 Micro SD Card에 구워졌다. 

---  

## 🍓 라즈베리파이 실행  

**1.** 위에서 구운 OS가 담긴 Micro SD카드를 라즈베리파이에 삽입.  
![sd-card](/assets/images/post_img/iot/raspberry-pi-install/sd-card.jpg)  

**2.** 카메라 모듈 연결  
참고로 나는 카메라 연결하기가 어려웠다.  
아래의 공식 사이트에서 영상으로 설명이 잘 되어있으니 참고 바란다.  
[공식 사이트](https://projects.raspberrypi.org/en/projects/getting-started-with-picamera/2)  

![camera-module](/assets/images/post_img/iot/raspberry-pi-install/camera-module.jpg)  

**3.** HDMI, 키보드, 마우스 연결  
HDMI to Micro HDMI를 구매하였다.  
키보드와 마우스는 무선을 사용하였음.  
![hdmi](/assets/images/post_img/iot/raspberry-pi-install/hdmi.jpg)  

**4.** 라즈베리파이 4에서는 전원 버튼이 따로 없다. 전원 포트만 연결하면 됨.  
바로 연결해보자.  

**5.** 명령어 입력.  
초기 설정? 느낌으로 업데이트 및 업그레이드를 해 줄 것이다.  
업데이트 및 업그레이드가 다 끝나면 리부트를 해주자.  
- sudo apt-get update
- sudo apt-get upgrade
- sudo reboot

이제 라즈베리파이4 설치가 끝났다.  
우측 상단에 아이콘으로 와이파이를 연결할 수 있다.  
또한, `$ ifconfig`명령어를 사용하면 자신의 ip를 확인할 수 있다.  

---  

## 📸 카메라 연결 및 사진 찍기

위 과정을 완료하였다면, (라즈베리파이4 기준) 터미널을 킬 수 있을 것이다.(Terminal 단축키 : Ctrl + Alt + T)  
찾아보니, 라즈베리파이에서 카메라를 사용하려면 `Preferences/Raspberry Pi Configuration/Interface`에서 Camera를 Enable 하는 등 셋팅이 더 필요하다고 언급한다.  

공식적으로 Bullseye 버전부터는 카메라를 알아서 detect 해주어 따로 설정이 필요 없다고 하더라.(아래 공식 문서 참고)  
이것은 더이상의 `PiCamera Python 라이브러리를 지원하지 않음`을 의미한다.  
또한, `raspicam`역시 지원하지 않게 된다.  
따라서, libcamera와 같은 표준 Linux framework를 기반으로 하는 새로운 오픈소스 카메라 스택을 사용해야 한다.  
> [공식문서](https://www.raspberrypi.com/documentation/accessories/camera.html#libcamera-and-libcamera-apps)  
> [bullseye-camera-system](https://www.raspberrypi.com/news/bullseye-camera-system/)  

그럼 따로 할 설정도 없으니 사진을 찍어보도록 하자.  

나와 같은 환경이라면, 아래의 명령어로 사진을 찍을 수 있다!!  
`$ libcamera-jpeg -o cam.jpg`  

이제 이 카메라 기능을 사용하여 농장의 사진을 찍고 firebase에 올리는 등의 작업이 진행될 것이다.  
`python`을 사용하여 진행할 예정이고, `libcamera`를 살펴볼 필요가 있어보인다.  

🔥 본 포스팅은 직접 해보고 따끈따끈하게 작성한 것임.  
최소한의 과정을 담고 있기 때문에, 생략된 부분이 존재할 수 있음.  
포스팅에 틀린 내용이 있다면 알려주시면 감사하겠습니다!  
{: .notice--warning}   
