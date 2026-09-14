---
title: "[IoT] MQTT 상태와 오류를 Slack으로 받아보기"
excerpt: "라즈베리파이의 MQTT 상태와 오류를 Slack에서 확인해보자"

categories:
  - IoT
tags:
  - [IoT, Raspberry Pi, MQTT, Python]

permalink: /iot/receive-mqtt-log-with-slack/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2026-09-14 16:00:00
last_modified_at: 2026-09-14 16:00:00
published: true
---

# 🤔 왜 만들었을까?

[지난 스마트홈 프로젝트](https://kdjun97.github.io/iot/smart-home-project/)에서 라즈베리파이를 MQTT Broker로 사용하고, Shelly 스마트 플러그를 앱에서 원격으로 제어할 수 있게 만들었다.  
그러다 문득 그런 생각이 들었다.~~(걍 사실 필요해서...)~~  
밖에 있을 때 연결이 끊기거나 오류가 나면 어떻게 알 수 있을까?  
원래 이런 상황을 대비해서 직접 라즈베리파이에 들어가서 뭔갈 보려고 했다.  
[지난 포스팅 참고](https://kdjun97.github.io/etc/iphone-remote-development-environment-build/)  

하지만 이렇게 들어가서 확인하는 것도 이젠 귀찮고 일이다.  
우린 핸드폰을 매일 들고 다니지 않는가?  
더 쉽고 빠르게 확인할 수 있는 좋은 방법으로 모바일 Slack 알림으로 로그를 받는 구조를 설계하고 개발해봤다.  
그리고 지난 포스팅에서 한 말이 있다.  
더 많은 기능들을 이제 넣을 예정이기 때문에 지금 있는 작은 기능들에 미리 로그를 달아놔야 추후 기능을 추가할 때마다 오류 로깅을 더 쉽게 할 수 있을 것 같았다.  

# 🔧 어떻게 만들었을까?

라즈베리파이에서는 **Mosquitto**가 MQTT Broker로 동작한다.  
별도의 **Python 알림 서비스**가 Shelly의 MQTT 메시지와 Mosquitto 로그를 읽고, 필요한 내용을 **Slack Incoming Webhook**으로 보낸다. 알림 서비스는 `systemd`로 실행되도록 해뒀다.  

Python 서비스에서는 `mosquitto_sub`로 Shelly의 MQTT Topic을 구독하고, `journalctl`로 Mosquitto 로그를 실시간으로 읽는다.  
들어온 메시지를 분석해 스마트 플러그의 연결 상태, 스위치 ON/OFF, 전력 등의 상태 변화와 MQTT 클라이언트 연결·해제, Broker 오류만 골라 Slack으로 전송하는 방식이다.
상태 메시지가 너무 자주 쌓이지 않도록 전력이나 온도 같은 값은 일정 이상 변했을 때만 보낸다.  
같은 알림의 중복 전송도 줄이고, Slack 전송에 실패하면 재시도하도록 해뒀다.  
아래는 실제 알림을 받았을 때의 슬랙 창을 캡처해봤다.  

<a href="https://kdjun97.github.io/assets/images/post_img/iot/receive-mqtt-log-with-slack/img_slack.PNG" target="_blank" rel="noopener noreferrer">
  <img src="/assets/images/post_img/iot/receive-mqtt-log-with-slack/img_slack.PNG" alt="Slack 알림" style="display: block; width: 400px; max-width: 80%; height: auto;">
</a>  

지금은 **라즈베리파이 → Slack** 단방향 알림이다.  
문제가 생긴 걸 확인하면 SSH나 VNC로 라즈베리파이에 접속해서 살펴볼 생각이다.

일단 밖에서도 내 스마트홈에 무슨 일이 생겼는지 알 수 있는 눈을 하나 달아둔 셈이다.  
개발하다보니 디버깅이 매우 중요하다는 것을 느낀다.  
기능이 늘어날 때마다 이런 알림도 하나씩 붙여봐야겠다.  