---
title: "도커(Docker) 명령어"
excerpt: "도커(Docker) 명령어는 어떤 것이 있을까? 자주 사용하는 명령어를 익혀보자!"

categories:
  - Docker
tags:
  - [Docker]

permalink: /docker/docker-command/

toc: true
toc_sticky: true
 
date: 2021-01-25
last_modified_at: 2021-01-25
published: true
---

#### 🔍 Docker에서 자주 쓰이는 명령어(기본)  

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

참고: [Ghost 한찬솔님의 블로그](https://ccss17.github.io/ProgrammerBase/docker/#_1)  

---  

#### ✏️ docker 명령어 정리  

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