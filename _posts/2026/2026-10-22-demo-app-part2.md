---
title: "[iOS] Demo 앱으로 기능별 시나리오 검증하기 - (2)"
excerpt: "Demo 기능을 프로덕트에 적용해본 경험"

categories:
  - iOS
tags:
  - [iOS, Tuist, CI/CD, MicroFeature Architecture]

permalink: /ios/demo-app-part2/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb"

date: 2026-10-22 10:00:00
last_modified_at: 2026-10-22 10:00:00
published: true
---

# 📲 실험한 Demo를 팀원들도 사용하게 만들기

> [이전 글: [iOS] Demo 앱으로 기능별 시나리오 검증하기 - (1)](https://kdjun97.github.io/ios/demo-app-part1/)   
> [MODY iOS GitHub](https://github.com/Central-MakeUs/mody-ios)  

MODY를 시작하기 전, [MicroFeature Study](https://github.com/kdjun97/micro-feature-study)에서 기능 하나를 Demo 앱으로 실행하고 화면의 여러 상태를 확인해 봤다.  
1편에서는 이 방식을 MicroFeature 구조와 함께 검증한 과정을 정리했다.  

이번에는 그 구성을 실제 MODY에 적용해 봤다.  

**개발 중인 화면을 기획자와 디자이너가 직접 사용하게 하면, 더 일찍 의견을 주고받을 수 있을까?**  

그동안 기대했던 협업 방식이 실제로 도움이 되는지, 동료들과 함께 확인해 볼 기회였다.  
이를 위해 내 기기에서 실행하던 Demo 앱을 팀원들도 자신의 기기에 설치하고 사용할 수 있도록 전달해야 했다.  

# 🧩 기능과 공통 컴포넌트를 따로 확인하기

MODY에는 기능별 Demo 앱을 적용했다.  
전체 앱이 완성되기 전에 개발 중인 기능을 따로 실행해서 여러 시나리오를 미리 보고, 확인이 필요한 화면을 팀원에게 전달하기 위해서였다.  

챌린지 기능을 확인하는 `ChallengeDemo`에서는 **시나리오를 선택해 화면의 상태를 바꿔 볼 수 있도록 했다.**  
걸음 수와 순위가 달라지는 화면이나 오류 상황 등을 준비해, 확인하려는 상태로 전환할 수 있게 했다.  

<a href="https://kdjun97.github.io/assets/images/post_img/ios/demo-app-part2/challenge-demo-scenarios.gif" target="_blank" rel="noopener noreferrer">
  <img src="/assets/images/post_img/ios/demo-app-part2/challenge-demo-scenarios.gif" alt="Challenge Demo 시나리오 전환" style="width: 200px; max-width: 80%; height: auto;">
</a>  

기능 모듈뿐만 아니라 **DesignSystem에도 별도의 Demo 앱**을 만들었다.  

Figma에서 확인한 디자인도 <u>실제 기기에서 보면 글자 크기나 간격의 인상이 달라질 수 있다.</u>  
버튼을 누르거나 텍스트를 입력했을 때의 동작까지 직접 확인하며 디자이너와 이야기하고 싶었다.  

DesignSystemDemo에는 Typography, Color System, TextField, Button, NavigationBar 등을 모았다.  
특정 기능 화면으로 이동하지 않아도 공통 UI를 하나씩 살펴보고 조작할 수 있도록 했다.  

<a href="https://kdjun97.github.io/assets/images/post_img/ios/demo-app-part2/design-system-demo.gif" target="_blank" rel="noopener noreferrer">
  <img src="/assets/images/post_img/ios/demo-app-part2/design-system-demo.gif" alt="DesignSystem Demo 공통 UI 확인" style="width: 200px; max-width: 80%; height: auto;">
</a>  

기능별 Demo가 개발 중인 기능과 시나리오를 보여줬다면, DesignSystem Demo는 `여러 화면에서 함께 사용하는 UI를 확인`하는 데 활용했다.  

# 🚚 팀원의 기기까지 전달하기

Demo 앱이 있어도 개발자의 로컬에서만 실행할 수 있다면, 처음 고민했던 전달 문제는 남아 있게 된다.  
작은 기능을 만들 때마다 공유하려면 팀원이 설치할 수 있는 결과물을 반복해서 전달할 수 있어야 했다.  

GitHub Actions와 Fastlane으로 Demo 앱의 빌드와 배포를 자동화하고, Firebase App Distribution으로 전달했다.  
Slack에는 Webhook으로 배포 대상과 버전 등 확인에 필요한 정보를 함께 알렸다.  

이렇게 팀원이 **배포 소식을 확인하고, 자신의 기기에 Demo 앱을 설치해 볼 수 있는 흐름**을 만들었다.  

Dev·Prod·Demo를 왜 나눴고 어떻게 적용했는지, Demo 배포에 왜 Firebase App Distribution을 선택했는지는 별도의 CI/CD 글에서 자세히 이어가려 한다.  
빌드·서명·배포 설정도 그 글에서 함께 다룰 예정이다.  

# 💬 실제 화면을 기준으로 피드백 주고받기

MODY에서는 기획자, 디자이너뿐만 아니라 서버, Android 개발자도 Demo 앱을 설치해 개발 중인 화면을 직접 확인했다.  

팀원들은 **개발 진행 상황을 빠르게 볼 수 있고, 직접 실행한 화면을 기준으로 이야기할 수 있어 협업하기 좋았다**는 피드백을 줬다.  

프로젝트에서는 확인이 필요한 순간에 Demo 앱을 배포했다.  
별도 지표로 집계한 것은 아니지만, 당시 경험상 한 번 배포하는 데 보통 5~15분 정도가 걸렸다.  
빠르면 배포 후 5분 안에 피드백이 왔고, 대부분은 24시간 안에 받을 수 있었다.  

개발 중인 결과물을 공유하니, 진행 상황을 알리는 것과 구현 방향을 확인하는 일을 함께 할 수 있었다.  
개발을 모두 마친 뒤에야 서로 이해한 의도가 달랐다는 것을 **발견하는 상황을 줄이는 데**도 도움이 됐다.  

처음 품었던 의문에 대해서는, 적어도 MODY에서 함께 일한 경험을 통해 **긍정적인 답을 얻을 수 있었다.**  
작은 기능이라도 직접 사용해 볼 수 있게 전달하는 것이, 더 일찍 의견을 주고받는 데 도움이 됐다.  

# 🤔 앱 구현 이후의 과정도 개발이었다

이 고민은 회사에서 <u>핸드폰 두 대에 각각 시안을 띄우고 디자이너를 찾아가던 경험에서 시작됐다.</u>  
실제 화면을 함께 보며 이야기하는 방식은 좋았지만, 그 결과물을 더 쉽게, 자주 전달하고 싶었다.  

그래서 [별도 프로젝트](https://github.com/kdjun97/micro-feature-study)에서 기능별 Demo 앱과 시나리오 전환을 실험했고, MODY에서는 팀원에게 배포해 함께 사용하는 데까지 이어졌다.  
`혼자 가능성을 확인했던 구성이 실제 협업에서도 도움이 된다는 반응을 얻은 점이 의미 있었다.`  

**연차가 쌓이면서 화면과 기능을 구현하는 것뿐 아니라, 함께 일하는 사람들이 결과물을 어떻게 전달받을지도 생각하게 됐다.**  
이번에는 그 고민을 실제 프로젝트에 적용해 볼 수 있었다.  
더 큰 프로젝트에서도 개발과 검증에 필요한 환경을 직접 구성해 볼 자신감을 얻었다.  