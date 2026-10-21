---
title: "[SwiftUI] ZStack vs overlay vs background"  
excerpt: "ZStack, overlay와 background는 뭐가 다른걸까?"

categories:
  - iOS
tags:
  - [SwiftUI]

permalink: /swift/swiftui-zstack-overlay-background/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2023-11-04 10:00:00
last_modified_at: 2026-10-21 21:15:45
published: true
---  

# 😀 ZSTack vs overlay 

ZStack은 앞선 포스팅에서 위로(앞으로) 겹겹이 쌓아주는 View라고 하였다.  
> [SwiftUI Stack 삼총사](https://kdjun97.github.io/swift/swiftui-stack/)  

overlay도 비슷한 역할을 하지만 사실 둘은 조금 다르다.  
둘의 차이점에 대해 알아보자.  

# 💤 ZStack  

ZStack은 자기 자신 안에 있는 View들을 독립적으로 취급한다.  
따라서, 서로 크기가 다른 view들이 ZStack안에 존재할 때, 그 안의 가장 큰 width, height에 따라 size가 결정된다.  

# 🪆 overlay  

overlay는 view modifier로서, parent view에 종속된다.  
즉, Text의 overlay라면 그 Text에 대해 종속되어 좌표가 결정된다.  

나는 `백문불여일견`이라는 말을 좋아하고 그림이 있는 책들을 좋아한다.  
무슨 말이냐면 사진을 통해 알아보면 더욱 이해가 빠를것이라는 얘기다.  

# 👷‍♂️ Test

우선 아래의 간단한 코드로 예를 들어보겠다.  
어느 앱의 Bottom TabView를 만들어보는 망상코딩을 해보자.  

```swift  
var body: some View {
    VStack {
        Rectangle()
            .fill(.yellow)
            .frame(width: 150,height: 150)
            .overlay(Text("bottom TabView"), alignment: .bottom)
            .border(.red).padding(.bottom, 50)
        ZStack (alignment: .bottom) {
            Rectangle()
                .fill(.yellow)
                .frame(width: 150,height: 150)
            Text("bottom TabView")
        }.border(.red)
    }
}
```  

단순하게 size를 정해준 사각형과 밑에 Bottom TabView를 간이로 구현한 View이다.  
실행 결과는 아래와 같다.  

![zstack-test](/assets/images/post_img/swift/swiftui-zstack-overlay-background/zstack-test.png)   

두 결과 모두 같아보인다.  
그렇다면 사용법만 다르고 정말 100% 똑같은 것일까?  
위에서도 언급했듯이 zstack은 자식뷰들이 독립적이고, overlay된 뷰는 parent view에 종속된다고 하였다.  
텍스트의 사이즈를 조금 키워서 다시 한 번 결과를 보도록 하자.  

```swift 
var body: some View {
    VStack {
        Rectangle()
            .fill(.yellow)
            .frame(width: 150,height: 150)
            .overlay(
                Text("bottom TabView")
                    .font(.system(size: 30))
                    .background(.blue), alignment: .bottom
            ).border(.red).padding(.bottom, 50)
        ZStack (alignment: .bottom) {
            Rectangle()
                .fill(.yellow)
                .frame(width: 150,height: 150)
            Text("bottom TabView")
                .font(.system(size: 30))
                .background(.brown)
        }.border(.red)
    }
}
```

![zstack-test2](/assets/images/post_img/swift/swiftui-zstack-overlay-background/zstack-test2.png)   

일단 이 그림을 보자마자 차이점이 있다는 것은 알게 되었을 것이다.  

`overlay`로 구현한 위 코드는 **부모인 Rectangle View의 크기에 종속**되어 텍스트를 사이즈를 키웠을 때 **Rectangle 안에서 text size가 커졌다.**  
반면, `ZStack`로 구현한 아래 코드는 **각 View가 독립적이기 때문에** Text의 크기가 커진 만큼 ZStack의 크기가 커진다.  

이 실험을 통해 만약 Bottom TabView를 구현하는 상황이라면, 전체 화면에 대한 View를 잡아준 뒤, 그것에 대해 `overlay`해서 구현하는 것이 더 맞다고 볼 수 있다.  

# 🔙 background

우리는 ZStack, zIndex, overlay까지 알아보았다.~~(이 전 포스팅까지 봤다면 말이지)~~  
ZStack과 overlay는 위쪽으로(앞쪽으로) layer를 쌓아주는 효과가 있었지만, 반대의 역할을 하는 친구가 있다.  
눈치챘겠지만 그것이 `.background modifier`이다.  

`.background`는 아래쪽으로(뒤로) layer를 쌓아준다.  

이것 역시 실험을 통해서 알아보자.  
위 예제와 동일한 Rectangle 하나, 그리고 background를 사용한 것 하나, 마지막으로 offset을 이용하여 정말 뒤에 가려져있는지 검증하는 View 총 3개를 그려보자.  

```swift 
var body: some View {
    VStack {
       Rectangle()
            .fill(.yellow)
            .frame(width: 150,height: 150)
            .overlay(
                Text("bottom TabView")
                    .font(.system(size: 30))
                    .background(.blue), alignment: .bottom
            ).border(.red).padding(.bottom, 50)
        Rectangle()
            .fill(.yellow)
            .frame(width: 150,height: 150)
            .background(
                Text("bottom TabView")
                    .font(.system(size: 30))
                    .background(.blue), alignment: .bottom
            ).border(.red).padding(.bottom, 50)
        Rectangle()
            .fill(.yellow)
            .frame(width: 150,height: 150)
            .background(
                Text("bottom TabView")
                    .font(.system(size: 30))
                    .background(.blue)
                    .offset(x: 40, y: 20), alignment: .bottom
            ).border(.red) 
    }
}
```  

![background-test](/assets/images/post_img/swift/swiftui-zstack-overlay-background/background-test.png)   

위 실험으로 `.background`를 사용하면 아래(뒤쪽)으로 layer가 쌓인다는것을 알게 되었다.  

# 📝 Summry  

`ZStack`: 자식 뷰들에 대해 `독립적`, `위(앞)`로 layer를 쌓아주는 역할  
`overlay`: 부모 뷰에 `종속적`, 마찬가지로 `위(앞)`로 layer를 쌓아주는 역할  
`background`: 부모 뷰에 종속적, `아래로(뒤)`로 layer를 쌓아주는 역할   

이 점을 잘 알고 개발을 하면 좋을 것 같아서 포스팅해봤다.~~(사실 TabView 만들다가 정리한 것임)~~  