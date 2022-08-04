---
title: "[Python] 백그라운드 실행 (nohup)"  
excerpt: "background로 .py를 돌려보자"

categories:
  - Python
tags:
  - [Python]

permalink: /python/python-background/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-08-04 04:00:00
last_modified_at: 2022-08-04 04:00:00
published: true
---

## 🔧 nohup

백그라운드에서 파이썬 코드를 실행하려면 어떤 방법을 써야할까?  
보통 linux에서 &를 마지막에 붙이면 백그라운드 작업을 할 수 있다.  
하지만, 이 방법은 안전한 방법이 되지 않는다.  
해당 쉘이나 터미널이 종료되면 같이 종료된다.  

따라서 우리는 `nohup`을 사용할 것이다.  

`nohup` : **no hangup**의 줄임말, '끊지마!(프로세스를 끊지마!)'라는 뜻.  리눅스 명령어임.  
터미널 세션이 끊겨도 프로그램을 종료하지 마라! 라는 명령어.  

어떠한 프로그램을 종료 없이 백그라운드에서 실행시키기를 원한다면,  
`$ nohup python test.py &` 를 입력한다면 백그라운드 실행이 될 것이다.  
-> 위 명령어는 안전하게 `&(백그라운드)`와 `nohup`을 같이 쓰는 방법이다  

**실시간 로그와 함께 백그라운드 작업을 하는 법**  

실시간으로 로그를 확인하며 백그라운드 프로그램을 돌릴 수도 있다.  

`$ nohup python -u test.py &` : -u 옵션 추가  
`$ tail -f nohup.out` : 로그 출력  
위 명령어로 실시간 로그를 출력하며 백그라운드 작업을 할 수 있다.  

**PID 알아내기**  

`$ ps -ef | grep test.py`   

또한, 위 명령어로 현재 백그라운드에서 어떤 프로그램이 돌아가는지 PID를 확인할 수 있다.

**프로세스 종료**  

`$ kill PID`  

마지막으로 백그라운드에서 돌고있는 프로세스를 종료하는 명령이다.  

💡 참고로 권한이 755 이상이여야 nohup으로 파일을 실행시킬 수 있다.  
따라서 권한 변경을 하기 위한 코드를 첨부한다.  
chmod 755 camera.py  
{: .notice--info}   