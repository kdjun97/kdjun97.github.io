---
title: "도커(Docker) 입문"
excerpt: "도커(Docker)가 무엇인가? 도커를 설치해보자!"

categories:
  - Docker
tags:
  - [Docker]

permalink: /docker/start-docker/

toc: true
toc_sticky: true
 
date: 2021-01-24
last_modified_at: 2021-01-24
published: true
---

> 참고: GHOST GBC 1주차에 Programmer Base를 통해 도커에 대해 알려주신 한찬솔님께 감사드립니다.  

> 출처: [GBC_Programmer_Base](https://ccss17.github.io/ProgrammerBase/docker/#_1)  
정리에 앞서, 도커에 대한 설명이 위 출처에 상세하게 기록되어 있어 더 깊게 도커를 알아보고 싶으시면 위 출처를 참고하시기 바랍니다.  

---   

# 🐬 도커(Docker)에 대한 설명 

도커(Docker)가 무엇인가?  
- 도커(Docker)는 컨테이너 기반의 오픈소스 가상화 플랫폼이다.  
ex) 이 도커를 통해 Windows에서 Ubuntu Linux를 사용할 수 있다.  
- 내 Local에 굳이 Python, Linux, NodeJS같은 환경들을 설치하지 않아도, docker container에서 사용가능하다는 장점이 있다.  
- 또, 위험한 os실험을 하다가, 잘못되면 컨테이너만 날리면 되므로 아주 쓸만하다.  
- 도커는 운영체제 자체를 가상화 시켜 사용할 수 있게 해주었다.  
- 특징은 VMWare나 VirutalBox와 달리, 시스템 리소스를 딱 필요한 만큼만 사용하여 훨씬 가볍다는 것.  

![docker_image](/assets/images/post_img/docker/start-docker/docker_image.PNG)  
도커는 위 사진과 같이,  
1. Dockerfile이라는 파일에 환경, 패키지들과 각종 셋팅(?)들을 작성해주고  
2. build를 해주어 Docker image를 생성한다.  
3. 이 image를 run하면 우리는 Dockerfile에서 설정한 환경의 Docker Container를 사용할 수 있게 된다.  

예시를 들어보자.  
만약, Dockerfile에 Ubuntu Linux에 대한 환경설정들이 되어있고, 그것을 build해서 Docker Image로 만들었다.  
그렇다면, run을 통해 우리는 Docker Container를 생성할 수 있게 되고, 이 Docker Container는 Ubuntu Linux에 대한 환경이 설정되어있다.  
즉, Ubuntu Linux의 환경 담은 가상환경이 만들어지는 것이다.  

> 이 기술로 Window에서도 Ubuntu Linux를 사용할 수 있다!  
> 혹은 Local에서 작업하기 꺼려지는 부분들을 도커에서 사용할 수도 있다!  

[Dockerfile이 무엇인가요??](https://kdjun97.github.io/docker/dockerfile/)  

---  
  
# 🛠️ 도커(Docker) 설치  

#### 💻 MacOS 환경에서 설치하기  

[Docker_Mac Install](https://hub.docker.com/editions/community/docker-ce-desktop-mac)  

#### 💻 Windows 환경에서 설치하기
아쉽게도, MAC과 달리, Windows OS는 설치가 조금 까다롭다.  

1. 본인의 컴퓨터에 윈도우 버전 확인.  
- 방법 : 내 컴퓨터(우클릭) - 속성 - Windows 버전 확인.  

2. Windows 10 Home Edition이라면 업그레이드    
- Home Edition을 사용중이라면, 에러가 뜰 수 있음  
- Education으로 본인의 PC를 업그레이드 하셔야 Docker 사용에 문제가 없음  
- Pro도 가능  

3. 설치  
- [Docker_Windows Install](https://hub.docker.com/editions/community/docker-ce-desktop-windows)에서 다운로드 받기  

4. Hyper-V enable → [BIOS] Intel - CPU Virtualization enable / AMD - SVM mode enable  
- 이 부분은 내가 MSI 노트북을 썻을 때, 따로 셋팅하지 않았다.  
이것은 노트북마다 다른 것 같다.  