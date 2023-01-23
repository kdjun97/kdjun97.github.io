---
title: "Virtual-Key Code"
excerpt: "WIN32 API에서 사용하는 가상 키코드를 알아보자"

categories:
  - Etc
tags:
  - [WIN32 API]

permalink: /etc/virtual-key-code/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-04-17 22:00:00
last_modified_at: 2022-04-17 22:00:00
published: true
---
 
# 🍒 Virtual Key Code

WIN32 programming을 위한 `virtual key code`  
표의 값들은 16진수 값이다.  
우리가 주로 쓰는 키보드의 값들만 정리해보았다.  

> [출처](https://docs.microsoft.com/ko-kr/windows/win32/inputdev/virtual-key-codes)  

Key  |  Value | Description
--------------|-------------------------
`backspace`   | 0x08 | 백스페이스
`Tab`         | 0x09 | 탭
`Enter`       | 0x0D | 엔터  
`Alt`         | 0x12 | Alt키
`Caps Lock`   | 0x14 | Caps Lock(대소문자)
`한/영`       | 0x15 | 한/영키
`ESC`         | 0x1B | Escape(ESC)
`space`       | 0x20 | 스페이스바
`Page Up`     | 0x21 | Page Up키
`Page Down`   | 0x22 | Page Down키
`End`         | 0x23 | End키
`Home`        | 0x24 | Home키
`Left`        | 0x25 | 왼쪽 방향키
`Up`          | 0x26 | 위쪽 방향키
`Right`       | 0x27 | 오른쪽 방향키
`Down`        | 0x28 | 아래 방향키
`Print Screen`| 0x2C | Print Screen
`Insert`      | 0x2D | Insert키
`Delete`      | 0x2E | Delete키
`0`           | 0x30 | 숫자 0
`1`           | 0x31 | 숫자 1
`2`           | 0x32 | 숫자 2
`3`           | 0x33 | 숫자 3
`4`           | 0x34 | 숫자 4
`5`           | 0x35 | 숫자 5
`6`           | 0x36 | 숫자 6
`7`           | 0x37 | 숫자 7
`8`           | 0x38 | 숫자 8
`9`           | 0x39 | 숫자 9
`a or A`      | 0x41 | A
`b or B`      | 0x42 | B
`c or C`      | 0x43 | C
`d or D`      | 0x44 | D
`e or E`      | 0x45 | E
`f or F`      | 0x46 | F
`g or G`      | 0x47 | G
`h or H`      | 0x48 | H
`i or I`      | 0x49 | I
`j or J`      | 0x4A | J
`k or K`      | 0x4B | K
`l or L`      | 0x4C | L
`m or M`      | 0x4D | M
`n or N`      | 0x4E | N
`o or O`      | 0x4F | O
`p or P`      | 0x50 | P
`q or Q`      | 0x51 | Q
`r or R`      | 0x52 | R
`s or S`      | 0x53 | S
`t or T`      | 0x54 | T
`u or U`      | 0x55 | U
`v or V`      | 0x56 | V
`w or W`      | 0x57 | W
`x or X`      | 0x58 | X
`y or Y`      | 0x59 | Y
`z or Z`      | 0x5A | Z
`Windows`     | 0x5B | 윈도우키
`NumPad 0`    | 0x60 | NumPad 0
`NumPad 1`    | 0x61 | NumPad 1
`NumPad 2`    | 0x62 | NumPad 2
`NumPad 3`    | 0x63 | NumPad 3
`NumPad 4`    | 0x64 | NumPad 4
`NumPad 5`    | 0x65 | NumPad 5
`NumPad 6`    | 0x66 | NumPad 6
`NumPad 7`    | 0x67 | NumPad 7
`NumPad 8`    | 0x68 | NumPad 8
`NumPad 9`    | 0x69 | NumPad 9
`NumPad *`    | 0x6A | NumPad *
`NumPad +`    | 0x6B | NumPad +
`NumPad -`    | 0x6D | NumPad -
`NumPad .`    | 0x6E | NumPad .
`NumPad /`    | 0x6F | NumPad /
`F1`          | 0x70 | F1
`F2`          | 0x71 | F2
`F3`          | 0x72 | F3
`F4`          | 0x73 | F4
`F5`          | 0x74 | F5
`F6`          | 0x75 | F6
`F7`          | 0x76 | F7
`F8`          | 0x77 | F8
`F9`          | 0x78 | F9
`F10`         | 0x79 | F10
`F11`         | 0x7A | F11
`F12`         | 0x7B | F12
`Num Lock`    | 0x90 | Num Lock
`Scroll Lock` | 0x91 | Scroll Lock
`LShift`      | 0xA0 | 왼쪽 Shift
`RShift`      | 0xA1 | 오른쪽 Shift
`LCtrl`       | 0xA2 | 왼쪽 Ctrl
`RCtrl`       | 0xA3 | 오른쪽 Ctrl
`;`           | 0xBA | 세미콜론
`=`           | 0xBB | =
`,`           | 0xBC | 쉼표
`-`           | 0xBD | -
`.`           | 0xBE | 마침표
`/`           | 0xBF | / (주로 슬래시라 부르는 키)
`~`           | 0xC0 | 왼쪽 위 물결표
`[`           | 0xDB | [ 키
`\`           | 0xDC | \ 주로 백슬래시라 불리는 키
`]`           | 0xDD | ] 키
`'`           | 0xDE | 작은 따옴표 키