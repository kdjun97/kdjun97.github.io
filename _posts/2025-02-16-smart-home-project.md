---
title: "[IoT] 라즈베리파이, 앱과 스마트 플러그를 사용한 스마트홈 프로젝트"  
excerpt: "swift, raspberry pi, smart plug로 가정집 스마트홈을 구축해보자"

categories:
  - IoT
tags:
  - [IoT]

permalink: /iot/smart-home-project/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2025-02-16 01:00:00
last_modified_at: 2025-02-16 01:00:00
published: true
---  

# 🤩 들어가기에 앞서...

> [이전 포스팅 참고: 기능 검증 단계](https://kdjun97.github.io/iot/swift-mqtt-test/)  
> [Smart Home Project Github Link](https://github.com/kdjun97/smart-home)  
> [MQTT | Shelly Technical Document](https://shelly-api-docs.shelly.cloud/gen2/ComponentsAndServices/Mqtt/)  
> [Shelly - RPC Protocol](https://shelly-api-docs.shelly.cloud/gen2/General/RPCProtocol)  

이전 포스팅에서 기능 검증은 완료했다.  
이제 본 프로젝트에 들어가보겠다.  

구상한진 얼마 안됐고, 내가 에너지 관련 회사를 다니고 있는데 내 집 에너지 모니터링도 내 환경에 맞춰서 할 수 있지 않을까? 라는 생각으로 본 프로젝트를 구상하게 되었다.  

이번 포스팅은 일지를 기록하는 느낌? 으로 작성될 것이다.  
더 자세한 내용은 내 깃헙에 코드로 올려놨으니 참고하면 될 것이다.  

---  

# 🤔 구상 및 설계  

**Flow**  

- Raspberry Pi5에 mosquitto broker 실행  
- smart plug 장비에 MQTT broker 설정 
    - smart plug는 특정 topic을 구독
    - smart plug는 내 broker의 특정 topic으로 publish (지원되는 기능)
- 앱은 Raspberry의 broker 서버로 붙음
    - smart plug의 특정 topic 구독 -> UI 대응
    - smart plug의 특정 topic 으로 publish (제어 가능)
- port forwarding을 사용하여 앱이 내부망 밖으로 벗어나도 정보를 주고받을 수 있게 대응

**구상도**  

![mqtt_flow](/assets/images/post_img/iot/smart-home-project/mqtt_flow.jpeg)   

해당 그림을 기반으로 환경 구성, 개발을 하면 될 것 같다.  

# 🤑 구매 목록  

- 라즈베리파이: broker 서버용  
- 미니 데스크탑 알루미늄 방열 케이스  
- Micro HDMI to HDMI   
- 샌디스크 울트라 32GB micro SD
- 스마트 플러그(Shelly Plus Plug S - F Type): 에너지 모니터링, 제어용  

# 🔌 Shelly 선택 이유?  

스마트 플러그를 사야했다.  
다양한 스마트 플러그를 찾아보았고, 고려한 조건은 아래와 같았다.  
**1.** MQTT 셋팅이 쉬운가?   
- 펌웨어 플래싱(Tasmota)을 필요로 하는가?  
- MQTT 설정을 지원해주는가?  

**2.** 한국 전원 플러그 유형과 맞는가?  
- 한국: Type C, Type F (220V, 60Hz)
- 미국: Type A, Type B (120V, 60Hz)
- 유럽: Type C, Type E, Type F (220~230V, 50Hz)  

**3.** 가격, 단종  
- 가격이 합리적이며, 단종되어서 못구하지는 않는가?  

**4.** 보안  
- 제품에 신뢰성이 있는가?

해당 1234번을 만족하는 제품이 있는지 여러 제품들을 찾아봤으며, 후보군들을 간추렸다.  

`sonoff S31`  
- Tasmota 펌웨어로 플래싱하면 MQTT 설정 가능  
- 납떔이 필요 (FTDI 어댑터 필요)  
- 스마트플러그를 분해해서 FTDI 어댑터 사용하여, 플래싱해야하기에 공수가 많이 듦
- 펌웨어 플래싱에 대한 자료가 많고, 분해 및 재조립이 쉬움
- 미국 type임
- 가격이 비교적 쌈
- ESP8266 칩 사용 

`shelly plug`  
- 가격 비쌈  
- shelly plug s (gen1)은 분해 조립에 대한 정보가 있는데, gen2는 없었음
- gen1은 단종
- gen2는 펌웨어 플래싱 하기 전 분해가 매우 어려움.
- gen2는 문서가 많이 없음
- ESP32 칩 사용
- 영국 F 타입 (한국과 호환 가능)
- 예쁨...
- 마지막에 찾은거지만, 따로 펌웨어 플래싱이 필요없는 것 같아 바로 결정

# 🏡 스마트홈 프로젝트 시작  

**실험했던 순서**  

**1.** Raspberry Pi5 환경 셋팅  
- Ubuntu 설치, 각종 라이브러리 설치  
- LAN 사용 -> Wi-Fi 연결   
    - 공유기에 LAN선 연결하는게 싫어서 Wi-Fi로 연결 

**2.** mosquitto 설정  
- broker 설정  
- conf 파일 설정  
- 사용자 인증 정보 설정 

**3.** 내부 통신 확인  
- python 코드로 pub, sub 작동 실험  
- mosquitto log 확인  
- 앱과도 통신 확인 ([저번 프로젝트 코드](https://github.com/kdjun97/swift-mqtt-test) 사용)  

**4.** 스마트 플러그 셋팅  
- broker 설정 셋팅  
- pub, sub 동작 확인  

**5.** 통신 확인  
- smart plug <-> broker <-> app 통신 확인  

**6.** public IP 테스트  
- app에서 내부망을 끊고(와이파이 끊고) 통신 확인  

---  

# 😝 어려웠던 점 느낀점  

일단, 라즈베리파이 Ubunut OS 설치에서 시간을 많이 뺏겼고,  
`mosquitt.conf` 파일 설정 및 설정 확인에서 시간을 좀 소요했다.  
나머지는 스무스하게 진행했다.  

내가 전체 환경, 기술에 대해 구상하고 조사하고 개발했던 프로젝트였다.  
아주 재밌었고 현재는 딱 전원 on/off까지 컨트롤이 가능하다.  
Shelly 공식 docs에서 정보들을 찾아봐서 기능을 더 추가하면서 이 프로젝트를 완성하고 싶다.(~~아직 미완성이지만 먼저 포스팅 올림)  