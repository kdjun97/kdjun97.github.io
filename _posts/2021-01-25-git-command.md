---
title: "Git 명령어 익히기"
excerpt: "Git 명령어에 대해 알아보자"

categories:
  - Git/Github
tags:
  - [Git, Github]

permalink: /git-github/git-command/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "heart"
 
date: 2021-01-25 18:00:00
last_modified_at: 2021-01-25 18:00:00
published: true
---

## git 명령어

여기서는 상세한 설명보다는 어떤 명령어가 있는지와 간단한 설명만 하겠다.  
{: .notice--warning}  

* `$ git init`: 현재 디렉토리를 git 레포지토리로 만들고, git이 디렉토리 내의 파일의 변경을 추적하게 함  
    - (untracked 상태 -> staged 상태)  
* `$ git status`: git 레포지토리의 상태를 출력한다.  
    - 디렉토리 내의 파일들이 untracked, modified, staged, committed 상태인지 알아봄  
    - `-s` 옵션으로 간단하게 출력 가능  
* `$ git add [FILE]`: [FILE]을 스테이징한다.  
    - `$ git add .`을 보통 많이 쓴다.  
    - 파일명 입력 없이 모든 파일을 스테이징한다.  
* `$ git commmit`: 스테이징된 파일들을 하나의 버전으로 만들고, git 데이터베이스에 저장  
    - `$ git commit -m [message]`: 커밋 메세지를 입력하면서 commit  
* `$ git log`: commit 기록 보기  
    - q로 나갈 수 있다.  
    - `$ git log -p`: 변경 사항도 출력하며 commit 기록을 보여줌  
* `$ git push [리모트 저장소의 별칭] [리모트 브랜치]`: 별칭의 브랜치에게 변경사항을 전송한다.  
    - `-u` 옵션: 최초에만 별칭과 브랜치를 써주고, 그 후에 push는 `$ git push`만 적어줘도 됨(별칭, 브랜치 생략 가능)  
    - `-f` 옵션: 별칭의 브랜치에게 변경사항을 강제로 전송한다(덮어쓰기).  
* `$ git remote`: 현재 프로젝트에 등록된 리모트 저장소를 확인할 수 있다.  
    - `-v` 옵션: 별칭과 URL을 볼 수 있다.  
* `$ git remote add [리모트 저장소의 별칭] [리모트 저장소 URL]`: 기존에 있던 원격 저장소를 복제한 것이 아닐 때, 원격 서버의 주소를 git에게 알려주어 새 리모트 저장소를 추가  
* `$ git remote rm [리모트 저장소의 별칭]`: 별칭의 원격 레포지토리 삭제  
* `$ git remote rename [기존 별칭] [새 별칭]`: 기존 별칭을 새 별칭으로 수정 할 수 있다.  
* `$ git remote set-url [리모트 저장소의 별칭] [변경할 URL]`: 별칭의 URL을 바꿈.  
* `$ git clone [URL] [NAME]`: URL의 원격 레포지토리를 NAME 디렉토리에 복제한다.  
    - `$ git clone [URL]`: 단순히 URL만 적어주면, 레포지토리 name으로 폴더를 하나 생성하여 생성된 폴더에 원격 레포지토리를 복제한다.  
* `$ git fetch [리모트 저장소의 별칭] [리모트 브랜치]`: 별칭에 해당되는 저장소에서 파일을 다운받아 동기화시킴. merge는 일어나지 않는다.  
* `$ git pull [리모트 저장소의 별칭] [리모트 브랜치]`: git fetch 명령어 실행 후, merge까지함.  
* `$ git branch`: branch에 대한 명령  
    - `-v` 옵션: Local branch의 정보를 마지막 commit 내역과 함께 보여줌.  
    - `-r` 옵션: 리모트 저장소의 branch 정보를 보여줌.  
    - `-a`: 로컬/리모트 저장소의 모든 branch 정보를 보여줌.  
* `$ git branch [NAME]`: 새로운 branch 생성.  
* `$ git branch -d [NAME]`: 병합이 완료된 branch 삭제  
* `$ git branch -D [NAME]`: 병합이 완료되지 않은 branch 삭제  
* `$ git checkout [NAME]`: branch 이주.  
* `$ git checkout -b [NAME]`: branch 생성과 동시에 이주.  
* `$ git merge [NAME]`: branch를 현재의 branch와 병합.  
* `$ git pull [별칭] [브랜치] --allow-unrelated-histories`: 병합할 때, 기본적으로 거부하는 것을 허용하게 해줌.  
    - fatal: refusing to merge unrelated histories 에러관련을 해결할 수 있다.  
* `$ git reset [돌아갈 commit]`: 커밋 목록으로 돌아감.  
    - 참고로 돌아갈 커밋은 github에서 볼 수 있다.  
* `$ git revert [commit 목록]`: 커밋 목록으로 돌아감.  
    - reset과 차이는 추후에 게시하겠음.  