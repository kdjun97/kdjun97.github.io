---
title: "[MQTT] Python Mosquitto와 iPhone에서의 MQTT 통신 테스트"  
excerpt: "Mosquitto와 iPhone에서 MQTT 통신 테스트, 더 나아가 CocoaMQTT 라이브러리 테스트"

categories:
  - IoT
tags:
  - [IoT]

permalink: /iot/swift-mqtt-test/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2025-02-08 10:00:00
last_modified_at: 2025-02-08 10:00:00
published: true
---  

# 🦟 MQTT 테스트  

[Github Link](https://github.com/kdjun97/swift-mqtt-test)  

본 글에서는 실험했던 자세한 내용은 다루지 않겠다.  
위 Github 링크에서 실험했던 코드와 설명을 README에 작성하였으니 그것을 참고하면 될 것이다.  
~~대충 하긴 했지만 핵심 정보들은 다 들어가있을 것이다.~~  

이 검증 프로젝트를 하게 된 계기가 MQTT로 iPhone과 통신하는 환경을 만들고 더 나아가 스마트홈을 구축할 수 있지 않을까? 라는 생각에서 비롯되었다.  
현재 검증은 완료된 상태이므로, 몇 가지 준비물 셋팅을 마친 후 프로젝트 시작을 할 예정이다.  

사실 Github에만 정리를 하는 것 보단 bridge역할을 해 줄 무언가가 필요하지 않을까? 라는 생각에 블로그 글도 오랜만에 작성해본다.  

---  

# 😎 스마트홈 프로젝트 구상

그냥 대충 적어보는 스마트홈 프로젝트 구상은 아래와 같다.  

**Broker**  
Raspberry Pi를 Broker로 돌림  
여기서 Python **mosquitto**로 broker 설정을 셋팅하고 broker를 돌릴 것이다.   

**장비**  
장비 역시 MQTT 통신이 가능한 장비를 살 것이다.  
- 스마트플러그를 활용할 예정  
- 스마트플러그의 MQTT 셋팅을 좀 만진다면 될 듯  

**핸드폰**  
기본적으로 모니터링 하고, control한다.  
모니터링은 특정 topic subscribe하면 될 것이고,  
control은 특정 topic에게 publish하면 될 것 이다.  

그럼, 장비에서 특정 topic을 subscribe하고 있다가, 감지되면 control 바꿔주면 제어가 된다.  

**장거리 통신**  
이렇게 되면, Raspberry Pi의 브로커를 서버로 쓸 것이기 때문에, Local(Private IP)에서밖에 되지 않을 것이다.  
다시 말해서, 와이파이 내부망 안에서만 작동할 것인데, 이를 port forwarding으로 public IP로 유도해보면 될 것 같은데...  
보안 문제만 잘 해결하면 멀리서도 public IP로 port forwarding으로 내 공유기를 찾아 들어올 수 있지 않을까 생각되고 이 이론이 어느정도 맞다고 생각하여 프로젝트를 시작할 생각이다.  

실제로 스마트플러그와 Raspberry Pi는 다 사놓은 상태이다.  
Rasbperry Pi가 요즘 잘 나와서 본체처럼 조립을 할 수 있다.  
조립부터 시작해야지...  