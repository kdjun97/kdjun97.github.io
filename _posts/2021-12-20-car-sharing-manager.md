---
title: "[Spring] 카풀 이용자를 위한 웹 서비스 개발"
excerpt: "MVC 패턴을 이용한 웹 서비스 개발"

categories:
  - Web
tags:
  - [Web, Spring]

permalink: /web/car-sharing-manager/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2021-12-20 23:10:00
last_modified_at: 2021-12-20 23:10:00
published: true
---

# 🔗 프로젝트 생성에 앞서

스프링 framework는 웹을 개발할 때, 많이 사용되는 framework이다.  
그 이유로는, 잘 설계된 웹 MVC framework가 있고, 모듈화가 잘 되어있다는 점 또한 꼽을 수 있다.  
그리고, JDBC 등 기술을 위한 다양한 템플릿을 제공해준다.  
결과적으로, **Java를 위한 가장 인기있는 애플리케이션 개발 프레임워크**이기 때문에, Spring framework로 개발을 진행할 것이다.  

---

# 🌻 스프링 프레임 워크 개발(Web)  

학기 중, 간단한 웹 서비스를 만드는 프로젝트가 있었다.  
기간은 사실상 거의 2주?도 안줬던 것 같다.  
나와 다른 친구 총 2명이서 협업했고, 친구는 css와 포스터 제작을 맡았다.  
각설하고, 바로 본론으로 들어가보자.  

**Info**  
- Version : 1.0.0  
- Development Environment
  - STS 4.11.1  
  - jre 1.8  
- Deploy URL: [Deploy Link Here](https://angel10004.herokuapp.com/)  
- Github URL : [Github Link Here](https://github.com/kdjun97/car-sharing-manager)  

> heroku를 이용하여, 무료 호스팅 및 deploy함.  

---  

**Description**  

카풀 이용자와 카풀 운전자끼리 연결을 맺어주고, 입금 관리까지 도와주는 서비스이다(실제 서비스 연동은 되지 않음. 컨셉만 존재)  
이 서비스에는 특이한 기능이 있는데, 그 기능은 black 기능이다.  
입금을 하지 않았던 사용자의 black값이 count되고, 그 count는 방에서 값이 보여지게끔 되어있다.  
따라서, 이용자로 하여금 경각심을 가지게 하며, 서로 거래를 깔끔하게 하자는 취지로 만든 간단한 웹이다.(사실은 카풀 운전자들의 의견을 수렴하여 만든 웹이기도 하다.)  

---  

**Usage**  

회원가입을 하고, session 정보가 있는 회원만 들어갈 수 있다.  
또한, room 하나에는 이용자 한 명만 들어갈 수 있다.  
방장만이 입금 여부와 추방을 할 수 있는 권한이 있고, 방을 만들 때, contents를 넣을 수 있게 하여 메시지를 표시하게 했다.  
운행을 마친 카풀 운전자(방장)가 방을 파기할 수 있다.  
이렇게 간이로 카풀 운전자와 카풀 이용자끼리 방을 만들어 매칭을 시켜줄 수 있고, 인원은 최대 4명으로 제한되어있다.  

---

**DB Schema**

db 초기 설계  
![MVC](/assets/images/post_img/car-sharing-manager/db.jpg)  

후에 이렇게 바뀜. (쿼리문임을 양해 바람. black_list 테이블 제거)  
![MVC](/assets/images/post_img/car-sharing-manager/db2.JPG)  

**History**

> [Github 참고](https://github.com/kdjun97/car-sharing-manager)  

**Paging**  

![MVC](/assets/images/post_img/car-sharing-manager/page.jpg)  

바빠서 그냥 손으로 그렸음. 양해 부탁.  

**Directory**

![MVC](/assets/images/post_img/car-sharing-manager/directory.png)  

**서버**

학교에서 제공해준 서버의 phpMyAdmin을 이용하였다.  
Local에서 돌려볼 땐, Tomcat으로 돌렸다.  

**로드맵 설계(프로젝트 향후 계획)**  

- 1.0 Version
  - user가 현재, 하나의 방만 입장 가능.  
  - 대기열 없음.  
  - 인원수 4명 제한  
- 2.0 Version
  - 대기열 추가  
  - 방 만들기 옵션 추가(ex : 인원 설정 등)  
  - chatting 기능 추가(chatting table 생성 후, 시간 순으로 orderby)  
  - Sign Up시, exception 구문 추가
- 3.0 Version
  - 계좌 송금 기능 추가

---  

#### 🍒 프로젝트 결과

DAO(Data Access Object), VO(Value Object), Controller, Service class로 유지보수를 쉽게 가져가기 위해 각 기능을 담당하는 분리되는 클래스를 만듦.  
DB관련 query문은 mapper package에 다 넣음.  
각 페이지들은 views 폴더 안에 .jsp 형태로 존재.  
deploy는 heroku를 이용하여 하였음.  
 
이번 프로젝트는 유지&보수를 위해 디렉토리 구조에 대해 신경을 많이 썼고, query문은 mapper에 넣는 등 실제로 서비스 구현 및 유지 보수에 대해 최대한 관리가 쉽게끔 코드를 짰다.  
MVC라는 패턴에 대해 알게되었고, 아키텍처에 대해 경험할 수 있었던 시간이었다.  

웹 프로젝트를 이렇게 까지 만들어 본 적은 처음이다.  
최대한 client의 편의와 개발자의 편의를 같이 고려하여 db를 짜고, page를 구성했고, 프로젝트 시작 전 큰 틀을 잡고 시작한 프로젝트였다.  

지금 이 프로젝트는 규모가 작지만, 나중에 큰 프로젝트를 진행할 때는 이런 식의 구조화가 필요하고, 프로젝트를 무작정 시작하기 보다는 뭘 할지 구상해보고 계획을 잡고 개발을 해야겠다고 느꼈다.  

또한, 클린 아키텍처 클린 코드가 굉장히 중요하다는 점을 느꼈다!  