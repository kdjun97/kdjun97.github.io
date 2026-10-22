---
title: "[iOS] 기능 하나만 바로 보여줄 순 없을까? - (1)"
excerpt: "MicroFeature와 함께 Demo 앱을 구성하며 기능 실행과 화면 상태 검증을 실험한 과정"

categories:
  - iOS
tags:
  - [iOS, Tuist, MicroFeature Architecture]

permalink: /ios/demo-app-part1/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb"

date: 2026-07-13 10:00:00
last_modified_at: 2026-07-13 10:00:00
published: true
---

# 📱 핸드폰 두 개를 들고 찾아가던 이유

회사에서 A 시안과 B 시안 중 어떤 방향이 나은지 확인해야 할 때가 있었다.  
각 시안을 구현한 화면을 핸드폰 두 대에 하나씩 띄우고, 두 핸드폰을 들고 디자이너분을 찾아가 비교해서 보여드렸다.  
말로 차이를 설명하는 것보다 **실제 화면을 함께 보며 이야기하는 편이 훨씬 빠르게 결론을 낼 수 있었기 때문**이다.  

그런데 만약 디자이너가 아주 멀리 있다면 어떨까? 화면을 확인할 때마다 핸드폰을 들고 매번 오고 가야 할까?  
**나는 실제 기기에서 실행되는 결과물을 더 쉽게 전달할 방법이 필요했다.**  

회사와 동아리 프로젝트에서는 개발하는 동안 Figma에 댓글을 남기고, 궁금한 점을 물어보며 계속 소통했다.  
다만 실제 기기에 설치해 볼 수 있는 결과물은 일정 기간 개발한 뒤, 주로 마감 시점에 전달하곤 했다.  

**글과 정적인 화면을 보며 이야기했어도, 앱을 직접 사용해 보면 그때야 드러나는 차이가 있었다.**  
기획이나 디자인의 의도와 내가 이해한 방향이 달랐던 부분도 `실제 결과물을 공유하는 시점`에 발견되곤 했다.  

뒤늦게 발견한 부분을 다시 고치다 보면 일정이 넘어가거나, 당장 반영하지 못하고 추후 개선 작업으로 미뤄지기도 했다.  

**전체 앱이 완성되기 전에, 개발 중인 작은 기능부터 직접 사용해 보게 할 수 없을까?**  

실제 화면을 함께 보며 이야기했을 때의 장점을, 직접 찾아가지 않아도 이어가고 싶었다.  
이 고민이 <u>기능별 Demo 앱을 만들어 팀원들에게 전달해 보는 계기가 됐다.</u>  

# 🧪 확인하고 싶었던 것

필요한 기능만 작은 앱으로 실행하는 방식은 `Toss의 레고처럼 조립하는 토스 앱`을 보며 구체화했다.  
다만 글에서 본 구성이 내가 원하던 개발 방식에도 맞는지는 직접 만들어 봐야 알 수 있었다.  

궁금한 것은 두 가지였다.  
**전체 앱을 거치지 않고 기능 하나만 실행할 수 있을까? 그리고 그 화면을 원하는 상태로 바꿔 가며 확인할 수 있을까?**  

이 갈증을 해소시키기 위해 `micro-feature-study`라는 별도 프로젝트를 만들었다.  
Tuist로 MicroFeature 구조를 구성하고, Demo 앱에서 기능과 화면 상태를 확인해 봤다.  
이 글은 그 사전 실험에 대한 이야기다.  
이후 실제 프로덕트에 적용해 팀원들과 사용한 경험은 2편에서 이어간다.  

> [MicroFeature Architecture Study Project GitHub](https://github.com/kdjun97/micro-feature-study)  
> [레고처럼 조립하는 토스 앱](https://toss.tech/article/slash23-iOS)  

# 🧩 Demo 앱을 포함한 모듈 구조

**Demo 앱을 만들기 위해 반드시 TMA(Toss MicroFeature Architecture)를 적용해야 하는 것은 아니다.**  
Tuist에서 앱 타깃을 추가하고 필요한 기능 모듈을 연결해 구성할 수 있다.  
나는 모듈 단위로 테스트, 기능 구현, 데모 앱까지 한꺼번에 분리와 화면 상태를 준비하는 방법도 고민하고 있었기 때문에 `MicroFeature Architecture` 방식으로 설계해서 함께 검증했다.  

아래는 기존 구성에서 **기능 구현 타깃과 Demo 앱 타깃의 관계만 추린 예시**다.  
인터페이스·Testing·Tests 타깃과 세부 설정은 생략하고, 식별자는 일반화했다.  

```swift
import ProjectDescription

func makeFeatureTargets(name: String, hasDemo: Bool) -> [Target] {
    var targets: [Target] = [
        .target(
            name: name,
            destinations: .iOS,
            product: .staticLibrary,
            bundleId: "com.example.\(name.lowercased())"
        )
    ]

    if hasDemo {
        targets.append(
            .target(
                name: "\(name)Demo",
                destinations: .iOS,
                product: .app,
                bundleId: "com.example.demo.\(name.lowercased())",
                sources: ["Demo/Sources/**"],
                dependencies: [.target(name: name)]
            )
        )
    }

    return targets
}
```  

`hasDemo`가 `true`이면 기능 타깃과 함께 `product: .app`인 Demo 타깃을 만든다.  
`dependencies`에 기능 타깃을 연결해 Demo 앱에서 해당 기능을 사용할 수 있게 했다.  

실제로 실행하려면 기능의 소스·리소스 설정과 Demo 앱의 진입점도 필요하다.  
진입점에서는 확인할 화면을 띄우고, 그 화면에 필요한 의존성과 데이터를 준비한다.  
위 코드는 이 관계를 보여주기 위한 축약 예시다.  

이렇게 기능을 별도 앱으로 실행할 수 있게 구성했다.  
다음으로 확인하고 싶었던 것은 **같은 화면에 서로 다른 조건을 넣었을 때의 모습**이었다.  
Demo앱은 실제 구현보단 개발, 검증할 때 필요한 기능이기 때문에, 여러 케이스들을 다 다룰 수 있는 모습이 필요했다.  

# 🔎 화면을 띄우는 것에서, 원하는 상태를 확인하는 것으로

화면 하나를 실행해도 기본 데이터만 보인다면 확인할 수 있는 범위가 좁다.  
이름이 길어지는 경우나 어떤 동작이 실패하는 경우도 직접 살펴보고 싶었다.  

실험 프로젝트의 MyPage에는 확인할 상태를 미리 준비했다.  
예를 들어 신규 사용자는 기록 수가 0인 상태로, 긴 이름은 긴 문자열이 들어간 상태로, 로그아웃 실패는 결과가 실패로 돌아오는 상태로 구성했다.  

이 데이터와 동작은 `MyPageTesting`에 두고 Demo에서 연결했다.  
Demo 화면에서는 기기를 흔들어 상태를 바꾸는 패널을 열 수 있게 했다. (진입점이 필요하기 때문에 만들어주었음.)  
선택한 상태에 맞춰 MyPage 화면을 다시 구성하고, 로그아웃 실패 시의 안내도 확인할 수 있도록 했다.  

<a href="https://kdjun97.github.io/assets/images/post_img/ios/demo-app-part1/mypage-demo-scenarios.gif" target="_blank" rel="noopener noreferrer">
  <img src="/assets/images/post_img/ios/demo-app-part1/mypage-demo-scenarios.gif" alt="MyPage Demo 시나리오 전환" style="width: 400px; max-width: 80%; height: auto;">
</a>  

여기서 궁금했던 두 가지를 확인할 수 있었다.  

**1.** 기능을 별도 앱으로 실행할 수 있었고  
**2.** 필요한 데이터를 준비하면 같은 화면의 여러 상태도 바꿔 가며 살펴볼 수 있었다.  

`내가 필요했던 기능을 코드로 개발해보고 눈으로 검증까지 할 수 있는 경험이었다.`  

# 🚀 실험한 방식을 실제 프로젝트로..

처음의 고민은 개발 중인 기능을 다른 사람에게 더 일찍 보여주고 싶다는 것이었다.  
실험에서는 여러 상태를 확인하는 방법을 만들었고 이 두개가 혼합이 되면 협업할 때 훨씬 수월해 질거라 기대하게 되었다.  

이제 이 구성이 잘 작동함을 확인했으니 실제 팀에서도 활용해볼 것이다.  
2편에서는 동아리 프로덕트에 무엇을 적용했고, 결과물을 공유하는 방식과 피드백이 어떻게 달라졌는지 이어가려 한다.  