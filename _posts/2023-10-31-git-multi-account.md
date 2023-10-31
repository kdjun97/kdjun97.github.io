---
title: "[Git/Github] Git 멀티계정 (회사용, 개인용) 적용해보기"  
excerpt: "회사용, 개인용 git 계정 및 설정을 적용해보자"

categories:
  - Git/Github
tags:
  - [Git, Github]

permalink: /git-github/git-multi-account/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2023-10-31 10:00:00
last_modified_at: 2023-10-31 10:00:00
published: true
---  

# 🤫 Git 멀티 계정 (개인, 회사용)  

우선, 9개월? 만에 포스팅을 다시 하는 것 같다.  
너무 오랫동안 블로그를 안써서 쓰는 방법을 까먹었다..  
각설하고 시작해보자.  

알다시피 나는 github 블로그를 사용하고 있고, 내 개인 계정으로 git command를 날린다.  
블로그를 쓰려면 개인 계정으로 로그인 해야하고,  
회사에서 일을 하려면 회사 계정으로 일을 해야한다.  

그 때마다 계정을 스위칭하기란 너무 번거로울 것 같고, 자칫 회사 계정에 묶여있는 곳들에서 문제를 일으킬까봐 고민을 했다.  
구글에 검색을 해보았고, 해결 방법은 역시 존재했다. (만세!)  

대략 30분? 1시간? 정도 걸린 것 같은데 이 글을 보는 여러분들은 10분만에 해결할 수 있도록 포스팅을 시작해보겠다.(언제나 서론이 길다)  

# 🔧 Setting  

> ![여기 참고하였음](https://steemit.com/hive-137029/@anpigon/20220605t141226727z)  

우선, 원리는 `개인용 폴더`, `회사용 폴더` 두 폴더(하위폴더 포함)를 분리하여, 각각 다른 git 셋팅을 적용시켜주는 원리이다.  

## 1. .gitconfig 설정

`$ vi ~/.gitconfig`  

```  
[user] -> global 하게 적용할 gitconfig
  email = user@email.com
  name = username

[includeIf "gitdir:~/Documents/jumy/"] -> 개인용 폴더 설정
  path = ~/.gitconfig-personal

[includeIf "gitdir:~/Documents/company/"] -> 회사 폴더로 설정 
  path = ~/.gitconfig-company
```  

위 내용을 복붙하는게 좋다. (typo 방지)  

## 2. 폴더별 계정 정보 셋팅  

아까 path 잡아줬던 경로에서 gitconfig 파일들을 셋팅해준다.  

**개인용**  
`$ vi ~/.gitconfig-personal`  

```  
[user]
  name = MyGithubName
  email = MyGithubEmail
```  

**회사용**  
`$ vi ~/.gitconfig-company`  

```  
[user]
  name = MyGithubName
  email = MyGithubEmail
```  

이제 개인용, 회사용 gitconfig 설정 파일 작성이 끝났다.  
위 1번의 경로 아래폴더들은 2번에서 정해준 gitconfig 설정을 따를 것이다.  

각 폴더에서 아래의 명령어로 확인할 수 있다.  
`$ git config user.name`  

⚠️ 나는 여기서 좀 헤맸는데 내가 설정한 개인용 폴더에서도 global username, email이 나왔다.  
각 폴더에 git init된 폴더가 있다면 거기서 git config user.name 명령어로 확인해보자.  
git initialize된 폴더는 위 1,2번에서 해준 셋팅대로 계정 정보가 알맞게 나오는 것을 확인할 수 있었다.  
{: .notice--warning}  

## 3. SSH 인증  

위처럼 셋팅만 한다고 로그인이 되는 것은 아니다.  
password로 인증을 하거나, ssh로 인증을 해야한다.  
이 포스팅은 후자의 방법으로 인증을 진행하겠다.  

인증을 위해선 ssh 키 쌍이 필요하다.  
우리는 개인용, 업무용 폴더를 나누었기 때문에, 키 쌍도 2개를 처리해야한다.  

⚠️ 위기2  
아마 위 블로그 글만 따라한다면 3번 과정을 다 한 뒤, 나중에 git clone을 할 때 에러가 날 것이다.  
그 이유는 현재 디렉토리에 파일들이 생성되고, 나중에는 다른 path를 보게 되기 때문이다.  
따라서 우리는 미리 파일 경로를 잡아줘야할 필요가 있다.  
{: .notice--warning}  

**파일 path 미리 잡아주기**  
`$ cd ~/`  

**개인용 ssh 키 쌍 생성**  
`$ ssh-keygen -t ed25519 -C "MyPersonalEmail@naver.com" -f "id_ed25519-personal"`  

**회사용 ssh 키 쌍 생성**  
`$ ssh-keygen -t ed25519 -C "MyCompanyEmail@naver.com" -f "id_ed25519-company"`  

커맨드 입력 후, **id_ed25519**, **id_ed25519.pub**  가 생성된다.  
물론 우리는 개인용, 회사용 총 4개의 파일이 생성되었을 것이다.  

이제 키 쌍들과 ssh에 대한 설정을 진행한다.  

`$ vi ~/.ssh/config`  

```  
Host github-personal.com
  HostName github.com
  User git  
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519-personal

Host github-company.com
  HostName github.com
  User git  
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519-company
```  

그대로 내용을 적어준 뒤, 저장해주자.  
이렇게 설정하면 개인용 폴더, 회사용 폴더에 서로 다른 ssh 인증을 하게 된다.  

## 4. 검증  

검증? 이라 거창하게 말 할 것은 아니고, 개인과 회사 폴더를 분리했기 때문에 이제 나는 비로서 git clone으로 내 블로그 레포지토리를 클론할 수 있게 되었다.  
하지만 clone할 때, 서로 다른 2개의 폴더 중 어느 계정의 설정을 사용할 지 모르기 때문에 우리는 아래와 같이 명령어를 입력해야한다.  

`$ git clone git@github-personal.com:[username]/[repository name].git`  

⚠️ 위기3  
위기? 는 아니고 이 과정에서 나는 오류가 떴었다.  
Permission denied (publickey) 라는 오류였고, 아래와 같이 해결할 수 있다.  
{: .notice--warning}  

**clone하면서 나온 이슈 해결**  

나는 개인용 폴더에서 clone을 진행했기 때문에, 개인용 ssh 키 값을 얻어야 한다.  
이것을 Github에 추가할 것이다.  

아까 위에서 얻은 개인용 ssh 키를 얻어온다.  
`$ cat id_ed25519-personal.pub`  
ssh-ed25519 로 시작하는 전부를 복사.  

Github 로그인 - Settings - SSH and GPG Keys 탭 진입  

New SSH key 초록 버튼  

Title 에는 내가 알아볼 수 있는 타이틀을 써주면 되고,  
Key type = Authentication Key  
Key에 아까 복사했던 ssh 키를 붙여넣고 Add SSH key 녹색 버튼을 눌러주면 끝.  

이제 다시 terminal로 돌아와서, 위의 4번 명렁어로 clone하면 성공!  

이제 개인 폴더와 회사 폴더를 나눠서 git 작업을 하면 된다!  