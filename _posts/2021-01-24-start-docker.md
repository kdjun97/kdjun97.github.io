---
title: "도커(Docker) 입문"
excerpt: "도커(Docker)가 무엇인가? 설치와 명령어까지 익혀보자!"

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

# 도커(Docker)에 대한 설명 

도커(Docker)가 무엇인가?  
- 도커(Docker)는 컨테이너 기반의 오픈소스 가상화 플랫폼이다.  
ex) 이 도커를 통해 Windows에서 Ubuntu Linux를 사용할 수 있다.  
- 내 Local에 굳이 Python, Linux, NodeJS같은 환경들을 설치하지 않아도, docker container에서 사용가능하다는 장점이 있다.  
- 또, 위험한 os실험을 하다가, 잘못되면 컨테이너만 날리면 되므로 아주 쓸만하다.  
- 도커는 운영체제 자체를 가상화 시켜 사용할 수 있게 해주었다.  
- 특징은 VMWare나 VirutalBox와 달리, 시스템 리소스를 딱 필요한 만큼만 사용하여 훨씬 가볍다는 것.  

![docker_image](/assets/images/docker/docker_image.PNG)  
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

---  
  
# 도커(Docker) 설치  

#### MacOS 환경에서 설치하기  

[Docker_Mac Install](https://hub.docker.com/editions/community/docker-ce-desktop-mac)  

#### Windows 환경에서 설치하기
아쉽게도, MAC과 달리, Windows OS는 설치가 조금 까다롭다.  

1. 본인의 컴퓨터에 윈도우 버전 확인.  
- 방법 : 내 컴퓨터(우클릭) - 속성 - Windows 버전 확인.  

2. Windows 10 Home Edition이라면 업그레이드.    
- Home Edition을 사용중이라면, 에러가 뜰 수 있습니다.  
- Education으로 본인의 PC를 업그레이드 하셔야 Docker 사용에 문제가 없습니다.  
- Pro도 가능합니다.  

3. 설치  
- [Docker_Windows Install](https://hub.docker.com/editions/community/docker-ce-desktop-windows)에서 다운로드 받기  

4. Hyper-V enable → [BIOS] Intel - CPU Virtualization enable / AMD - SVM mode enable  
- 이 부분은 내가 MSI 노트북을 썻을 때, 따로 셋팅하지 않았다.  
이것은 노트북마다 다른 것 같다.  

---  

#### Docker에서 자주 쓰이는 명령어  

1. 컨테이너 이미지, 상태 확인  
- 컨테이너 상태 확인  
```$ docker ps -a : Docker 컨테이너 목록 출력```  
a옵션은 종료된 컨테이너까지 보여줌.  
- 컨테이너 이미지 확인  
```$ docker images : 로컬에 다운된 도커 이미지 목록을 보여줌```  

2. 컨테이너 실행  
- ```$ docker run --name mine -it kdjun97/ubuntu```  
-it은 터미널로 컨테이너에 접속할 수 있게 해주는 옵션  
--name은 컨테이너에 naming을 할 수 있게 해주는 옵션  
참고로 컨테이너를 종료하려면 ```$ exit```로 종료하면 된다.  

3. 종료된 컨테이너 재실행  
- ```$ docker start -ai 35ce92c```  
-ai는 컨테이너에 접속하여 터미널처럼 사용할 수 있게 해주는 옵션  
컨테이너 아이디가 `35ce92c`라면 ```$ docker start -ai 3```로 실행도 가능하다.  
하지만 컨테이너 아이디가 `35ce92c`, `3d921a2` 이렇게 두개라면, 35까지 입력해서 구분을 시켜줘야한다.  

4. 컨테이너,이미지 삭제  
- ```$ docker rm 35ce92c```  
컨테이너는 삭제해도 컨테이너 하나만 삭제된다.  
컨테이너에 쓰였던 이미지는 남아있어, 새로운 컨테이너를 다시 생성해서 다시 작업을 할 수 있다.    
- ```$ docker rmi kdjun97/ubuntu```  
(kdjun97/ubuntu 이미지 삭제)  
하지만, 이미지를 삭제하면, 다시 다운받아야한다.  

일단, 이정도만 알아도 docker를 요긴하게 사용할 수 있다.  

출처: [Ghost 한찬솔님의 블로그](https://ccss17.github.io/ProgrammerBase/docker/#_1)  

---  

#### Dockerfile build    

아까 Dockerfile을 build해서, docker image를 만든다고 하였다.  
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

---  

#### docker 명령어 정리  

1. Local에 있는 파일을 컨테이너로 copy  
- ```$ docker cp [Local 경로] [컨테이너 이름]:[컨테이너 내부 경로]```  
- `$ pwd`로 컨테이너의 현재 디렉토리 경로를 본다.  
- **Windows cmd**에서 명령어를 입력해야 한다. copy할 대상은 C:\pl이라는 폴더라고 가정하자.      
- `$ docker cp "C:\pl" mine:[위에서봤던 path]` (cmd에서 해야함.)  
- Local에 있는 파일을 컨테이너로 copy할 수 있다.  
- 참고로 리눅스에서 `$ pwd`를 통해 현재 디렉토리의 경로를 볼 수 있다.  
- 이렇게 copy한 경우, 읽기전용? 권한으로 copy되는 것 같다.  

2. 이미지 찾아보기  
- ```$ docker search [image 이름]```  
- docker hub에서 사용 가능한 이미지 목록을 보여준다.  
- star순으로 표시.  

3. Volume  
- 볼륨은 도커 컨테이너와 Local 컴퓨터의 데이터를 연결시켜주는 옵션이라고 생각하면 된다.  
- 위의 **cp** 명령어로 컨테이너 파일과 Local에서 복사가 가능하지만, 아예 폴더 자체를 공유(데이터를 공유)해버리는 옵션이 Volume이다.  
- ```$ docker volume ls``` 명령어로 볼륨 목록을 볼 수 있음.  
- ```$ docker volume prune``` 한꺼번에 모든 볼륨을 제거.  
- ```$ docker -v [Local경로]:[container경로]```로 볼륨을 지정해줄 수 있다.  
- ex) ```$ docker run -it --name python_jupyter -v D:/pythonTest:/home/pythonTest continuumio/anaconda3```  
  - 내 Local D드라이브의 pythonTest라는 폴더를 컨테이너/home/pythonTest 폴더와 연결한다.(데이터 공유)  
  - 나머지 옵션들의 설명은 생략.  

---   

#### docker로 anaconda3 환경 + python jupyter notebook 사용

Windows에서 anaconda3(+jupyter notebook) 사용하기  

- 수업 때, 파이썬 환경과 아나콘다를 설치해야 했는데, local에 설치하기 싫어서 도커에 설치해보았다.  
- image는 ```$ docker search anaconda3```로 가장 star가 많은 continuumio/anaconda3 image를 사용하였다.  
- 컨테이너 만들기  
  - ```$ docker run -it --name anaconda3 -p 8888:8888 -v D:/pythonTest:/home/pythonTest continuumio/anaconda3```  
  - `-p 옵션`은 포트 포워딩이라 생각하면됨.
  - 호스트의 8888포트가 도커 컨테이너의 8888포트로 연결됨.
  - `-v 옵션`은 volume 옵션이라고 한다.
  - 내 로컬의 폴더와 컨테이너의 폴더를 연결해줌.(데이터 공유)
- Jupyter Notebook 시작  
  - ```$ jupyter notebook --ip=0.0.0.0 --port=8888 --allow-root```  
  - bash창에 copy and paste one of these URLs 중 카피해서 주소창으로 접속하면 됨.  
- Jupyter Notebook에서 tensorflow 등 사용하기  
  - 패키지 다운받으면 됨.  
  - ```$ pip install tensorflow keras```  
  - 이 수업에서는 tensorflow와 keras를 필요로 하여 다운받았음.  