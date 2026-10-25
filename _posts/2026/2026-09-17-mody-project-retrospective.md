---
title: "[회고] CMC 19기 iOS 파트 회고"
excerpt: "CMC에서 MODY를 개발한 세 달을 돌아보며"

categories:
  - Etc
tags:
  - [iOS, MicroFeature Architecture, UIKit, SwiftUI, ReactorKit, TCA, Tuist, CI/CD]

permalink: /ios/mody-project-retrospective/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb"

date: 2026-09-17 10:00:00
last_modified_at: 2026-10-25 22:28:39
published: true
---

# 📱 또 동아리를 한다고?

이번에 [CMC](https://cmc.makeus.in/)라는 동아리에 참여했다.  
2026년 5월부터 8월까지 약 3개월 동안 활동하며 [모디(MODY)](https://github.com/Central-MakeUs/mody-ios)라는 앱을 출시했다.  

[모디(MODY)](https://github.com/Central-MakeUs/mody-ios)는 친구들과 식사와 운동을 기록하고 공유하며 다이어트 습관을 만들어 가는 서비스다.  

나는 2024년에 Prography라는 동아리에서 [과수원](https://github.com/prography-team8/gwasuwon-ios) 앱을 만들었다.  
이후에는 회사 동료들과 [오목완](https://github.com/begin-a-gain/omokwan-ios)을 만들고, 친구와 Flutter 기반의 [달릴까말까](https://github.com/APPisode-Dev/run-or-not)를 개발하며 사이드 프로젝트를 꾸준히 이어갔다.  

> [모디(MODY) Github](https://github.com/Central-MakeUs/mody-ios)  
> [오목완 Github](https://github.com/begin-a-gain/omokwan-ios)  
> [달릴까말까 Github](https://github.com/APPisode-Dev/run-or-not)   
> [과수원 Github](https://github.com/prography-team8/gwasuwon-ios)  

함께하는 사람과 환경이 달라질 때마다 배우는 점도 달랐다.  
**이번에는 실무를 하며 고민했던 개발 방식을 직접 적용해 보고 싶었다.**  
기능 하나를 독립적으로 개발하고, 여러 상황의 화면을 확인하고, 개발 중인 결과물을 팀원에게 자주 전달하는 흐름을 만들어 보고 싶었다.  

CMC는 기획자, 디자이너, 개발자가 팀을 이뤄 짧은 기간 안에 하나의 서비스를 만들어 출시하는 동아리다.  
**내가 고민한 구조를 실제 기능 개발과 협업에 적용해 볼 수 있겠다고 생각해 지원했다.**  

# 🎯 실무에서 하던 고민을 가져오다

회사 업무와 사이드 프로젝트에서 앱을 개발하면서, **기능이 늘어날수록 함께 신경 써야 하는 코드와 의존성도 많아지는 것을 느꼈다.**  
**한 기능을 수정하거나 확인하려고 해도 다른 기능의 구현과 실행 흐름까지 살펴봐야 했다.**  

화면을 확인하는 과정에도 아쉬움이 있었다.  
**특정 데이터나 상황에서 UI가 어떻게 보이는지 직접 확인하고 싶었고, 개발 중인 화면을 기획자와 디자이너에게 더 일찍 보여주고 싶었다.**  

이런 고민을 하면서 Toss의 [레고처럼 조립하는 토스 앱](https://toss.tech/article/slash23-iOS)을 여러 번 읽었다.  
글에서 소개한 **MicroFeature Architecture**는 내가 생각하던 개발 방식을 구체적인 구조로 보여줬다.  

기능의 구현과 외부에 공개할 인터페이스를 분리하고, 테스트를 지원하는 코드와 기능을 따로 실행할 Demo 앱까지 함께 하나의 모듈로 구성하는 방식이 내가 가지고 있는 고민의 갈증을 해소해 줄 것이라 기대했다.  

특히 테스트 코드가 들어가는 `Tests`와 Mock이나 샘플 데이터를 제공하는 `Testing`을 나눈 구조가 흥미로웠다.  
원하는 상황을 준비하고 기능을 확인하는 과정도 설계의 일부로 다룰 수 있겠다고 생각했다.  

이번 프로젝트에서는 더 큰 규모의 앱과 여러 직군이 협업하는 환경을 염두에 두고 이 구조를 적용해 보고 싶었다.  
기능을 나누는 설계부터 독립적인 실행과 검증, 결과물 공유까지 직접 연결해 보는 것이 목표였다.  

# 🧩 먼저 실험하고, MODY에 적용하기

MODY에 적용하기 전에는 [micro-feature-study](https://github.com/kdjun97/micro-feature-study)라는 별도 프로젝트에서 구조를 먼저 검증했다.  

Tuist로 모듈과 의존성을 구성하고, Demo 앱에서 여러 상태를 바꿔 가며 화면을 확인해 봤다.  
GitHub Actions와 Fastlane으로 빌드와 배포를 자동화해, 기능별 Demo 앱을 전달하는 흐름까지 미리 구성했다.  

> [MicroFeature Architecture Study Project Github](https://github.com/kdjun97/micro-feature-study)  
> [Toss MicroFeature Architecture (TMA)](https://toss.tech/article/slash23-iOS)  

이렇게 확인한 구조를 바탕으로 MODY의 기능 개발을 시작했다.  

우리 팀은 PM, 디자이너, Android 개발자, iOS 개발자, 서버 개발자까지 총 5명이었다. iOS 개발자는 나 혼자였고, 앱의 설계와 구현, 배포를 맡았다. 기획과 디자인을 논의하고 서버 개발자와 API를 맞춰 가는 과정에도 함께했다.  

**UIKit·ReactorKit과 SwiftUI·TCA**를 함께 사용한 것도 이번에 시도한 부분이다. `UIKit 기반 앱에 SwiftUI를 점진적으로 도입하는 상황을 가정`하고, 서로 다른 방식으로 만든 기능을 하나의 앱으로 연결해 봤다.  

동아리 활동은 약 3개월이었지만 실제 앱 개발 기간은 6주 남짓이었다.  
회사를 다니면서 진행하기에는 빠듯한 일정이었다.  
미리 구조를 구성해 둔 덕분에 기능을 추가하거나 수정할 때 빠르게 대응할 수 있었다.  

# 🚚 개발 중인 화면을 팀원에게 전달하기

이번 프로젝트에서 해보고 싶었던 또 하나는 **개발 중인 결과물을 팀원이 직접 실행해 보며 이야기하는 것**이었다.  

기획이나 디자인에 관해 계속 소통하더라도, 실제 기기에서 앱을 사용해 보면 그때야 발견되는 차이가 있었다.  
전체 앱이 완성되기 전에도 작은 기능부터 전달하고 의견을 받고 싶었다.  

그래서 **기능별 Demo 앱과 DesignSystem Demo 앱을 만들고 Firebase App Distribution으로 배포**했다.  
Dev·Prod 앱은 TestFlight로 전달하고, GitHub Actions와 Fastlane으로 각 배포 과정을 자동화했다.  

Demo 앱을 MODY에 적용하고 팀원들과 활용한 경험은 [Demo 앱으로 기능별 시나리오 검증하기 - (2)](https://kdjun97.github.io/ios/demo-app-part2/)에 정리했다.  
Demo 앱에는 왜 Firebase App Distribution을 선택했고 Dev·Prod 앱에는 왜 TestFlight를 사용했는지, 각 배포 흐름을 어떻게 구성했는지는 **CI/CD 글에서 따로 정리하려 한다.**  

기획자와 디자이너는 Demo 앱을 설치해 개발 중인 화면을 직접 확인할 수 있었다.  
팀원들도 진행 상황과 구현된 결과물을 확인할 수 있어 협업하기 수월했다는 의견을 주었다.  

아키텍처를 선택할 때 생각했던 독립적인 실행이 실제 협업으로 이어지는 지점이었다.  
**실무에서 필요성을 느꼈던 방식을 이번 프로젝트에서 직접 적용해 볼 수 있었다.**  

> [Demo 앱으로 기능별 시나리오 검증하기 - (2)](https://kdjun97.github.io/ios/demo-app-part2/)  

# 🏆 프로젝트를 마치며

MODY는 출시를 마쳤고, CMC에서 **대상·1위**를 받았다. PM, 디자이너, 각 플랫폼과 서버 개발자가 함께 만든 서비스로 얻은 결과다.  

개인적으로는 **오래 고민했던 개발 방식을 실험 프로젝트에서 확인하고, 실제 서비스의 기능 개발과 협업까지 이어가 봤다는 점**이 남는다.  
모듈을 나누는 설계부터 원하는 상태를 준비하는 코드, 실행 가능한 Demo 앱, 팀원에게 전달하는 배포 과정까지 직접 연결해 볼 수 있었다.  

실무에서 들었던 궁금증을 직접 구현하며 풀어봤고, 설계한 방향대로 앱을 완성했다.  
이 경험을 통해 **더 큰 규모의 프로젝트에서도 기능의 경계를 설계하고, 개발과 검증에 필요한 환경을 구성해 나갈 수 있다는 자신감을 얻었다.**  

구체적인 설계와 구현 과정은 주제별 글로 나눠 정리하고 있다.  

- **MicroFeature Architecture와 Tuist** — 기능을 독립적으로 개발하기 위해 선택한 구조와 사전 실험
- **Testing과 Tests** — 두 타깃을 나눈 구조에 관심을 가진 이유와 여러 상태를 준비해 본 경험
- **[Demo 앱 — 개발 중인 화면과 시나리오를 팀원에게 공유한 과정](https://kdjun97.github.io/ios/demo-app-part2/)**
- **GitHub Actions와 Fastlane** — Demo·Dev·Prod 앱의 빌드와 배포를 자동화한 과정
