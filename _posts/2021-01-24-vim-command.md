---
title: "Vim 명령어"
excerpt: "Vim 명령어에 대해 알아보자"

categories:
  - Linux
tags:
  - [Vim]

permalink: /linux/vim-command/

toc: true
toc_sticky: true
 
date: 2021-01-24 17:00:00
last_modified_at: 2021-01-24 17:00:00
published: true
---

### vim 명령어 정리

**실행모드에서**  

|    단축키   |             설명             |
| :---------: | :-------------------------: |
|:            | 명령모드 -> 실행모드 변경    |
|:w           | 파일 저장                    |      
|:wq          | 저장 후 나가기               |

**명령모드**  

|       단축키       |            설명           |
| :----------------: | :-----------------------: |
| esc                | 실행/입력모드 -> 명령모드 |
| I                  | 맨 앞 커서 + 입력모드  |
| A                  | 맨 뒤 커서 + 입력모드  |
| $                  | 맨 뒤 커서만  |
| ^                  | 맨 앞 커서만 |
| e                  | 단어 끝점으로 |
| b                  | 단어 시작점으로 |
| dw                 | 단어 삭제(현재커서부터 끝까지) |
| bdw                | 한 단어 삭제 |
| u                  | 실행 취소 |
| ctrl + r           | 실행 취소 Redo |
| num + gg           | num번째 line으로 이동. |
| dd                 | 한 줄 지우기 |
| num + dd           | 여러 줄 지우기 |
| yy                 | 한 줄 copy |
| num + yy           | 여러 줄 copy |
| p                  | 복사 paste |
| ctrl + f           | 화면 아래로 넘기기 |
| ctrl + b           | 화면 위로 넘기기 |
| / + 검색어 + enter | 검색어 찾기 |
| n                  | (검색 상태에서) 다음 이동 |
| N                  | (검색 상태에서) 이전 이동 |
| ctrl + v           | 다중 line 선택 |
| shift + i          | (다중 line 선택시)입력모드 변경 |