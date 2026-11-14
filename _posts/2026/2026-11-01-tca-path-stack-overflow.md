---
title: "[Troubleshooting][Swift·TCA] TCA Reducer 'EXC_BAD_ACCESS', Path의 case 증가로 발생한 Stack Overflow 분석과 해결"
excerpt: "스택 한도를 넘긴 Reducer Path. 크래시 로그와 스택 요구량을 비교하고 case를 줄여 해결한 기록"

categories:
  - iOS
tags:
  - [Swift, iOS, TCA, Troubleshooting]

permalink: /ios/tca-path-stack-overflow/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb"

date: "2026-11-01 10:00:00"
last_modified_at: "2026-11-14 16:37:39"
published: true
---

# 1. 어떤 문제가 있었나

TCA로 개발하던 앱에서 빌드는 성공했는데, 실행하면 앱이 종료되는 문제가 생겼다.  
`onAppear` 액션을 처리하는 과정에서 `EXC_BAD_ACCESS`가 발생했고, iOS 18과 iOS 26 실기기에서 모두 재현됐다.  

약 1년 전에도 비슷한 문제가 있었고, case를 줄여 해결했던 문제였다.  
이번에도 같은 방식으로 접근했지만, 크래시 기록을 살펴보다 당시 이해했던 원인과는 다른 단서를 발견했다.  

화면 이동은 [TCA 공식 Stack-based navigation 문서](https://pointfreeco.github.io/swift-composable-architecture/1.8.0/documentation/composablearchitecture/stackbasednavigation)를 참고해 구현했다.  
여러 화면의 상태와 액션을 `Path`로 묶고 `.forEach`로 연결하는 구조로, `Path`에는 28개의 case가 있었다.   

아래는 이번에 크래시를 재현한 환경이다.   

| 항목 | 환경 |
| --- | --- |
| macOS | 26.2 (`25C56`) |
| Xcode | 26.2 (`17C52`) |
| Swift | 컴파일러 6.2.3, 앱 언어 모드 Swift 5 |
| 실기기·OS | iPhone 14 Pro Max, iOS 26.2.1 (`23C71`) |
| SDK·TCA | iPhoneOS 26.2 / TCA 1.26.2 |
| 빌드 설정 | 최적화 끔(`-Onone`), arm64 |

# 2. 어떤 시도를 했나

처음 이 문제를 겪은 것은 약 1년 전이었다. 당시 기억을 더듬어 보며 쓰겠다.  

회사에서 신규 피처를 개발하고 있었고, 피처를 개발하던 내 브랜치에서는 아무 문제(빌드 에러나 크래시 등)가 없음을 확인하며 개발했다.  
그런데 동료들의 코드가 있는 타깃 브랜치에 merge한 뒤부터 크래시가 발생했다.  
내가 추가한 코드가 원인인지 확인하려고 내 코드에 해당하는 부분들을 주석 처리해 봤다.  
그러자 앱이 정상 동작했다.~~(??)~~  
식은땀이 났다. 내가 잘못 짠 걸까? ~~(진짜 땀이 나더라...)~~   

주석을 처리하는 범위를 조금씩 좁혀 갔다.  
그러다 **`Path`의 case 하나만 제외해도 크래시가 사라진다는 것**을 확인했다.  
왜 case 하나를 뺐을 뿐인데 결과가 달라질까?  
그 이유를 찾으려고 검색하다가 TCA 공식 GitHub Discussion에서 비슷한 사례를 발견했다.  

당시에는 TCA 공식 문서와 관련 사례를 보면서, Scope를 일정 개수 이상 사용하면 안 되는 것으로 받아들였다.  
case를 줄이니 앱이 정상 동작했고, 그때는 “개수 제한에 걸렸구나”라고 생각하고 해결을 마무리했다.  

그리고 1년정도가 지난 지금. 또 비슷한 이슈가 발생했다.  
팀원이 심각하게 앱이 crash가 난다고 상황을 전했고, 가장 먼저 옛 이슈가 떠올라서 이 부분부터 의심을 했다. 그리고 내가 이 crash를 맡기로 했다.  

이번 정리에서 다시 확인한 유사 사례는 다음과 같다.  

- [TCA Discussion #3162](https://github.com/pointfreeco/swift-composable-architecture/discussions/3162)  
- [TCA Discussion #3219](https://github.com/pointfreeco/swift-composable-architecture/discussions/3219)  

이번에 같은 증상이 나타났을 때도 처음에는 예전과 같은 개수 제한 문제라고 생각했다.  
`Path`의 case를 하나씩 주석 처리해 보니, 개수를 줄이면 크래시가 사라지고 주석을 풀면 다시 발생했다.  
예전에 겪었던 문제와 같은 상황이라고 여겼다.  

**그런데 크래시 리포트를 살펴보다 스택 공간이 부족하다는 메시지를 발견했다.**  
관련 TCA Discussion을 찾아보니, 크래시가 발생하는 Scope 개수도 사람마다 달랐다. 내 경우에도 예전과 같지 않았다.  
이런 차이를 보니 단순히 Scope를 일정 개수 이상 사용해서 생기는 문제는 아닐 수 있겠다는 생각이 들었다.  

예전에는 일정에 쫓겨 case를 줄여 해결하는 데 그쳤지만, 개발하면서 여러 번 겪은 문제인 만큼 이번에는 근본 원인을 제대로 확인하고 싶었다.  
그래서 개수에 따라 결과가 달라지는 이유를 알아보기 위해, 실제로 필요한 스택 공간과 사용 가능한 메모리를 비교해 보기로 했다.  

# 3. 원인은 무엇이고, 어떻게 해결했나

이번 크래시 리포트에는 다음 내용이 남아 있었다.  
아래 코드에서 식별자는 가상의 `AppFlow`로 바꾸고, 주소와 일부 프레임은 생략했다.  

```text
Exception Type: EXC_BAD_ACCESS (SIGSEGV)
Exception Subtype: KERN_PROTECTION_FAILURE
Exception Message: Thread stack size exceeded

0  ___chkstk_darwin
1  static AppFlow.Path.body.getter
   ...
3  closure #1 in Reducer.forEach(...)
```  

처음에는 Swift 타입 추론 문제라고 생각했다.  
하지만 리포트에 남은 `Thread stack size exceeded`는 **실행 중 스택 공간이 부족해 발생한 스택 오버플로**를 가리켰다.  

(여기서 스택은 화면이 쌓이는 내비게이션 스택이 아니라, 함수 실행에 쓰는 메모리 공간이다. ~~ㅋㄷ~~)  
[Apple 공식 문서 — 스레드 스택 크기](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Multithreading/CreatingThreads/CreatingThreads.html)에서도 스레드를 생성할 때 일정 크기의 메모리를 스택으로 할당한다고 설명한다.  

콜스택은 `___chkstk_darwin`에서 `Path.body`, `Reducer.forEach`로 이어졌다.  
이를 단서로 `Path`의 reducer를 구성하는 `body`의 스택 요구량과 실행 중인 스레드의 스택 영역을 비교했다.  

함수의 요구량은 컴파일된 `Path.body`의 스택 공간 확보 명령을 기준으로 계산했고, 사용 가능한 영역은 실행 중 메모리 영역의 크기와 접근 권한으로 확인했다.  
스택 영역의 크기는 크래시 리포트의 `vmRegionInfo`에도 남아 있었다. 아래는 앱 경로 등 다른 항목을 제외한 실제 두 줄이다.  

```text
---> STACK GUARD  16adfc000-16ae00000 [   16K] ---/rwx SM=NUL  stack guard for thread 0
     Stack        16ae00000-16aefc000 [ 1008K] rw-/rwx SM=SHM  thread 0
```

`rw-`는 읽기·쓰기가 가능한 영역, `---`는 접근할 수 없는 보호 영역이다.  
스택 영역의 끝 주소에서 시작 주소를 빼면 크기를 직접 확인할 수 있다.  

```python
stack_bytes = 0x16aefc000 - 0x16ae00000
print(stack_bytes)         # 1032192
print(stack_bytes / 1024)  # 1008.0 KiB
```

이 계산으로 **크래시 당시 메인 스레드의 읽기·쓰기 가능한 스택 영역이 1,008KiB였음**을 확인할 수 있다.  
28개 case 구성의 분석 결과는 다음과 같다.  

| 비교 항목 | 확인된 크기 |
| --- | --- |
| 메인 스레드의 읽기·쓰기 가능한 스택 영역 | 1,032,192바이트 = **1,008KiB** |
| `Path.body` 하나의 고정 스택 프레임 | 1,331,152바이트 ≈ **1,300KiB** |

**함수 하나가 요구하는 공간부터 이미 사용 가능한 스택보다 컸다.**  
접근에 실패한 주소도 스택 바로 아래의 보호 영역인 `STACK GUARD` 안에 있었다.  
즉, case가 많다는 사실만으로 원인을 추정한 것이 아니라, 실제 스택 요구량과 메모리 경계를 비교해 초과를 확인한 것이다.  

TCA 유지보수자도 [관련 Discussion에서](https://github.com/pointfreeco/swift-composable-architecture/discussions/3162#discussioncomment-15476964) 큰 enum을 처리할 때 발생하는 Swift의 스택 오버플로 문제를 언급한다.   

해결은 **`Path`의 case를 줄여 한 번에 구성하는 reducer의 규모를 줄이는 방향**으로 진행했다.  
TCA의 Stack-based Navigation과 Tree-based Navigation을 적절히 잘 섞어서 리팩토링을 진행했다.  
case가 28 -> 23개로 줄었고, 이 구성에서는 `Path.body`의 고정 스택 프레임도 약 **831KiB**로 줄었다.  
핵심은 case 개수 자체보다, 그 구성으로 만들어지는 reducer가 실행 시 얼마나 많은 스택 공간을 요구하느냐였다.  

예전에는 case를 줄이면 해결된다는 사실만 기억했다면, 이번에는 그 뒤에 있던 스택 오버플로까지 이해할 수 있었다.  

이번 포스팅은 **TCA와 SwiftUI로 화면을 개발하면서 여러 번 겪었던 문제 기록과, Reducer의 path 개수 제한으로만 이해했던 내용을 바로잡아 기록해 두고 싶었다.**  
다음에 같은 증상을 만났을 때 다시 처음부터 헤매지 않도록 이 과정을 기록해 둔다.  
비슷한 문제를 겪는 사람에게도 원인을 찾는 단서가 되었으면 한다.  