---
title: "[Arduino] C# WinForm과 Arduino Leonardo 보드의 시리얼 통신"
excerpt: "C# 으로 아두이노 레오나르도 보드와 시리얼 통신을 해보자"

categories:
  - IoT
tags:
  - [IoT, Arduino, C#]

permalink: /iot/arduino-leonardo-with-csharp/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-06-22 10:00:00
last_modified_at: 2022-06-22 10:00:00
published: true

---  

## 😂 시작 전... 잡담....

> 결과물 영상 링크 : [Youtube Link](https://www.youtube.com/shorts/wZSNG9kOfeg)  

나의 블로그를 보다보면 시작 전 잡담을 하는 부분들이 상당수 존재한다.  
그렇다고 이렇게 얘기를 하는 부분이 영양가가 없음은 아니라는 것을 알았으면 한다.  

`IoT??`  
소프트웨어적으로 솔루션을 도출해내는 방법은 많을 것이다.  
물론 굉장히 필요한 부분이라고 생각한다.  
하지만 요즘은 소프트웨어보단 하드웨어에 관심이 많아졌다.  
실제로는 향후 이러한 IoT 기술들이 굉장히 필요해질 것이고, 많이 사용될 것이라고 생각된다.  

물론 이러한 예시로 운동기구에 트래커를 부착해 그것에 관련된 서비스를 낼 수도 있겠고, 주변의 밝기를 감지하여 자동으로 조명을 on/off 해주는 시스템 등이 개발될 수 있겠다.  

이러한 솔루션을 내기 위해선 소프트웨어 처리를 잘 하는 것도 중요하지만, 하드웨어 역시 중요하다.**(하드웨어를 통해 원하는 데이터(정보)를 주고받을 수 있어야 한다)**  

따라서, 나는 그 하드웨어와 소프트웨어의 융합적인 부분에 대해 관심을 가지고 관련해서 작은 프로젝트를 해보고자 한다.  
내가 목표로 하는 프로젝트의 밑거름이 되는 작은 기능을 하나 구현할 것이며, 그 기능은 <u>키보드 입력</u>과 관련되어있다.  

지금 이 프로젝트는 c#으로 진행할 것이며, 추후에 `lazy-manager4`에 이 기능을 넣으려 한다.  

즉, `lazy-manager4`를 위한 **기능 검증 단계** 라고 보면 될 것 같다.  

역시나 서론이 길었다. 본론으로 들어가보도록 하자.  

---   

### ❗ Serial and Parallel 통신

나의 목표중 하나는 `레오나르도 보드로 C# Winform과 시리얼 통신`을 하는 것이다.  
또한 `하드웨어 신호 처리(키보드)`의 목표가 있다.  

그렇다면 `Serial 통신`은 무엇인가??  
그리고 상반되는 `Parallel 통신`은 무엇인지 알아보자.  

- `Serial 통신`
  - 순차적으로 데이터를 **한번에 하나**의 비트만 전송
  - <u>노이즈로부터 병렬 방식보다 보다 자유로움</u>(양단간 통신 거리가 먼 경우도 사용 용이)
  - ASCII로 ‘A’는 65. 이것을 2진수로 변환하면 `0100 0001`이고, 이 데이터를 직렬화 하여 한 번에 한 비트씩 전송하는 것이 <u>Serial 통신의 예시</u>이다.
  - 직렬 통신이기 때문에, <u>하나의 선</u>만으로 통신을 할 수 있고 <u>가격이 저렴</u>하다는 장점 존재
  - 병렬 통신보다 속도가 느림
- `Parallel 통신`
  - 여러 개의 병렬 채널 위로 **동시에 여러 개의 데이터 신호**를 보내는 방식
  - <u>양단간 통신 거리가 먼 경우에는 사용 어려움</u>(통신 거리가 길어질 경우 선들 역시 길어져야 함 → 비용 발생 + 노이즈 발생)
  - 0100 0001이란 다수의 비트를 한꺼번에 전송한다. 따라서, <u>데이터를 빠르게 전송 가능</u>하지만 <u>선을 많이 사용한다는 단점이 존재</u>한다.
- 이해를 돕기 위한 사진  
![Serial_Parallel](/assets/images/post_img/arduino-leonardo-with-csharp/Untitled.png)  

따라서 우리는 `노이즈가 적고`, `값이 저렴`한 <u>시리얼 통신</u> 방식을 채택하여 프로젝트를 진행할 것이다.  

> ❓ 출처   
> [https://how-to-make-a-quadcopter.tistory.com/1](https://how-to-make-a-quadcopter.tistory.com/1)   
> [직렬(Serial) 통신과 병렬(Parallel) 통신이란? 개념 정리 - Easy is Perfect (melonicedlatte.com)](http://melonicedlatte.com/2020/06/19/140700.html)  

---

### 🛹 Leonardo Board를 사용한 이유?

그렇다면 수 많은 보드 중 왜 `레오나르도 보드`를 이용하였는가?  
각 보드들은 <u>저마다의 고유한 특성들</u>을 가지고 있고, 레오나르도 보드 역시 그렇다.  

이 보드의 경우, **PC와 연동하여 키보드나 마우스같은 가상 직렬 포트로 인식되어 키보드, 마우스 컨트롤에 용이하다는 장점이 존재**한다.   
즉, 키보드나 마우스 같은 **HID(Human Interface Device)**로 취급이 되기 때문에, <u>하드웨어적인 키, 마우스 처리가 가능</u>하다.   

하드웨어 신호, 소프트웨어 신호를 다 다루기엔 글이 길어지기 때문에, 쉽게 요약을 하겠다.  

나는 이미 lazy-manager3에서 소프트웨어 신호를 처리한 바 있다.(키보드, 마우스 제어)  
그리고 이번 프로젝트의 <u>최종 목표</u>는 `'보드를 이용하여 하드웨어 신호를 보내보자 (사용자가 직접 키보드를 입력한 효과를 내보자)'`이다.  
따라서, `H/W 신호 처리`를 위해 `Leonardo Board`를 이용하게 되었다고 요약할 수 있겠다.  

여담이지만 추후 이것을 활용하여 키보드를 하나 제작하거나 조이스틱을 제작할 생각도 있다.(이걸 만들면 세계에서 하나 뿐인 나만의 키보드가 만들어지는 것이다!)  

---

### 🙄 c# WinForm 구성 및 Serial 통신

`Form 요소들 구상`  

Form에는 <u>보드 연결</u>과 <u>해제</u>를 위한 `Button`이 필요하다.  
또한, 현재 보드의 상태를 알 수 있는 `TextBox`가 필요하고,  
Form이 Load되었을 때, 연결 가능한 port를 보여주는 `ComboBox`가 필요할 것이다.  
이것으로 Serial 통신에 관한 Form 구성 요소들은 끝이 났고, 나머지 `Button`이나 `Text`들은 <u>S/W 신호 처리</u>를 위한 구성 요소들이다.  

`완성된 Form`  

![WinForm](/assets/images/post_img/arduino-leonardo-with-csharp/winform.jpg)  

`초기 포트 설정`  

```csharp
using System.IO.Ports;  //시리얼통신을 위함
private void Form1_Load_1(object sender, EventArgs e)
{
  // Form이 Load될 때, 연결 가능한 Serial Port를 보여줌.
  comboBox1.DataSource = SerialPort.GetPortNames(); 
}
```

`보드 연결`  

```csharp
// 보드 연결
private void button4_Click(object sender, EventArgs e)
{
    try
    {
        if (!serialPort1.IsOpen)  // Serial Port가 열려있지 않다면,
        {
            serialPort1.PortName = comboBox1.Text;  // Serial Port Name = ComboBox1.Text
            serialPort1.BaudRate = 14400;  //BaudRate 변경(셋팅)
            serialPort1.DataBits = 8;
            serialPort1.StopBits = StopBits.One;
            serialPort1.Parity = Parity.None;

            serialPort1.DtrEnable = true;
            serialPort1.RtsEnable = true;
            serialPort1.DataReceived += new SerialDataReceivedEventHandler(serialPort1_DataReceived);

            serialPort1.Open();  // Open Serial Port, 이 부분에서 연결

            textBox8.ForeColor = Color.Blue;
            textBox8.Text = "ON";
            comboBox1.Enabled = false;  //COM포트설정 콤보박스 비활성화
        }
        else  //시리얼포트가 열려 있으면
        {
            textBox8.ForeColor = Color.Green;
            textBox8.Text = "Connected!";
        }
    } catch (Exception eMsg)
    {
        Debug.Print(eMsg.Message);
    }
}
```

`보드 연결 해제`  

```csharp
// 보드 연결 해제
private void button5_Click(object sender, EventArgs e)
{
    try
    {
        if (serialPort1.IsOpen)
        {
            serialPort1.Close();  // SerialPort 닫기

            textBox8.ForeColor = Color.Red;
            textBox8.Text = "OFF";
            comboBox1.Enabled = true;
        }
        else  // If Serial Port closed
        {
            textBox8.Text = "OFF";
        }
    } catch (Exception eMsg)
    {
        Debug.Print(eMsg.Message);
    }
}
```

Data가 들어왔을 때, 처리해주는 함수를 끼우는 부분이 중요하다고는 하지만, 이 프로젝트에서는 Board에서 data를 받지 않을 것이기 때문에 필요하진 않다.  
하지만 중요하다고 하니 아래에서 다뤄는 보겠다.  

`Data 수신 파트`   

![setting](/assets/images/post_img/arduino-leonardo-with-csharp/setting.jpg)  

```csharp
private void serialPort1_DataReceived(object sender, SerialDataReceivedEventArgs e)  // 보드에서 날아오는 데이터에 반응
{
  this.Invoke(new EventHandler(ReceivedDataControl));  // main thread와 received thread의 충돌 방지를 위해 Invoke를 사용한다고 함.
}

private void ReceivedDataControl(object s, EventArgs e)  // 실제 보드에서 날아오는 데이터 처리 로직
{
  // serialPort1.ReadByte() 를 이용, 원하는 대로 formatting하여 사용
  // 원하는 대로 작성
}
```

`Data 송신 파트`   

이 부분은 버튼을 클릭시, 처리하게 하지 않고, 키보드 입력을 감지하여 데이터를 날리게 바꾸었다.  
원래는 `후킹`을 통해 하려고 하였으나, `RegisterHotkey`라는 함수를 써서 처리를 하였다.  
즉, 키를 감지하여 해당하는 키가 감지되면 `SerialPort.Write()` 명령어를 수행하게 된다.  

```csharp
// 시리얼 데이터 송신 부분
serialPort1.Write("a");
```

`요약`  

이 프로젝트의 데이터 흐름을 간단하게 그림으로 표현해보았다.  

![flow](/assets/images/post_img/arduino-leonardo-with-csharp/flow.JPG)  

이로써 WinForm 부분은 완성이다.  
이제 Arduino code를 작성한 뒤, 보드에 업로드를 하고 실험을 해보면 될 것이다.  

---

### 📎 Arduino IDE

**Leonardo Board**를 사용하면 `keybaord H/W 신호 처리`가 가능하다고 하였다.  
바로 직전의 Flow대로라면 Form에서 S/W신호를 보드에 날리는데, 이것에 대한 처리를 해주는 부분을 만들어 보자.  

우리가 해야할 일은 간단하다.   
`보드에 데이터가 들어왔을 때, keyboard event를 발생시키면 된다!`  

`Arduino code`  

```cpp
#incldue "Keyboard.h"

char buffer;

void setup() {
  Serial.begin(14400); // Form과 BaudRate를 맞춰준다.   
}

void loop() {
  if (Serial.available() > 0) {
    buffer = Serial.read();
    if (buffer == 'a') {
      Keyboard.press('b');
      Keyboard.release('b');
    }
}
```

이 코드를 보드에 업로드하면 끝이다.  
굉장히 쉽지 않은가?  

위 코드는 간단하게, a라는 신호를 받게되면, b를 입력하게 만들어져있다.  
물론 a도 동시에 처리될 수 있기 때문에, hooking을 사용하여 사용자의 input은 무력화 시킨다면 a키 입력을 b로 바꿀 수 있게 될 것이다.  

이를 응용하면 충분히 재밌는 기능을 만들 수 있다.  
이번 포스팅에서는 원리 위주로 작성을 하였으며, `H/W 신호를 보낼 수 있다!` 를 보여주었다.  

추후 `Lazy Manager4` 포스팅에 추가될 기능 검증을 완료하였고, 이 기능은 기존 Lazy Manager 기능에서 S/W 신호를 다루는 부분을 H/W로 바꾸었다고 보면 된다.  

이번 프로젝트는 아두이노 보드와 c# Form간에 시리얼 통신을 해보는 굉장히 흥미로운 프로젝트였다.   