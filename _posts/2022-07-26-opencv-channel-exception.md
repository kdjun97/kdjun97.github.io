---
title: "[C# OpenCV] OpenCvSharp.OpenCVException (템플릿 매칭시 발생한 에러)"  
excerpt: "Cv2.MatchTemplate 중, 발생한 에러"

categories:
  - Computer Vision
tags:
  - [Computer Vision, OpenCV, C#]

permalink: /computer-vision/opencv-channel-exception/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: "2022-07-26 20:00:00"
last_modified_at: "2022-07-26 20:00:00"
published: true

---  

### 🙄 에러 발생

Error: `OpenCvSharp.OpenCVException: (depth == CV_8U || depth == CV_32F) && type == _templ.type() && _img.dims() <= 2`   

C# OpenCV, 이미지 템플릿 매칭(MatchTemplate) 중 발생한 에러.  

```csharp
...
Mat mat = OpenCvSharp.Extensions.BitmapConverter.ToMat(picture);
Mat result = new Mat();
Mat target_img = Cv2.ImRead(@"img\target.jpg", ImreadModes.Grayscale);

// 템플릿 매칭
Cv2.MatchTemplate(mat, target_img, result, TemplateMatchModes.CCoeffNormed);

// 매칭 범위 지정
Cv2.Threshold(result, result, 0.8, 1.0, ThresholdTypes.Tozero);

Cv2.MinMaxLoc(result, out minval, out maxval, out minloc, out maxloc);

return (maxval >= threshold) ? true : false;
```

위와 같이 간단한 코드를 구현하였고, 원본 **src img**에서 **target_img**를 가지고 `template matching`을 시도하는 로직이었다.  
`Cv2.MatchTemplate`부분에서 에러가 났고, 왜 에러가 났는지? 어떻게 해결했는지? 공유하고자 한다.  

---  

### ✏️ Solved!  

결론부터 말하자면, 위 에러는 `Channel`이 맞지 않아 발생하는 에러이다.  
원본 이미지 `mat`은 `3-Channel(BGR)`인데, `target_img`는 `1-Channel(Grayscale)`이다.  
즉, 이 에러는 <u>템플릿 매칭 시, 채널이 맞지 않아 발생한 것. (+ 덤으로 프로그램 종료까지)</u>  

따라서, 위 코드에서 채널을 맞춰주면 된다.  
하지만, `MatchTemplate`같은 작업을 하는 경우 속도가 중요하다.  
원본 mat을 `Cv2.CvtColor(mat, mat, ColorConversionCodes.BGR2GRAY)` 함수를 이용하여 **Grayscale**로 바꾸자.  
이렇게 `1-Channel(Grayscale)`로 맞춰준다면 `3-Channel(BGR)` 보다 `연산 속도 향상`이 된다.  

이제 MatchTemplate 함수 이후 로직을 짜면 되겠다.  