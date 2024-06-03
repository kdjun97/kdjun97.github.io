---
title: "[Xcode] Custom File Template 이용, 자동 템플릿 생성"  
excerpt: "Xcode - New File - Custom Template 사용해보기"

categories:
  - Xcode
tags:
  - [Xcode]

permalink: /xcode/xcode-custom-file-template/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2024-06-03 10:00:00
last_modified_at: 2024-06-03 10:00:00
published: true
---  

# 🗿 Boilerplate code

TCA를 이용해서 Proejct를 구성하다 불편한 점이 생겼다.  
TCA는 주로 View와 Feature가 한 쌍으로 움직인다.  

예를 들어, Sign In 기능을 구현하기 위해서, SignInView + SignInFeature가 필요하다.  
매번, 새로운 Feature Module을 생성하고, 해당하는 View, Feature들을 함께 만들어 Boilerplate code를 생성할 때가 되면 이것을 자동화할 방법이 없을까 고민이 들곤 했다.  

자동화 할 것은 크게 2가지다.  
1. View + Feature 한 쌍의 파일 생성.  
2. View 기본 코드 + Feature 기본 코드 생성.  

여기서 View와 Feature의 기본 코드라 함은, TCA의 뼈대가 되는 코드이다.  

이것을 해결해주는 방법을 아래에서 소개해보도록 하겠다.  

# 🥸 Custom File Template

Xcode에서 New File로 .swift 파일을 생성할 때 이러한 화면을 많이 보았을 것이다.  

![new-file](/assets/images/post_img/xcode/xcode-custom-file-template/new_file.png)   

이 화면에서 Swift File을 누르면 Hello World 코드가 자동으로 적힌 채로 파일이 하나 생성될 것이다.  
이 모든 작업은 **File Template** 때문에 가능하다.  
그렇다면 이제 TCA File Template를 만들면 위에서 불편했던 작업을 자동화시킬 수 있을 것이다!  

# 🤓 Make File Template

빠르게 하기 위해, 기존에 있던 템플릿을 수정하는 형식으로 진행.  

```
cd /Applications/Xcode.app/Contents/Developer/Library/Xcode/Templates/File\ Templates/Other
```  

해당 경로에서 **Empty File.xctemplate** 복사  

```  
cd ~/Library/Developer/Xcode
mkdir Templates
mkdir TCA\ Templates  
```  

위 명령어를 순차적으로 입력하여 Xcode 전역적으로 사용할 TCA Template 디렉토리를 생성해준다.  

이제 해당 디렉토리에 아까 복사했던 **Empty File.xctemplates**를 붙여넣는다.  

그 후, TCA Template이 잘 생성되었는지 확인.  

![tca-template](/assets/images/post_img/xcode/xcode-custom-file-template/tca_template.png)   

# 💱 Change Empty Template

Empty Template이 잘 생성된 것을 확인하였으니, 이제 TCA Template으로 수정할 차례.  
