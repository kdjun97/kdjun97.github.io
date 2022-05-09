---
title: "[Git/Github] Commit 목록으로 누락된 잔디 심기"
excerpt: "Commit Log를 이용하여 깃허브에 누락된 잔디를 심어보자"

categories:
  - Git/Github
tags:
  - [Git, Github]

permalink: /git-github/plant-grass/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-03-27 21:00:00
last_modified_at: 2022-03-27 21:00:00
published: true
---

### 잔디심기

개발자들이 commit을 얼마나 열심히 했는지 보여주는 것 중 하나가 잔디라고 생각한다.  
며칠 전, 나는 열심히 commit을 했음에도 불구하고 심겨진 잔디가 얼마 없는 것을 확인하였다.  
그리고 잔디들을 클릭해보며 내가 했던 기록들이 누락되었다는 것을 알게되었다.  

![적용하기 전1](/assets/images/post_img/plant-grass/before_2021.png)  
![적용하기 전2](/assets/images/post_img/plant-grass/before_2022.png)  

위의 사진들도 복사를 하던 도중, 찍은거라 실제로는 더 적었다.  

---

### 잔디의 조건 (잔디가 심어지지 않는다면?)

알아보니 Github에서 잔디가 심겨지는 조건이 있었다.  

**1.** github 이메일 계정과 로컬의 이메일 정보가 같아야 함.  
**2.** branch는 `main` 혹은 `gh-pages` 둘 중 하나여야 함.  
**3.** forked repo에서 작업한다면, merge가 되지 않을 경우 반영되지 않음.  

나의 경우 1,3번을 지키지 않아 잔디가 심겨지지 않았었다.  
아래에서 조건들을 확인해보자.  

⚠️ 작업중인 로컬 폴더가 있다고 간주함 !
{: .notice--warnning}  

우선, 위의 1번 경우를 먼저 확인한다.  

**1.** Github-본인 계정 Setting-Email 에서 본인 이메일을 알아낸다.  
![이메일 확인](/assets/images/post_img/plant-grass/email.JPG)  

**2.** 작업 중인 폴더에서 git 명령어로 이메일 확인(전역으로)  
`$ git config --global --list`  

**3.** 1과 2가 일치하면 패스. 아니라면 변경.  
`$ git config --global user.email "1번의 이메일 주소"`  

3번까지 했다면, 이제 로컬에서 commit하고 push한다면 잔디가 반영이 될 것이다.  

이제부턴 잔디를 살리는 방법이다.  

---

### Commit History로 잔디 살리기

> [참고 사이트](https://wellbell.tistory.com/43)  

나는 이 사이트를 보고 잔디를 어느정도 찾았다.  
하나의 커밋 로그를 되돌리는 것은 간단하지만, 나는 300개 이상의 커밋을 되돌려야만 했다.  
300번 이상의 같은 작업을 반복하기엔 너무 힘이 들었지만 괜찮았다.  
나에겐 lazy-manager가 있기 때문이다.~~이럴 때 쓰라고 만들었음!!!~~  
혹여나 이런 반복 작업을 수동으로 하고 있었다면 아래 글을 보고 오자.  

> [Lazy Manager](https://kdjun97.github.io/automation-solution/lazy-manager3/)  

---

### Github Forked Repository 이동

🔥 나와 같은 분이 적어도 한 사람은 있다고 생각하여 글을 씀 🔥  
{: .notice--danger}  

나는 github.io 블로그를 이용하고 있는데, 이 commit 내용들은 반영이 되지 않는 현상을 발견하였다.  
이유를 찾아보니 branch가 gh-pages라는 조건은 충족하나, forked repo에서 작업해서 merge가 필요했었다.  

나는 github블로그를 이용하다 보니, 단순히 repository를 이동하는 것이 아닌, 같은 레포지토리를 fork 해제할 필요가 있었다.  
그렇다면 어떻게 repo에 fork를 해제시킬까?  

나는 약간의 편법을 사용하였다.~~(이것이 정통 방법은 아닐 것이다)~~   

나와 같은 선행 조건이라면 이 방법으로 자신의 블로그 commit 기록을 살려 잔디를 심고 이후 액션까지 가능하다.  
**1.** 현재 내 로컬에 작업하던 폴더가 있다.  
**2.** 위의 잔디 살리기 방법을 실행하였으나, 잔디밭에 반영이 안된 경우.  

이제부터 내 github.io를 위한 레파지토리를 **xxx.github.io**라고 하겠다.  

**1.** 기존 `xxx.github.io` repo의 이름을 바꿈(아무거나 상관 없지만 여기선 _xxx.github.io라 하겠음)  
**2.** 새로운 repo를 만듦. 이름은 `xxx.github.io`  
**3-1.** 로컬에 폴더를 하나 만든 후, 그곳에 `_xxx.github.io`를 `clone`한다.  
**3-2.** 명령어 입력 `$ git clone --bare https://github.com/kdjun97/_xxx.github.io.git`   
**4-1.** 만든 폴더에서 `mirror push`를 한다.  
**4-2.** `$ cd _xxx.github.io.git`  
**4-3.** `$ git push --mirror https://github.com/kdjun97/xxx.github.io.git(에러시, .git을 지우면 됨)`  
**5.** 새 폴더를 파고, `$ git clone https://github.com/kdjun97/xxx.github.io`로 클론함.  
**6.** 클론한 폴더에서 작업을 하면 됨!  

이 작업을 거치면, 이름이 동일한 repo에 fork만 해제되고 commit log가 남아있게 된다.  
이제 commit and push로 잔디를 확인해보자!  

![수정 후 2021년 커밋](/assets/images/post_img/plant-grass/after_2021.JPG)  
![수정 후 2022년 커밋](/assets/images/post_img/plant-grass/after_2022.JPG)  

교훈. 초기 셋팅을 잘 하자 + 해결법은 있다  
끝  