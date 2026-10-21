---
title: "[SwiftUI] Bottom TabView"  
excerpt: "Bottom TabView를 구현해보자"

categories:
  - iOS
tags:
  - [SwiftUI]

permalink: /swift/swiftui-bottom-tabview/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2023-11-06 10:00:00
last_modified_at: 2026-10-21 21:15:45
published: true
---  

# 🧭 Bottom TabView

> [Github Link](https://github.com/kdjun97/swiftui-bottom-tabview)  

다수의 앱에 TabView가 존재한다.  
상단에 위치할 수도있고, 하단에 위치할 수도 있다.  
Flutter에서는 이를 `NavigationBar`라고 하고, swift에서는 `TabView`로 구현이 가능하다.  

앞서 포스팅에서 다뤘던 ZStack, HStack, VStack과 overlay를 이용하여 만든 BottomTabView이다.  


```swift  
ZStack {
    TabView(selection: $selectedIndex) {
        FirstView().tag(0)
        SecondView().tag(1)
        ThirdView().tag(2)
        FourthView().tag(3)
    }.overlay(
        Color.clear
        .edgesIgnoringSafeArea(.horizontal)
        .frame(height: 64)
        .overlay(
            alignment: .leading, content: {
                HStack (spacing:0) {
                    ForEach(menuList, id: \.self) { menu in
                        MenuButton(selectedIndex: $selectedIndex, menu: menu)
                            .padding(
                                EdgeInsets(
                                    top: 0,
                                    leading: (menu.rawValue == 0) ? 22 : 0,
                                    bottom: 0,
                                    trailing: (menu.rawValue != 3) ? 22 : 0
                                )
                            )
                    }
                }
            }
        ).padding(EdgeInsets(
            top: 0,
            leading: 12,
            bottom: 0,
            trailing: 12
            )), alignment: .bottom)
}
```  

실행 영상은 다음과 같다.  

![bottom-tabview](/assets/images/post_img/swift/swiftui-bottom-tabview/bottom-tabview.gif)   

