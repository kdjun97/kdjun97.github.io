---
title: "[Arduino] ESP32 BLE + 앱 연동 기초 예제(1)"
excerpt: "ESP32와 앱을 연결하고 데이터 주고 받기 예제"

categories:
  - IoT
tags:
  - [IoT, Arduino]

permalink: /iot/arduino-ide-setting/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: "2022-05-16 22:10:00"
last_modified_at: "2022-05-16 22:10:00"
published: true
---

🔥 총 3편으로 구성된 예제이다.  
{: .notice--warning}

# 🎒 Arduino IDE Setting

`준비물`  

보드 : ESP32 Devkit V1  
Arduino IDE : 1.8.19 Version  

**1.** `파일 → 환경설정`  

![Untitled](/assets/images/post_img/arduino-ide-setting/Untitled.png)  

**2.** `추가 보드 매니저 URL 추가 후 확인 (아래 링크 붙여넣기)`  

> https://dl.espressif.com/dl/package_esp32_index.json  

![Untitled](/assets/images/post_img/arduino-ide-setting/Untitled1.png)  
![Untitled](/assets/images/post_img/arduino-ide-setting/Untitled2.png)  

**3.** `보드 매니저 클릭`  

![Untitled](/assets/images/post_img/arduino-ide-setting/Untitled3.png)  

**4.** `esp32를 사용하기 위해 검색 후 설치`  

![Untitled](/assets/images/post_img/arduino-ide-setting/Untitled4.png)  

![Untitled](/assets/images/post_img/arduino-ide-setting/Untitled5.png)  

**5.** `DOIT ESP32 DEVKIT V1 설정`  

![Untitled](/assets/images/post_img/arduino-ide-setting/Untitled6.png)  

**6.** `Upload Speed 115200`  

(코드 측과 셋팅 값을 맞추기 위함)  
    
![Untitled](/assets/images/post_img/arduino-ide-setting/Untitled7.png)  

**7.** `Set Port`  

![Untitled](/assets/images/post_img/arduino-ide-setting/Untitled8.png)  

(위 그림은 ESP32 USB 연결하지 않은 상태의 포트)  

![Untitled](/assets/images/post_img/arduino-ide-setting/Untitled9.png)  

(위 그림은 ESP32 연결한 상태에서의 포트)  

⚠️ [2편에서 이어집니다](https://kdjun97.github.io/iot/arduino-ble-testing/)  
{: .notice--info}  