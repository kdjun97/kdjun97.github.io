---
title: "Docker로 anaconda3 환경 + python jupyter notebook 사용"
excerpt: "Docker로 anaconda3 환경 + jupyter 실행까지!"

categories:
  - Docker
tags:
  - [Docker]

permalink: /docker/docker-jupyter-anaconda3/

toc: true
toc_sticky: true
 
date: 2021-03-10
last_modified_at: 2021-03-10
published: true
---

#### Windows에서 anaconda3(+jupyter notebook) 사용하기  

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
  - bash창에 copy and paste one of these URLs 중 카피해서 주소창으로 접속하면 됨.(아래 그림 127로 시작하는 주소)  
<a href="https://kdjun97.github.io/assets/images/post_img/docker-jupyter-anaconda3/command-jupyter.JPG">
  <img src="/assets/images/post_img/docker-jupyter-anaconda3/command-jupyter.JPG" alt="command-jupyter">
</a>
- Jupyter 실행 사진
![running-jupyter](/assets/images/post_img/docker-jupyter-anaconda3/running-jupyter.JPG)  
- Jupyter Notebook에서 tensorflow 등 사용하기  
  - 패키지 다운받으면 됨.  
  - ```$ pip install tensorflow keras```  
  - 이 수업에서는 tensorflow와 keras를 필요로 하여 다운받았음.  