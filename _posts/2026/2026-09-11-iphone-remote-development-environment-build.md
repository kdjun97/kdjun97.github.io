---
title: "iPhone으로 MacBook과 Raspberry Pi 원격 접속 환경 구축하기"  
excerpt: "어디서든 MacBook과 Raspberry Pi에 접속하는 환경 만들기"

categories:
  - Etc
tags:
  - [IoT, Linux]

permalink: /etc/iphone-remote-development-environment-build/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2026-09-11 10:00:00
last_modified_at: 2026-09-11 10:00:00
published: true
---

# 🤩 들어가기에 앞서…

나는 집에서 Raspberry Pi를 24시간 돌리며 이미 서버로 활용하고 있다.  
내 라즈베리파이는 예전에 진행한 [스마트 홈 프로젝트](https://kdjun97.github.io/iot/smart-home-project/)에서 MQTT Broker 서버를 담당하고 있다.  

AI가 발전하는 것을 보면서, 이제는 Raspberry Pi를 단순한 실험용 장비가 아니라 **항상 켜져 있는 개인 서버**처럼 제대로 활용해보고 싶어졌다.  
라즈베리파이를 24시간 서버처럼 사용하기 시작하니, 자연스럽게 외부에서도 Raspberry Pi에 접속해 상태를 확인하거나 설정을 변경해야 하는 일이 생겼다.  
그때마다 집에서 직접 접속해 작업하는 것이 너무 귀찮았다…  ~~hdmi to micro-hdmi 부터 하... 넘 귀찮음~~  

처음에는 SSH만으로 원격 접속 환경을 구성하면 충분할지 고민했다.  
하지만 CLI만으로 작업하다 보면 가끔 실제 화면을 보면서 상태를 확인하거나 직접 설정해야 할 때가 있다.  
그래서 SSH뿐만 아니라 화면까지 원격으로 확인하고 제어할 수 있도록 VNC를 사용하기로 했다.  
그러던 중 Port Forwarding 없이도 외부에서 Raspberry Pi에 안전하게 접속할 수 있는 `Tailscale`을 알게 되었다.  

여기까지 알아보고 나니 Raspberry Pi뿐 아니라 MacBook도 같이 셋팅해두면 더 편할 것 같았다.  

앞으로 원격(내 핸드폰)으로 Raspberry Pi와 MacBook에서 여러 AI 도구나 서비스, 직접 만든 프로그램도 실행해보면 재밌겠다 싶었다.  
특정 App에서 제공하는 원격 기능에만 의존하기보다(ex: codex desktop app의 Remote기능) 필요할 때 장치 자체에 접속할 수 있는 범용적인 환경이 하나 있으면 좋겠다고 생각했다.  

따라서, 이번 프로젝트에서 하고자 하는 목표를 아래와 같이 잡았다.  

- iPhone에서 MacBook에 SSH와 VNC로 접속하기
- iPhone에서 Raspberry Pi에 SSH와 VNC로 접속하기
- MacBook에서 Raspberry Pi에 SSH와 VNC로 접속하기

장소에 상관없이 iPhone 하나만 가지고 명령을 내리고, 상태를 확인하고, 필요하면 화면까지 볼 수 있는 환경을 구축하는 게 목표였다.  
앞으로 AI를 활용한 여러 프로젝트를 진행하기 전에, 어디서든 직접 확인할 수 있는 눈에 보이는 환경부터 만들어둔 것이다.  

# 🤔 구성 및 연결 구조

구성해야 할 연결은 총 3개였다.  

| 연결 | 제어 방식 |
|---|---|
| iPhone → MacBook | SSH + VNC |
| iPhone → Raspberry Pi | SSH + VNC |
| MacBook → Raspberry Pi | SSH + VNC |

세 장치에 Tailscale을 설치하면 각각 Tailnet 전용 IP가 할당된다.  
SSH는 이 IP를 통해 접속하고, Raspberry Pi의 VNC도 Tailscale 안에서 직접 연결하도록 구성했다.  

iPhone에서는 아래 3개의 App을 사용했다.  

- `Tailscale`: MacBook과 Raspberry Pi를 같은 Tailnet으로 연결
- `Termius`: MacBook과 Raspberry Pi에 SSH로 접속
- `RealVNC Viewer`: MacBook과 Raspberry Pi 화면에 접속

RealVNC에서 각 장치의 역할은 아래와 같다.  

| 장치 | RealVNC 역할 |
|---|---|
| iPhone | MacBook과 Raspberry Pi에 접속하는 Viewer |
| MacBook | Raspberry Pi에 접속하는 Viewer + iPhone 연결을 받는 Inbound(Server) |
| Raspberry Pi | iPhone과 MacBook의 연결을 받는 Server |

이를 실제 연결 기준으로 정리하면 아래와 같다.  

```text
┌────────────────────── Tailscale Tailnet ────────────────────────┐
│                                                                 │
│  iPhone                         MacBook           Raspberry Pi  │
│  - SSH Client                   - SSH Server      - SSH Server  │
│  - RealVNC Viewer               - RealVNC Viewer  - VNC Server  │
│                                 - VNC Inbound                   │
│                                                                 │
│  iPhone ── SSH ───────────────→ MacBook                         │
│  iPhone ── SSH/VNC Direct ────→ Raspberry Pi                    │
│  MacBook ─ SSH/VNC Direct ────→ Raspberry Pi                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

iPhone RealVNC Viewer ── RealVNC Cloud ──→ MacBook VNC Inbound  
```  

처음에는 MacBook VNC까지 모두 Tailscale IP를 사용하는 Direct 연결로 통일하려고 했다.  
결론부터 말하면 Raspberry Pi는 Tailscale IP를 사용하는 Direct VNC로 연결했고, MacBook은 RealVNC Cloud로 연결했다.  

Mac의 RealVNC Lite 환경에서는 Direct 연결 옵션이 보이지 않았기 때문이다.  
이게 무료 플랜에선 제한이 되어있는건지, Raspberry pi 와는 다른 옵션인지는 모르겠으나, 딱히 Direct로 할 이유는 없었기에 그냥 설정하지 않았다.  

대신 Mac의 SSH는 Tailscale IP로 직접 접속한다.  

**Tailscale을 선택한 이유?**   

처음에 생각한 방법은 아래였다.
> 공유기 Port Forwarding + public IP

Port Forwarding은 익숙하고 단순한 방법이지만, 관리 포트를 인터넷에 직접 노출해야 한다는 점이 마음에 걸렸다.  
그래서 외부에 포트를 열지 않고도 Raspberry Pi에 접속할 수 있는 방법이 없을까 찾아보기 시작했다.  
그러다 알게 된 것이 Tailscale이었다.  

Tailscale은 장치마다 앱을 설치해야 하지만, 별도의 공유기 설정이나 Port Forwarding 없이 장치들을 하나의 사설망처럼 연결할 수 있다.  
그리고 Tailscale은 장치 간 통신에 WireGuard라는 보안성이 높은 것으로 평가받는 VPN 프로토콜을 기반으로 사용하고 있었다.  
사실 WireGuard가 내부적으로 정확히 어떻게 동작하는지까지 깊게 파고들지는 않았다.  
이번에는 모든 기술의 원리를 이해하는 것보다, 이미 잘 만들어지고 검증된 보안 기술을 활용해서 안전한 원격 접속 환경을 먼저 구성하는 것을 우선순위로 두었다.  
또한 개인 서버나 홈 네트워크의 원격 접속 구성에서 Tailscale을 사용하는 사례가 많았다.  
처음 다뤄보는 도구인 만큼 문제가 생겼을 때 참고할 문서와 경험담을 쉽게 찾을 수 있다는 점도 선택에 영향을 줬다.  
**결국 이번 프로젝트에서는 설정이 간단하고, 검증된 보안 기술을 기반으로 하며, 외부에 포트를 직접 열지 않아도 된다는 점 때문에 Tailscale을 선택했다.**  

# 🛠 환경 셋팅

**1. Raspberry Pi SSH부터 확인**  

VNC보다 SSH를 먼저 확인했다.  
화면 설정을 잘못 건드려도 SSH부터 연결되어있으면 어떻게든 들어가서 복구할 수 있기 때문이다.~~안전하게 가자~~    
MacBook에서 Raspberry Pi로 SSH 접속이 되는 것을 먼저 확인하고, 세 장치에 Tailscale을 설치했다.  

- iPhone
- MacBook Pro
- Raspberry Pi 5

모두 같은 Tailnet에 로그인하고 서로 장치가 보이는지 확인했다.  

<a href="https://kdjun97.github.io/assets/images/post_img/etc/iphone-remote-development-environment-build/img_tailscale.PNG" target="_blank" rel="noopener noreferrer">
  <img src="/assets/images/post_img/etc/iphone-remote-development-environment-build/img_tailscale.PNG" alt="Tailscale 장치 목록" style="display: block; width: 300px; max-width: 80%; height: auto;">
</a>  

`잘 보인다.`  

**2. Raspberry Pi VNC Server 설정**  

내 Raspberry Pi에는 Raspberry Pi OS가 아닌 Ubuntu 24.04 LTS가 설치되어 있다.  
VNC Server와 Viewer도 여러 종류가 있었지만, 이번에는 비교적 많이 사용되고 관련 자료를 찾기 쉬운 `RealVNC`를 선택했다.  

iPhone, MacBook, Raspberry Pi에서 같은 제품군을 사용할 수 있어 장치마다 다른 VNC 도구를 익히지 않아도 된다는 점도 괜찮아 보였다.  
(만약 아이폰 앱은 RealVNC를 쓰고, Raspberry pi는 다른 걸 쓴다면, 유료 플랜을 써야하는 걸로 공식 문서에 나와있었고, 무료 플랜을 고수하기 위해선 나에게 각각을 맞춰야 하는게 강제가 되긴 했다.)  

```bash
echo $XDG_SESSION_TYPE
```  

그래픽 세션을 확인해보니 Wayland였다.  
RealVNC Server를 사용하려면 X11이 필요해서 `/etc/gdm3/custom.conf` 파일에서 아래 설정을 활성화했다.  

```ini
WaylandEnable=false
```  

재부팅 후 X11로 바뀐 것을 확인하고 ARM64용 RealVNC Server를 설치했다.  
RealVNC 설정은 아래와 같이 진행했다.  

- Connectivity: Direct + Cloud
- Authentication: Linux password
- Encryption: Always on
- User Control: 현재 Linux 사용자만 허용
- Attended Access: Off

설정을 마친 뒤 MacBook과 iPhone에서 Raspberry Pi의 Tailscale IP로 접속했다.  
같은 Wi-Fi뿐 아니라 iPhone Cellular 환경에서도 화면과 입력 모두 정상적으로 동작했다.  

**3. MacBook VNC 설정**  

MacBook에는 RealVNC Connect를 설치하고 Inbound 연결을 활성화했다.  
Raspberry Pi와 다르게 MacBook은 IP를 직접 입력하지 않고, RealVNC의 Devices 목록에서 MacBook을 선택해서 접속한다.  

<a href="https://kdjun97.github.io/assets/images/post_img/etc/iphone-remote-development-environment-build/img_realVNC.PNG" target="_blank" rel="noopener noreferrer">
  <img src="/assets/images/post_img/etc/iphone-remote-development-environment-build/img_realVNC.PNG" alt="RealVNC 장치 목록" style="display: block; width: 300px; max-width: 80%; height: auto;">
</a>  

즉, 현재 구성은 아래처럼 동작한다.  

- Raspberry Pi: Tailscale + RealVNC Direct
- MacBook: RealVNC Cloud

처음에는 둘 다 같은 방식일 것이라고 생각했는데 구독과 플랫폼에 따라 연결 방식이 달랐다.  
굳이 이걸 챙길 필요는 없을 것 같아서 스킵하기로..!  
아무튼 iPhone Wi-Fi를 끄고 Cellular로 전환한 뒤에도 Mac 화면 접속에 성공했다.   
아래 그림은 Raspberry pi 에 접속한 모습.  

<a href="https://kdjun97.github.io/assets/images/post_img/etc/iphone-remote-development-environment-build/img_viewer.PNG" target="_blank" rel="noopener noreferrer">
  <img src="/assets/images/post_img/etc/iphone-remote-development-environment-build/img_viewer.PNG" alt="RealVNC Viewer 원격 접속 화면" style="display: block; width: 300px; max-width: 80%; height: auto;">
</a>  

**4. MacBook SSH 설정**  

macOS에는 SSH Server 기능이 기본으로 들어있어서 별도 설치는 필요하지 않았다.  
`시스템 설정 → 일반 → 공유 → 원격 로그인`을 켜고, 접근 가능한 사용자는 내가 실제로 사용할 계정 하나만 추가했다.  
iPhone에서는 SSH Client로 `Termius`를 사용했고, 아래 정보를 등록했다.  

- Address: MacBook의 Tailscale IP
- Port: 22
- Username: macOS 사용자명
- Password: macOS 계정 비밀번호

Cellular 상태에서 접속해보니 정상적으로 Mac 터미널이 열렸다.  

<a href="https://kdjun97.github.io/assets/images/post_img/etc/iphone-remote-development-environment-build/img_ssh.PNG" target="_blank" rel="noopener noreferrer">
  <img src="/assets/images/post_img/etc/iphone-remote-development-environment-build/img_ssh.PNG" alt="Termius SSH 접속 화면" style="display: block; width: 300px; max-width: 80%; height: auto;">
</a>  

> 참고: [Apple Remote Login](https://support.apple.com/guide/mac-help/allow-a-remote-computer-to-access-your-mac-mchlp1066/mac)

# 😭 트러블 슈팅

생각보다 RealVNC 설정에서 자잘하게 막히는 부분이 많았다.  

**1. `raspi-config: command not found`**  

Raspberry Pi 관련 글을 보고 아래 명령을 실행했다.   

```bash
sudo raspi-config
```  

그런데 명령을 찾을 수 없다고 나왔다.  
알고보니 내 장비는 Raspberry Pi OS가 아니라 Ubuntu 24.04 LTS였다.  
같은 Raspberry Pi라도 설치된 OS에 따라 설정 방법이 다르다.  
그래서 `raspi-config` 대신 Ubuntu의 GDM 설정을 수정해서 Wayland를 X11로 변경했다.  
요즘은 이런걸 잘 몰라도 AI로 트러블 슈팅이 빠르게 돼서 삽질하는 시간도 줄고 셋팅하는 속도도 많이 빨라졌음을 느꼈다.  

**2. `.deb` 파일 설치 실패**  

RealVNC 설치 파일을 다운로드한 뒤 아래처럼 실행했다.  

```bash
sudo apt install VNC-Server-7.18.0-Linux-ARM64.deb
```   

그러자 아래 오류가 발생했다.  

```text
E: Unable to locate package VNC-Server-7.18.0-Linux-ARM64.deb
```  

APT가 현재 폴더에 있는 파일이 아니라 Repository의 Package 이름으로 인식한 것이었다.  
로컬 파일이라는 것을 알려주기 위해 `./`를 붙이면 된다.  

```bash
sudo apt install ./VNC-Server-7.18.0-Linux-ARM64.deb
```  

아주 사소하지만 모르면 잠깐 멈추게 되는 부분…  
이것도 Linux를 잘 모르니 쪼끔 걸렸다. ~~아주 조금이긴 해~~ (Windows나 Mac은 보통 마우스로 하니....)  

**3. RealVNC 인증 방식 없음**  

MacBook이 RealVNC Devices 목록에는 정상적으로 보였다.  
그런데 접속하려고 하니 아래 오류가 발생했다.  

```text
RealVNC Connect Inbound has no authentication schemes configured.
```   

처음에는 Server가 실행되지 않은 줄 알았다.  
하지만 네트워크 문제가 아니라 Inbound 인증 설정이 비어있던 것이 원인이었다.  

Mac의 `Settings → Inbound → Security`에서 인증 방식과 VNC Device Password를 설정해서 해결했다.  

**4. 접속은 되는데 검은 화면만 출력**  

인증 문제를 해결하니 연결은 됐는데 화면이 까맣게 나왔다.  
이번에는 macOS의 화면 기록 권한 문제였다.  

`시스템 설정 → 개인정보 보호 및 보안 → 화면 및 시스템 오디오 녹음`에서 RealVNC 관련 항목을 허용했다.  

앱을 다시 실행하니 드디어 Mac 화면이 정상적으로 출력됐다. ~~나이스!~~  
화면 제어를 위해서는 손쉬운 사용 권한도 함께 필요하다.  

> 참고: [RealVNC macOS 권한 설정](https://help.realvnc.com/hc/en-us/articles/360002712837-Additional-setup-steps-required-for-RealVNC-Connect-on-macOS)

**5. Pi IP는 되는데 Mac IP는 안됨**  

Raspberry Pi는 Tailscale IP를 RealVNC에 입력하면 바로 접속됐다.  
그런데 MacBook의 Tailscale IP를 입력하면 접속되지 않았다.  
확인해보니 두 장비의 연결 방식이 달랐다.  

- Raspberry Pi: Direct Connectivity 활성화, 5900 Port 사용
- MacBook: Cloud Connectivity만 활성화

MacBook에서도 RealVNC Server가 동작하고 있었지만, IP 주소로 직접 연결받는 방식이 아니라 Cloud 연결만 가능한 상태였다.  
따라서 Mac은 IP를 입력하지 않고 Devices 목록에서 연결해야 했다.  

> 참고: [RealVNC Viewer와 Server 기본 개념](https://help.realvnc.com/hc/en-us/articles/38538874117533-RealVNC-Viewer-and-Server-Basics)

**6. MacBook 덮개를 닫으니 접속 불가**  

마지막으로 Mac의 상태에 따라 접속이 유지되는지 테스트했다.  

- 화면 잠금: SSH, VNC 모두 성공
- 일반 잠자기: SSH, VNC 모두 성공
- 노트북 덮개 닫기: SSH, VNC 모두 실패

노트북 덮개를 닫은 상태에서 RealVNC에는 아래 메시지가 나타났다.  

```text
RealVNC Server is not currently listening for cloud connections.
```  

덮개를 다시 열자 별도의 재시작 없이 SSH와 VNC가 자동으로 복구됐다.  
닫힌 상태에서도 사용하려면 추가 셋팅이나 장비가 필요할 수 있다.  
물론 찾아보긴 했는데, 아직 필요성을 크게 느끼지 못해서 나중에 넣어도 되는 부분이니 넘어가는걸로...  
일단 당장은 원격 접속이 필요한 동안에는 전원을 연결하고 덮개를 열어 두면 되니 나중에 알아보도록 하자.  

# 😎 최종 결과

최종 테스트 결과는 아래와 같다.  

| 연결 | 결과 |
|---|---:|
| iPhone Cellular → Raspberry Pi SSH | 성공 |
| iPhone Cellular → Raspberry Pi VNC | 성공 |
| iPhone Cellular → MacBook SSH | 성공 |
| iPhone Cellular → MacBook VNC | 성공 |
| MacBook → Raspberry Pi SSH | 성공 |
| MacBook → Raspberry Pi VNC | 성공 |
| Raspberry Pi 재부팅 후 SSH/VNC 복구 | 성공 |
| Mac 화면 잠금 및 일반 잠자기 | 성공 |
| Mac 덮개 닫힘 | 접속 불가, 보류 |

원래 원했던 원격 접속 환경은 얼추 모두 완성했다!  
이제 언제 어디서든 Raspberry Pi와 Mac에 원격으로 접속 및 제어가 가능해졌다.  

`보안 관련 정리`  

- 공유기에 SSH, VNC, MQTT Port Forwarding을 추가하지 않음  
- Raspberry Pi의 SSH와 VNC는 Tailscale 주소로 접속
- Mac Remote Login은 지정한 사용자만 허용
- VNC 인증 비밀번호 유지
- 문서에는 실제 IP, 사용자명, 비밀번호를 기록하지 않음

# 😝 느낀점 및 추후 할 일

처음에는 Tailscale만 설치하면 금방 끝날 것이라고 생각했다.  
실제로 네트워크 연결은 어렵지 않았는데 Wayland, RealVNC 구독, macOS 권한처럼 장치마다 확인할 부분이 조금씩 달랐다.  

그리고 VNC보다 SSH를 먼저 셋팅한 것도 좋은 선택이었다.  
중간에 뭔가 잘못되어도 SSH로 들어갈 수 있다는 사실만으로 마음이 편했다. ~~복구 수단은 중요하다…~~  

추후에는 보안을 좀 더 신경써보고 싶긴 한데... 일단은 써보면서 생각해봐야할 것 같다.  
어쨋거나 내가 원하는 목표를 정했고, 어떤 환경에서 돌아가고 어떻게 쓸지를 구상하고  
그걸 찾아보면서 설계하고 환경을 구축해봤다.  

이제.. 이걸 가지고 쓸만한 걸 만들 차롄데 그건 다음 포스팅의 나에게 맡기겠다.  
