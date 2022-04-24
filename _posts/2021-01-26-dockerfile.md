---
title: "Dockerfile! 나만의 docker image를 만들고 공유까지!"
excerpt: "Dockerfile build, Dockerhub에 docker image를 공유해보자!"

categories:
  - Docker
tags:
  - [Docker]

permalink: /docker/dockerfile/

toc: true
toc_sticky: true
 
date: 2021-01-26
last_modified_at: 2021-01-26
published: true
---

#### Dockerfile build    

전 포스팅에서 Dockerfile을 build해서, docker image를 만든다고 하였다. [도커(Docker) 입문 참고](https://kdjun97.github.io/docker/start-docker/)  
docker image를 만든 소스코드가 Dockerfile이다.
Dockerfile을 작성했다면, docker build 명령어로 docker image를 생성 가능하다.  
- ```docker build --tag kdjun97/ubuntu```  
현재 디렉토리에 Dockerfile을 찾아, kdjun97/ubuntu라는 태그로 docker image를 생성함.  

> 나의 Ubuntu Unminimize Dockerfile을 참고하려면, [Dockerfile](https://github.com/kdjun97/ubuntu-unminimize/blob/master/Dockerfile) 참고!  

---  

#### Docker hub에 image 공유  
1. 먼저, ``` $docker login```명령어로 docker에 login한다.  
2. 이미지 태그  
``` $ docker tag kdjun97/ubuntu kdjun97/ubuntu```  
기존에 만든 kdjun97/ubuntu이미지에 kdjun97/ubuntu 태그를 추가하는 예(나는 똑같은 이름으로 했다.)  
앞에 나온 kdjun97/ubuntu가 기존에 build한 이미지고 뒤에는 rename을 해도 무방하다.  
보통, 버전도 붙여서 ```$ docker tag kdjun97/ubuntu kdj/ubun:1```이런식으로 적기도 한다.  
3. Docker gub에 image 전송  
``` $ docker push kdjun97/ubuntu```  
rename 한 예제,  
``` $ docker push kdj/ubun:1```  

---  

하지만, 매번 번거롭게 Dockerfile을 만들지 않아도 된다.  
이미, 누군가가 도커 허브에 Docker Image를 만들어놓았기 때문!  
도커 허브에서 다른 사람들이 등록한 도커 이미지를 찾아보고 사용도 가능하다.  
도커 허브에는 **Java, Python, gcc, MySQL, Ubuntu Linux, NodeJS** 등등 기업과 커뮤니티 혹은 개인들이 자신의 프로그램을 도커 이미지로 많이 만들어 놓았다.  
여기에서 본인이 편한 이미지를 찾아 사용해도 무방하다.  
관심이 있다면, 직접 찾아보는 것을 추천한다.  
[도커 허브 사이트](https://hub.docker.com/)  