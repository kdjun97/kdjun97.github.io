---
title: "[Xcode] IDETemplateMacros.plist로 파일 헤더 주석 설정해보기"  
excerpt: "파일 생성시 자동으로 파일 헤더에 주석 적용하기"

categories:
  - Etc
tags:
  - [Xcode]

permalink: /etc/xcode-template-macro/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2023-12-31 10:00:00
last_modified_at: 2023-12-31 10:00:00
published: true
---  

# 🗿 헤더 설정 템플릿

`IDETemplateMacros.plist` 파일 생성시 자동으로 헤더에 주석을 설정할 수 있다.  
즉, 파일이 생성되면서 빈 파일에 내가 적용한 텍스트들이 추가적으로 함께 채워진다는 의미이다.  

오랜만에 새로운 프로젝트를 파면서 원래 있던 회사 주석과 다르게 적용시키는 법에 대해 검색하며 적용하다가 그냥 직접 정리하려 한다.  

모든 파일들에 대해 전역적으로 설정하는 방법과 특정 프로젝트에만 적용되게 하는 2가지 방법에 대해 알아보겠다.  
또한, 거추장스러운 많은 주석들보다는 filename과 package name, 언제 누가 만들었는지 정도, 회사라면 copyright까지 설정만 해보도록 하자.  

## 📖 전역적으로 적용

아주 간단하다.  
우선, 터미널에서 아래 경로로 간다.  

`$ cd ~/Library/Developer/Xcode/UserData`  

이 경로에서 `IDETemplateMacros.plist`라는 파일을 만들어주면 된다.  
`$ vi IDETemplateMacros.plist`  

그리고 아래와 같은 내용을 채워주면 된다.  

```plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>FILEHEADER</key>
    <string>
//  ___FILENAME___
//  ___PACKAGENAME___
//
//  Created by 김동준 on ___DATE___
//  Copyright © ___YEAR___ Company. All rights reserved.
//</string>
</dict>
</plist>
```  

이후 프로젝트에서 .swift 파일을 생성하면 아래와 같은 주석들이 생기게 될 것이다.  

```swift
//
//  ContentView.swift
//  LiarGame
//
//  Created by 김동준 on 12/31/23
//  Copyright © 2024 Company. All rights reserved.

import SwiftUI

struct ContentView: View {
    var body: some View {
      // ...
    }
}
```  

## 😛 특정 프로젝트에만 적용

위와 같이 전역으로 회사 copyright가 항상 적용되어있는 상태에서, private project에도 회사 copyright가 나온다면 굉장히 곤란할 것이다.  
IDETemplateMacors.plist는 특정 프로젝트에만도 적용이 가능하니 너무 낙심하지 말자.  

아래 경로로 가보자.  

`$ cd 본인의 프로젝트.xcodeproj/xcuserdata/[username].xcuserdatad/`  

이 프로젝트에서만 쓰일 `IDETemplateMacros.plist` 파일을 생성한다.  

`$ vi IDETemplateMacros.plist`  

내용을 copyright만 뺀 내용으로 입력해주자.  

```plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>FILEHEADER</key>
    <string>
//  ___FILENAME___
//  ___PACKAGENAME___
//
//  Created by 김동준 on ___DATE___
//</string>
</dict>
</plist>
```  

이렇게 저장하고 빠져나오면 해당 프로젝트에만 적용되는 템플릿을 만들 수 있다.  
