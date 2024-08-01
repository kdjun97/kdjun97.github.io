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

[본 포스팅은 해당 블로그 글을 많이 참고하였음.](https://phillip5094.tistory.com/126)  

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

이 화면에서 SwiftUI File을 누르면 Hello World 코드가 자동으로 적힌 채로 파일이 하나 생성될 것이다.  
이 모든 작업은 **File Template** 때문에 가능하다.  
아래에서 TCA File Template을 만드는 방법을 알아보고 위의 불편한 점을 해소해보도록 하자.  

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

file name 수정  

```
Empty File.xctemplate -> TCA Template.xctemplate  
TemplateIcon은 적절하게 교체 (나는 마땅한게 없어 그냥 사용했다)  
```  

![tca-template_file_name](/assets/images/post_img/xcode/xcode-custom-file-template/tca_template_filename.png)   

# 😷 Edit TemplateInfo.plist  

- MainTemplateFile 필드 제거  
- Options dictionary 추가  
- 아래와 같이 수정  

```plist  
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>SupportsSwiftPackage</key>
	<true/>
	<key>Description</key>
	<string>Make TCA Template</string>
	<key>Summary</key>
	<string>Make TCA Template</string>
	<key>Kind</key>
	<string>Xcode.IDEFoundation.TextSubstitutionFileTemplateKind</string>
	<key>DefaultCompletionName</key>
	<string>File</string>
	<key>SortOrder</key>
	<integer>1</integer>
	<key>Options</key>
	<array>
		<dict>
			<key>Identifier</key>
			<string>productName</string>
			<key>NotPersisted</key>
			<string>true</string>
			<key>Type</key>
			<string>text</string>
			<key>Description</key>
			<string>Enter feature name</string>
			<key>Name</key>
			<string>Feature name:</string>
			<key>Required</key>
			<string>true</string>
		</dict>
		<dict>
			<key>Identifier</key>
			<string>TCAFeature</string>
			<key>NotPersisted</key>
			<string>true</string>
			<key>Type</key>
			<string>checkbox</string>
			<key>Description</key>
			<string>Include TCA Feature</string>
			<key>Name</key>
			<string>Include TCA Feature</string>
			<key>Required</key>
			<string>true</string>
			<key>Default</key>
			<string>true</string>
		</dict>
	</array>
</dict>
</plist>
```

![info-plist-options](/assets/images/post_img/xcode/xcode-custom-file-template/info_plist_options.png)   

🔥 options field  
Identifier : 템플릿 파일에서 사용되는 변수 id  
Required : 필수값 여부  
Name : Xcode에서 출력될 label text  
Description : 상세 설명 (label text 위에 커서를 올리면 화면에 출력됨)  
Type : 사용자 입력값 타입 (ex. string, checkbox, class 등)  
NotPersisted : 이전에 입력한 값 유지할지 여부  
{: .notice--warning}  

---  

View + Feature 2개의 파일이 동시에 생기도록 설정하기 위해 Options 배열을 2개로 줬음.  

그 후, 아래와 같이 Default, TCAFeature 디렉토리를 생성한다.  
위 Info.plist에서 생성한 checkbox를 선택하지 않으면, Default에 있는 템플릿을 사용하고,  
checkbox를 선택하면 TCAFeature에 있는 템플릿을 설정한다.  

![directory](/assets/images/post_img/xcode/xcode-custom-file-template/directory.png)   

마지막으로 View, Feature에 대해 템플릿 코드만 작성하면 끝이 난다!  

# 🤥 Add TCA View File

```  
기존 파일 삭제 : ___FILENAME___  
새 파일 생성 : ___FILEBASENAME___View.swift  
생성한 ___FILEBASENAME___View.swift 파일에는 TCA View 내용을 기입.  
Default, TCAFeature 두 곳에 파일을 복사 붙여넣기.  
```  

```swift  
// ___FILEHEADER___

import SwiftUI
import ComposableArchitecture

public struct ___VARIABLE_productName___View: View {
    let store: StoreOf<___VARIABLE_productName___Feature>
    @ObservedObject var viewStore: ViewStoreOf<___VARIABLE_productName___Feature>

    public init(store: StoreOf<___VARIABLE_productName___Feature>) {
        self.store = store
        self.viewStore = ViewStore(store, observe: { $0 })
    }
    
    public var body: some View {
        ___VARIABLE_productName___Body(viewStore: viewStore)
        .onAppear {
            viewStore.send(.onAppear)
        }
    }
}

private struct ___VARIABLE_productName___Body: View {
    @ObservedObject private var viewStore: ViewStoreOf<___VARIABLE_productName___Feature>
    
    fileprivate init(viewStore: ViewStoreOf<___VARIABLE_productName___Feature>) {
        self.viewStore = viewStore
    }
    
    fileprivate var body: some View {
        ZStack {
            Text("___VARIABLE_productName___ View!!!")
        }
    }
}
```  

# 🤥 Add TCA Feature File

```  
새 파일 생성 : ___FILEBASENAME___Feature.swift  
생성한 ___FILEBASENAME___Feature.swift 파일에는 TCA Feature 내용을 기입.  
TCAFeature 폴더에 해당 파일 이동.    
```  

```swift
// ___FILEHEADER___

import ComposableArchitecture

@Reducer
public struct ___VARIABLE_productName___Feature {
    public init() {}

    public struct State: Equatable {
        public init() {}
    }

    public enum Action {
        case onAppear
    }

    public var body: some ReducerOf<___VARIABLE_productName___Feature> {
        Reduce { _, action in
            switch action {
            case .onAppear:
                break
            }
            return .none
        }
    }
}
```  

# 🤪 Done

이제 TCA View + Feature가 한꺼번에 만들어진다.  
매우 편리하게 Boilerplate Code도 짜주니 잘 사용하면 될 것 같다.  

![add-file](/assets/images/post_img/xcode/xcode-custom-file-template/add_file.png)   

![add-file2](/assets/images/post_img/xcode/xcode-custom-file-template/add_file2.png)   

![done](/assets/images/post_img/xcode/xcode-custom-file-template/done.png)   

# 😒 Problem  

블로그 포스팅을 하고, 2개월이 지난 현재. 새로운 프로젝트를 진행하며 코드를 짜고 있었음.  
근데, 만들어 둔 템플릿을 전혀 사용하지 않았던 문제 발견.  

왜일까? 고민했는데, 답은 여기에 있었다.  

![tca-template_file_name](/assets/images/post_img/xcode/xcode-custom-file-template/tca_template_filename.png)    

XCode를 사용한 사람들은 New File을 해보면 이 창이 뜬다는 것을 알 것이다.  
하지만, New File을 선택하였을 때, 우리가 만든 템플릿은 제일 아래에 위치해 있다.  
즉, 눈에 띄지 않기 때문에 잊혀진 것.  

따라서, 잊지 않게 제일 최상단으로 올릴 필요가 있다고 생각했다.  

아까 전 스텝에서 특정 Path에 우리가 만든 템플릿을 넣어줬는데, 이 경로를 수정하면 최상단으로 올릴 수 있게 된다.  

```  
// 이전 코드. 이렇게 하면 3번째 줄에 의해 TCA Templates라는 새로운 탭이 제일 아래에 생기게 된다.  
cd ~/Library/Developer/Xcode
mkdir Templates
mkdir TCA\ Templates  

// 바뀐 코드
cd ~/Library/Developer/Xcode/Templates/File\ Templates/Multiplatform
mkdir Source // 원하는 탭의 이름. ex) User Interface
```  

해당 경로에 우리가 아까 만들었던 `TCA Template.xctemplate` 파일을 이동시키자.  
그리고 저장 후, Xcode를 다시 실행 - New File 확인을 해보게 되면, 아래와 같이 나오게 된다.  

![tca-template_file_new_path](/assets/images/post_img/xcode/xcode-custom-file-template/tca_template_file_new_path.png) 

내친김에 `User Interface`에도 추가를 해보았다.  
이제 우리는 자주 노출되는 만큼, 그리고 시간을 들여 template을 짠 만큼 커스텀 템플릿을 자주 사용하게 될 것이다.  
