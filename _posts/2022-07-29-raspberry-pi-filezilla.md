---
title: "[Raspberry Pi] 라즈베리파이 4 FileZilla로 파일 전송"  
excerpt: "FileZilla SFTP로 파일 전송"

categories:
  - IoT
tags:
  - [IoT, Raspberry Pi]

permalink: /iot/raspberry-pi-filezilla/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-07-29 10:00:00
last_modified_at: 2022-07-29 10:00:00
published: true
---

## 📦 FileZilla(SFTP) 이용 파일 전송

> [FileZilla 다운로드](https://filezilla-project.org/download.php)  

local file을 라즈베리파이에 전송하고 싶을 수도 있고, 반대의 경우도 원할 수 있다.  
하지만, 어떻게 파일을 주고 받는단 말인가??  

우리는 `FileZilla`라는 FTP 프로그램을 이용할 것이다.  
쉽게 생각하자. 파일 전송을 대리해주는 프로그램이라 보면 된다.  
용어 2개만 알아보고 본론으로 들어가보자.  

`FTP` : File Transfer Protocol  
`SFTP` : SSH File Transfer Protocol  

FTP는 파일 전송 프로토콜, SFTP는 SSH에 파일 전송 프로토콜.  
이렇게 이해하면 될 것 같다.  
더 궁금한 점이 있다면 검색을 통해 알아보자.  

FileZilla를 다운받았다면, 실행.  
필요한 칸들을 채워보자.  

`호스트` : sftp://라즈베리파이 ip  
`사용자명` : 라즈베리파이 id  
`비밀번호` : 라즈베리파이 pwd  
`포트` : 22 기본 포트를 적어줬음.  

그 후, 빠른 연결 클릭! 실행 화면은 아래와 같다.  

![sftp](/assets/images/post_img/iot/raspberry-pi-filezilla/sftp.JPG)  

이제 라즈베리파이와 로컬 pc 끼리 파일 전송이 된다!  
로컬과 FileZilla SFTP 서버에서 파일을 `드래그 앤 드롭` 해주면 전송이 된다.  