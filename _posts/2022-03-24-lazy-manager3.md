---
title: "[Lazy Manager3] 스크립트형 키보드 마우스 제어 프로그램 제작"
excerpt: "사용자가 작성할 수 있는 스크립트 + 키맵핑 + 키보드 제어 + 마우스 제어 기능 탑재"

categories:
  - Automation Solution
tags:
  - [Automation Solution, C#]

permalink: /automation-solution/lazy-manager3/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-03-24 21:00:00
last_modified_at: 2022-04-30 21:30:00
published: true
---

## Info

`Program Version` : 0.3.0  
`Used Language` : C#  

아래는 참고할 링크 및 깃허브 주소  
> [Github Link](https://github.com/kdjun97/lazy-manager)  
> [Lazy Manager로 이동](https://kdjun97.github.io/automation-solution/lazy-manager/)  
> [Lazy Manager2로 이동](https://kdjun97.github.io/automation-solution/lazy-manager2/)  

---  
 
### Lazy Manager3

기대효과는 [Lazy Manager](https://kdjun97.github.io/automation-solution/lazy-manager/)에서 이미 언급하였다.  
나는 한 프로그램이 아닌, 어느 프로그램, 어느 환경에서도 쓰일 수 있는 프로그램을 제작하고 싶었다.  
[Lazy Manager](https://kdjun97.github.io/automation-solution/lazy-manager/), [Lazy Manager2](https://kdjun97.github.io/automation-solution/lazy-manager2/)는 둘 다 개발자가 짠대로 코드가 돌아가는 단점이 존재하였다.  
물론 기능은 구현이 되었지만, 이는 내가 원하는 바가 아니므로 프로젝트를 **다시** 파기로 결정했다.  
이전까지 만들었던 것을 바탕으로 사용자가 `직접` (최대한 간편하게) 스크립트를 짤 수 있는 형태로 프로그램을 만들 것이다.  
눈치챘겠지만, Lazy Manager뒤에 달리는 번호가 Ver0.x의 번호이다.  
`Ver0.5.0`정도 되면 충분히 쓸만한 기능이 많은 프로그램이 될 것이다.**(repeat 기능 추가와 조건문을 추가 및 mouse tracking 기능을 추가할 생각이다)**  
두 개 정도의 포스팅 후에는... 괜찮은 프로그램이 나올 것이라 예상한다.  
각 버전에 대한 history는 위 Github Link를 참고하길 바라며 Lazy Manager3 포스팅을 시작하겠다.  

---

#### TODO

**1.** 스크립트형 프로그램(사용자 정의 가능)  
  - base는 스크립트를 위한 메모장 클론 코딩
  - Script를 읽고 리스트로 관리 [예전에 만들었던 이 코드를 베이스로 사용할 것이다](https://github.com/kdjun97/cs-file-IO)
  - Script에 맞는 액션을 수행하는 코드 필요  
  - `Hooking(SetWindowsHookEx 함수 사용)`을 통해 키맵핑을 할 생각

**2.** 키보드 및 마우스 제어
  - WIN32 API 함수 `keybd_event`, `mouse_event` 사용 예정

---

#### load, save, new file 등의 메모장 기능들을 구현  

**1.** 메모장 클론 코딩  

우선, 사용자가 스크립트를 직접 짤 수 있어야 한다.  
때문에, 메모장의 기능이 필요하다.~~(그냥 내가 그렇게 정했다)~~  
우리가 익히 아는 `notepad.exe`와 비슷하게 winform을 구성한다.  
Winform 구성은 `MenuStrip`, `TextBox`, `StatusStrip`, `OpenFileDialog`, `SaveFileDialog`를 사용하였다.  
![UI](/assets/images/post_img/lazy-manager3/skeleton_ui.jpg)   

**2.** TextBox에 입력된 스크립트를 읽는 기능 필요  

TextBox에 있는 내용을 parsing을 하여 키코드, 명령어로 구분함.  
그 후, 모델 리스트에 넣어 리스트를 관리할 수 있어야 함.  
~~Parsing 코드를 짜면서 코딩테스트 문제를 푸는 느낌이 들었다~~  
이 부분에서 정제되지 않은 모델 리스트를 가지게 된다.  

![Model_List](/assets/images/post_img/lazy-manager3/read_script_complete.JPG)  

**3.** Hotkey 설정  

각 모델의 리스트에서 가지는 `h:` 뒤에 값(핫키 값)에 대해 key에 hook을 걸어줌.  
hook이 걸린 후, 설정된 핫키를 누르면 아래와 같이 detect가 가능하다.  

![Set Hotkey](/assets/images/post_img/lazy-manager3/set_hotkey.jpg)  

**4.** 각 Hotkey에 command list 설정  

하나의 모델은 h 시작부터 q가 나오기 까지를 하나의 모델로 가진다.  
핫키를 누르고난 후, q까지 명령어가 실행이 된다.  
이렇게 명령어를 실행하기 위해, 명령어 리스트를 가져야 한다.    

![Set Command](/assets/images/post_img/lazy-manager3/set_command.JPG)   

**5.** Command 처리  

**4번**에서 하나의 `hotkey`에 해당하는 `command list model`이 생겨났다.  
각 핫키에 command들이 맵핑된 상태.  
각 특수 명령`(k, m, s)`이 나오면 분기를 타도록 처리해주었다.  

```  
k: keybd_event  
m: mouse_event  
s: sleep(delay)  
q: quit(break 개념)  
```  

> 기본 기능은 끝남. 추후 r(loop 기능) if(조건문) i?(ImageSearch)기능 등을 구현할 예정  

---

#### keybd_event

WIN32 API 함수 중 `keybd_event`, `mouse_event`라는 함수가 있다.  
아주 간단히 소개하자면, `활성창에 키보드 혹은 마우스 이벤트를 날리는 함수`이다.  
이 함수를 이용하여 키보드와 마우스를 제어할 것이다.  

위의 5번 과정에서 특수명령`(k, m, s)`로 분기를 탄다고 했다.  
당연히, 특수명령이 `k`라면 `keybd_event`이고 `m`이면 `mouse_event`이다.  

`k` 분기를 탔을 때, 우리는 `K0D`와 같은 명령어를 처리해주어야 한다.  
명령어는 `K0D`, `D0D` 등으로 들어오기 때문에 event를 발생시키기 전에 약간의 정제가 필요하다.  
이미 0D라는 값을 `Dictionary<String, byte>` 형태로 정의해놨기 때문에, `K0D`나 `D0D`라는 명령어가 들어올 때, 앞의 `K,D,U 명령`만 구분해주면 된다.  
이 또한 `K,D,U 명령`에 따른 분기를 설정해주었다.  
아래는 `K,D,U 명령`에 대한 정보이다.  

```
K: Key Press
D: Key Down
U: Key Up
```

이제 이 프로그램을 사용하여 설정 키를 눌렀을 때 직접 정의한 키들을 입력해보겠다.  

![keybd_event](/assets/images/post_img/lazy-manager3/keybd_event.gif)  

💪 이러한 기능으로 사용자가 원하는 것들을 구현할 수 있다!  
{: .notice--success}  

#### Virtual-Key Code

어떤 느낌인지는 알겠으나, `key code`에 대해 모를 수 있다.  
스크립트 작성에 도움을 주기 위해 Virtual-Key Code UI를 만들었다!  
이것을 보며 작성하면 된다.  
![virtual_key_code](/assets/images/post_img/lazy-manager3/virtual_key_code.JPG)  

추후, 이 키코드를 보지 않게 아래와 같이 실제 키를 dictionary에 넣을 생각이다  

```
기존 명령어 형식
k:K48,K45,K4C,K4C,K4F
바꿀 명령어 형식
k:K(h),K(e),K(l),K(l),K(o) 이런식으로 더 쉽게?.. 생각중
```

#### mouse_event

위에서 `mouse_event`에 대한 간단한 설명은 하였기에 바로 본론으로 들어가겠다.  

`mouse_event`는 특수명령 `m`의 분기를 타서 이벤트를 실행하고 `MV, LC, RC 명령`이 존재한다.  
아래는 `MV, LC, RC 명령`에 대한 정보이다.  

```
MV: Mouse Move
LC: Left Click
RC: Right Click
```

`mouse_event`는 `keybd_event`보다 스크립트 작성이 훨씬 쉽다.  
ex) MV(100,100),LC -> 100,100 좌표에서 Left Click을 수행.  

영상을 보는 편이 이해가 더 빠를 것이다.  
![mouse_event](/assets/images/post_img/lazy-manager3/mouse_event.gif)  

이 두 기능을 잘 활용하는 것 만으로도 꽤 많은 것을 할 수 있을 것이다.  

이 프로젝트는 지속적으로 버전업을 하며 위에서 언급한 `0.5.0 Version` 정도가 된다면 제대로 포스팅을 하도록 하겠다.  

---  

### 시행착오

`첫번째`  

`s` command 처리 중, delay관련 처리를 할 때, error가 났다.  
F1을 핫키로 설정했다면, 기존에는 s 명령어가 `Thread.Sleep(2000)`의 방식으로 처리 되었다.  
후킹도 잘 되었고, F1을 누를 때, 명령어 수행도 잘 되었지만, F1키가 block되지 않았다.  
그 이유는 Thread.Sleep 자체가 현재 스레드를 멈추는 것이라서 후킹 관련 액션도 2초간 멈추었기 때문이라고 판단하였다.  
그래서 `s`명령어 처리를 `Task.Delay(int millisecond)`로 비동기식 처리를 하였다.  
이 명령어는 task를 지연시켜주는 명령어이기 때문에 s명령어 처리와 더욱 적합했고, 테스트 결과 키가 block(잠기는)되는 것을 확인할 수 있었다.  

`두번째`  

mouse_event는 좌표값의 설정이 중요한데, 화면 해상도의 배율에 따라 좌표값이 달라지는 현상이 발견되었다.  
모든 user들의 해상도나 배율이 다를것이기 때문에 해상도 값을 처리할 방법을 생각중이다.  
다행히, stackoverflow에 display resolution에 관한 글이 있었고, 이를 참고하여 화면 해상도 배율을 곱하며 본래 해상도를 구할 수 있었다.  

> [출처 : StackOverflow](https://stackoverflow.com/questions/5082610/get-and-set-screen-resolution)  