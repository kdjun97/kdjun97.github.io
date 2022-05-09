---
title: "[Git/Github] fork와 pull request"
excerpt: "Fork와 pull request에 대해 알아보자"

categories:
  - Git/Github
tags:
  - [Git, Github]

permalink: /git-github/fork-pull-request/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "heart"
 
date: 2021-01-26 10:00:00
last_modified_at: 2021-01-26 10:00:00
published: true
---

## fork

**`fork 설명`**  

만약 다른 사람의 레포지토리 내용을 수정하거나, 추가적인 기능을 넣고 싶을 때, Github에서 fork기능을 이용하여 내 레포지토리로 카피할 수 있다.  

fork한 저장소는 원작자와 연결되어 있다.  
{: .notice--info}  

**`fork 하는 법`**  

![fork_img](/assets/images/post_img/fork-pull-request/fork.PNG)  

1. 본인이 fork하고 싶은 레포지토리에 간다.~~(당연히 다른사람 레포지토리겠죠?..)~~  
2. 우측 상단에 보면 위의 fork 버튼이 있다.  
3. 누른다.  
4. 그러면 본인의 레포지토리에 fork한 레포지토리가 들어갈 것이다.  

---  

## pull request

**`pull request 설명`**  

만약 내가 수정하거나 추가한 내용이 더 좋다고 판단되거나, 오류를 찾아서 그것을 고쳤을 경우, 원작자에게 pull request를 할 수 있다.  
pull request는 <u>원작자에게 바뀐 내용을 받아들일지 물어보는 것이다.</u>  
일단 fork한 내 레포지토리의 파일을 변경하고, pull request로 원작자에게 요청을 할 수 있고,  
만약 원작자가 pull request를 받아들이면, 원작자의 원본 레포지토리가 바뀌게 된다.  
즉, pull request 없이는, **나의 깃허브에 forked된 레포지토리에서만 변경 사항이 적용된다.**  

**`pull request 하는 법`**  

![pull](/assets/images/post_img/fork-pull-request/pull.png)  

1. 원작자의 레포지토리에서 fork를 했을 때,  
2. 오타나 오류, 내용의 수정등을 행하고 push를 한다.(내 레포지토리에만 변경됨.)  
3. **`pull`**이 원작자에게도 '내가 당신껄 고쳤습니다. 반영해주세요~' 요청하는 것이라고 하였다.  
4. 위의 그림과 같이 pull requests에 들어가서 New pull request로 요청을 하자.  
5. 그 후, Create pull requests라는 버튼이 나오면 그냥 클릭하면 끝.  
6. pull request가 받아지면, 당신은 `contributor`가 된다!  