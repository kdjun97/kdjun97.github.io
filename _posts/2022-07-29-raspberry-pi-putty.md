---
title: "[Raspberry Pi] 라즈베리파이 4 PuTTY 원격 접속하기"  
excerpt: "PuTTY 이용 SSH 원격 접속하기"

categories:
  - IoT
tags:
  - [IoT, Raspberry Pi]

permalink: /iot/raspberry-pi-putty/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-07-29 07:00:00
last_modified_at: 2022-07-29 07:00:00
published: true
---

## 🤩 PuTTY를 이용한 라즈베리파이 원격 접속하기

우리는 라즈베리파이를 실행할 때, HDMI를 연결하거나 모니터가 필요했다.  
하지만, 그런 과정 없이 라즈베리파이 전원만 켜져있다면, 원격으로 접속을 할 수 있다.  
이번 포스팅에선 라즈베리파이 원격 접속에 대해 알아볼 것이다.  
그 전에, SSH에 대해 알아보자.  

---  

## 🙄 SSH가 무엇인가요?

`Secure SHell(SSH)`은 원격지 호스트 컴퓨터에 접속하기 위해 사용되는 인터넷 프로토콜이다.  
더욱 자세한 내용은 [이 블로그](https://velog.io/@hyeseong-dev/%EB%A6%AC%EB%88%85%EC%8A%A4-ssh%EB%9E%80)에 잘 기술되어 있다.  

Windows에는 SSH 기능을 수행하는 프로그램이 없다.  
따라서, 우리는 SSH 오픈소스인 `PuTTY`를 사용하여 라즈베리파이에 원격 접속을 할 것이다.  

SSH를 사용하기 위해 라즈베리파이에서 SSH 설정이 필요하지만, 라즈베리파이4에서는 기본적으로 SSH를 지원해주기 때문에 따로 설정을 할 필요는 없다.  

> 만약 안된다면 라즈베리파이에서 `$ sudo raspi-config`로 설정화면에 들어가 SSH를 활성화하면 된다.  

---  

## 🍪 PuTTY로 라즈베리파이 원격 접속

PuTTY는 Windows용 SSH 프로그램이다.  
아래 링크에서 다운로드 하자.  
> [여기서 다운](https://www.putty.org/)   

그리고, 라즈베리파이에서 `$ ifconfig`를 통해 ip를 알아온다.  
여기서, 로컬 pc와 라즈베리파이는 같은 공유기와 연결되어 있어야한다.  

아래 그림과 같이 `Host Name`에 `IP Address`를 적어준다.  
기본 Port `22`로 설정을 한 뒤 `SSH를 체크`한다.  
그리고 OK.  

![session](/assets/images/post_img/iot/raspberry-pi-putty/session.JPG)  

라즈베리파이 ID와 PW로 들어 로그인이 가능하다.  
본인이 설정했던 아이디와 암호로 로그인 하자.  
기본 아이디는 `pi`이다.  
그리고 우리는 Imager로 설치할 당시, 비밀번호를 설정해주었었다!  

![main](/assets/images/post_img/iot/raspberry-pi-putty/main.JPG)  

로그인이 완료된 화면이다.  

![loginok](/assets/images/post_img/iot/raspberry-pi-putty/loginok.JPG)  

이제 원격 접속이 완료되었으니 할 거 하면 된다.  
나는 여기서 python을 사용하여 firebase를 연동할 계획이고, 카메라를 컨트롤할 계획임.  