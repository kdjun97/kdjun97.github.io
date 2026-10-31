---
title: "[iOS] Xcode Cloud로 오목완 CI/CD 구성하기"
excerpt: "Apple이 제공하는 CI/CD에 Tuist 프로젝트 준비와 Discord 알림을 연결한 과정"

categories:
  - iOS
tags:
  - [iOS, Xcode Cloud, Tuist, CI/CD]

permalink: /ios/omokwan-cicd/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb"

date: 2026-04-08 10:00:00
last_modified_at: 2026-04-08 10:00:00
published: true
---

# 🚚 Xcode에서 시작한 오목완 CI/CD

> 코드 출처: [begin-a-gain/omokwan-ios](https://github.com/begin-a-gain/omokwan-ios)  

연차가 쌓이면서 앱의 기능을 구현하는 것뿐 아니라, 만든 결과물을 어떻게 빌드하고 배포할지도 점점 더 고민하게 됐다.  
잦은 배포에 대응하려면 매번 수동으로 Archive하고 업로드하는 과정을 줄일 필요가 있다고 생각했다.  

그래서 CI/CD를 직접 구성해 보면서 빌드부터 배포까지 자동으로 이어지는 환경을 만들어 보고 싶었다.  
그 고민을 사이드 프로젝트에 적용해 보기 위해, 오목완에 **Xcode Cloud로 CI/CD를 도입했다.**  

처음 도입하는 만큼 Apple이 Xcode에서 제공하는 기능으로 간단하게 시작해 보고 싶었다.  
UI로 Workflow를 설정할 수 있고, 빌드와 배포에 필요한 기능이 내장되어 있어 Xcode Cloud를 선택했다.  

Xcode Cloud를 연결하더라도 바로 빌드할 수 있는 것은 아니었다.  
가상 환경에서 빌드를 하는것이기 때문에, 로컬에 있던 환경 설정 파일을 CI에서도 준비해야 했고, Tuist를 설치해 프로젝트를 생성하는 과정도 필요했다.  

그래서 빌드와 TestFlight 배포는 Xcode Cloud의 흐름에 연결하고, **그 앞의 준비 작업과 빌드 결과 알림은 직접 작성한 Shell Script로 채웠다.**  
고맙게도 Xcode Cloud에서 특정 시점에 shell script가 실행되게끔 되게 지원해주고 있어 그걸 활용했다.  

# ⚙️ Xcode Cloud와 스크립트의 역할 나누기

Xcode Cloud는 빌드 과정의 정해진 시점에 사용자 스크립트를 실행한다. 공식 진입점은 다음 세 가지다.  

| 스크립트 | 실행 시점 | 오목완에서 사용한 작업 |
| --- | --- | --- |
| `ci_post_clone.sh` | 저장소를 가져온 뒤 | 설정 파일 생성, mise·Tuist 준비, 프로젝트 생성 |
| `ci_pre_xcodebuild.sh` | `xcodebuild` 실행 전 | 별도로 사용하지 않음 |
| `ci_post_xcodebuild.sh` | `xcodebuild` 실행 후 | 종료 코드 확인, 버전 조회, Discord 알림 |

이 파일들은 프로젝트 또는 Workspace와 같은 위치의 `ci_scripts/` 아래에 둔다. 세부 작업은 `post_clone/`, `post_xcodebuild/` 하위 스크립트로 나눴다. 진입점에서는 실행 순서를 읽고, 하위 스크립트에서는 각 작업을 확인할 수 있게 한 것이다.  

이 구조와 실행 시점은 [Apple의 Custom Build Script 문서](https://developer.apple.com/documentation/xcode/writing-custom-build-scripts)에 설명되어 있다.  

오목완의 배포 흐름을 역할별로 나누면 다음과 같다.  

1. **태그 push:** Workflow에 설정한 시작 조건에 따라 Xcode Cloud가 실행된다.  
2. **Post-clone:** 환경 설정 파일과 Tuist 프로젝트를 준비한다.  
3. **Archive:** Xcode Cloud가 설정된 Scheme으로 앱을 빌드하고 Archive를 수행한다.  
4. **Post-xcodebuild:** 빌드 결과를 Discord로 팀원에게 공유한다.  
5. **배포:** Xcode Cloud의 배포 설정에 따라 TestFlight로 연결한다.  

# 🔧 로컬에 있던 설정을 CI에서 준비하기

`환경 변수로 XCConfig와 Firebase 설정 만들기`  

Xcode Cloud에는 환경 변수를 Secret으로 지정하는 기능이 있다. 값을 저장소에 직접 적지 않고 전달할 때 사용하는 설정이다.  
따라서, 필요한 비밀값들을 환경 변수에 저장해서 필요한 파일들을 만들었다.  

| 생성 파일 | 역할 |
| --- | --- |
| `Shared.xcconfig` | 공통 빌드 설정 |
| `Dev.xcconfig`, `Prod.xcconfig` | 환경별 Bundle ID, API 주소, SDK 설정 |
| `Release.xcconfig` | Prod 설정을 복사한 Release 설정 |
| `GoogleService-Info-Dev.plist`, `GoogleService-Info-Prod.plist` | 앱에서 사용할 환경별 Firebase 설정 |

`create_xcconfig.sh`는 필요한 환경 변수가 비어 있으면 파일 생성을 중단한다. `create_google_service_info.sh`도 Firebase 설정값을 확인한 뒤 Dev·Prod 파일을 만든다.  

`준비 순서를 하나의 진입점에 모으기`  

아래 코드는 실제 준비 순서를 설명하기 위해 로그와 오류 처리의 세부 내용을 줄인 예시다.  
요약하자면, 환경 설정 -> 환경에 맞는 필요한 파일들을 생성 -> tuist 로 프로젝트 생성 순이다.  
프로젝트가 만들어져야 빌드하고 아카이빙을 할테니 그 사전 작업을 각종 스크립트로 도와주는 것이다.  

```bash
bash ci_scripts/post_clone/check_initial_environment.sh
bash ci_scripts/post_clone/create_xcconfig.sh
bash ci_scripts/post_clone/create_google_service_info.sh
bash ci_scripts/post_clone/setup_mise_and_build_project.sh
```

마지막 스크립트에서는 mise를 설치하고 `.mise.toml`에 지정한 Tuist를 준비한다. 이어서 `mise exec -- make clean`, `mise exec -- make generate`를 호출한다.  
`make generate`는 Makefile 에 정의된 generate 명령을 실행시키고 의존성 설치와 프로젝트 생성을 담당한다.  

# 🏗️ 태그를 push하면 빌드와 배포까지

프로젝트 생성까지 끝나면 이후 빌드와 Archive는 Xcode Cloud가 담당한다.  
Workflow의 Actions에서 사용할 Scheme과 Archive를 설정하면, 준비된 프로젝트를 바탕으로 앱을 빌드하고 배포에 필요한 Archive를 만들어준다.  

언제 실행할지도 Xcode Cloud에서 설정할 수 있다.  
Start Conditions에서 `Tag Changes`를 선택하면, 조건에 맞는 태그가 원격 저장소에 push되었을 때 Workflow가 자동으로 시작된다. 태그를 감지하는 스크립트를 직접 만들 필요 없이 제공되는 기능을 사용하면 된다는게 편리했고, **그게 Xcode Cloud의 강점인 것 같다.**  

여기에 TestFlight 배포를 위한 Post-action까지 연결했다.  
이렇게 해두면 **태그 push를 시작으로 환경 준비, 프로젝트 생성, 빌드·Archive, TestFlight 배포까지 Xcode Cloud의 흐름에 따라 진행된다.**  

내가 스크립트로 준비한 것은 빌드에 필요한 설정 파일과 Tuist 프로젝트였다. 그 이후의 빌드와 배포는 Xcode Cloud에서 제공하는 기능을 설정해 사용했다. UI에서 시작 조건과 수행할 작업을 연결할 수 있어 간단하게 구성해 볼 수 있었다.  

# 🔔 Discord로 팀원에게 빌드 소식 공유하기

우리는 Discord로 소통을 자주 했고, 그래서 팀원들이 자주 보는 Discord 채널에 배포 소식을 알리고자 기능을 연결했다.  
Discord 채널의 Webhook URL을 Xcode Cloud 환경 변수에 등록하고, `ci_post_xcodebuild.sh`에서 알림 스크립트를 호출하도록 했다.  

알림에는 빌드 성공·실패 여부와 앱 버전, 빌드 번호, Workflow, 커밋 정보를 담았다. 성공한 경우에는 빌드가 끝났고 곧 TestFlight에 업로드된다는 메시지를 보냈다.  

덕분에 팀원들은 Discord 채널에서 어떤 버전의 빌드가 끝났는지, 실패한 빌드는 없는지 함께 확인할 수 있었다. 빌드할 때마다 따로 메시지를 작성하는 대신, 결과를 자동으로 공유하도록 연결한 것이다.  

<a href="https://kdjun97.github.io/assets/images/post_img/ios/omokwan-cicd/img_discord.png" target="_blank" rel="noopener noreferrer">
  <img src="/assets/images/post_img/ios/omokwan-cicd/img_discord.png" alt="Discord 빌드 실패·성공 알림" style="width: 600px; max-width: 100%; height: auto;">
</a>  

# 🌱 Xcode Cloud를 사용해 보며

직접 구성해 보니 가장 크게 느낀 건 역시 **편리함**이었다.  
태그를 push하면 환경 준비부터 빌드와 TestFlight 배포까지 이어졌고, 빌드 결과도 팀원들이 자주 보는 Discord 채널에 공유됐다.  

매번 직접 Archive하고 업로드한 뒤 팀원에게 소식을 전하는 일을 반복할 필요가 줄었다. 한 번 배포할 때는 감수할 만한 작업도, 자주 반복되면 그만큼 시간과 신경을 쓰게 된다.  
처음에는 CI/CD를 직접 구현해 보고 싶어서 시작했지만, 사용해 보니 **배포가 잦은 환경에서 왜 필요한지 체감할 수 있었다.**  

> [Xcode Cloud Workflow 문서](https://developer.apple.com/documentation/xcode/xcode-cloud-workflow-reference)  
> [Apple Developer - 시작 조건 구성하기](https://developer.apple.com/kr/documentation/xcode/configuring-start-conditions)  
> [Apple Developer - Custom Build Script](https://developer.apple.com/documentation/xcode/writing-custom-build-scripts)
