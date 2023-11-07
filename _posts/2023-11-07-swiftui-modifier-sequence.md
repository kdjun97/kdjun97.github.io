---
title: "[SwiftUI] modifier 순서에 대해"  
excerpt: "UI를 그리면서 생겼던 의문점에 대해"

categories:
  - Swift
tags:
  - [SwiftUI]

permalink: /swift/swiftui-modifier-sequence/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2023-11-07 10:00:00
last_modified_at: 2023-11-07 10:00:00
published: true
---  

# 🗿 UI 그리다가 삽질함

SwiftUI로 UI를 그리던 도중 직면한 문제이다.  
텍스트와 이미지를 각종 Stack을 활용하여 그리고 있었다.  
각 View들의 크기를 조절하고 UI를 그리던 중, 내가 원하는 대로 그려지지 않음을 느끼고 꽤 오랜 시간동안 삽질을 했다.  
코드상에 전혀 문제가 없어보여서 디버깅도 좀 오래 걸렸던 것 같다.  

하지만 오랜 삽질 끝에 깨달아버렸고 그 점에 대해 포스팅 하도록 하겠다.  

# 😩 modifier의 순서에 대해  

Text의 사이즈를 정하려면 어떻게 해야할까?  
**.frame()**으로 사이즈를 정해준다.  
padding을 주려면?  
**.padding modifier**를 이용하면 된다.  
또한, background를 주고싶다면 **.background modifier**를 사용하면 된다.  

위와 같은 사실은 다 알지만, modifier의 **순서**가 굉장히 중요하다는 것을 알고 있었나?  
아무 생각없이 UI를 그리다가 modifier 순서 때문에 한참 삽질했다.  

예를들면 아래 코드를 실행시켜보자.  

```swift  
var body: some View {
  VStack (spacing: 0) {
    // case 1
    Text("long long text").border(.red).frame(maxWidth: .infinity).padding(.leading, 100)
    Text("long long text").padding(.leading, 100).frame(maxWidth: .infinity).border(.red)
    // case 2
    Text("background test").frame(maxWidth: .infinity).background(.green)
    Text("background test").background(.green).frame(maxWidth: .infinity)
  }
}
```  

위 VStack에 각 2개의 테스트를 진행했다.  
같은 View에 modifier의 순서만 달리 달아주었다.  

**case 1**은 `border과 padding`을 볼 수 있는 테스트,  
**case 2**는 `background color`를 볼 수 있는 테스트 코드를 짰다.  

다른건 modifier의 순서이다.  
**case 1**에서,  
첫 번째 코드는 border를 그려주고 frame을 먹이고 padding을 주었다.  
두 번째 코드는 padding을 주고, frame을 먹이고 border를 주었다.  

**case 2**에서,  
첫 번째 코드는 frame을 정해주고 배경색을 정해주었다.  
두 번째 코드는 배경색을 칠하고 frame을 정해준다.  

결과는 아래와 같다.  

![test](/assets/images/post_img/swift/swiftui-modifier-sequence/test.png)   

modifier의 순서가 결과에 영향을 미친다는 사실을 알 수 있었다.  
나 같은 경우, padding을 마지막에 넣어야하는데, 미리 넣고 색깔 설정을 했다던지 등의 실수로 시간을 많이 소요했다.  
modifier를 달아주기만 하면 되고, 순서는 상관없다고 생각하였으나, 이것 역시 top down으로 순서가 중요하다는 것을 알았다.  
순서대로 적용되니 말이다.  
하지만 괜찮다. 이제 알았으니까 😎 낄낄ㅋ  