---
title: "[Flutter] Upload Image To MySQL DB (Using php)"
excerpt: "MySQL 서버에 이미지 업로드하기"

categories:
  - Flutter
tags:
  - [Flutter]

permalink: /flutter/flutter-upload-image-to-mysql/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-07-14 10:00:00
last_modified_at: 2022-07-14 10:00:00
published: true

---  

### 🙄 내가 겪은 이슈. 서버에 이미지 업로드

대부분 Flutter는 NoSQL 즉, Firebase를 많이 사용한다.  
이유는 Flutter 3.0 version 기준으로 Firebase가 공식적으로 지원이 되고,  
공식 문서에도 firebase 예제가 있기 때문.  

하지만 Flutter로 MySQL DB를 사용하는 경우도 적진 않다.  
실제로 MySQL과 NoSQL의 장단점을 가지고 어떤 DB를 사용할 것인지 택하기도 한다.  

나는 Flutter와 MySQL을 사용하여 인턴십에서 앱을 만들었었고, php file을 이용하여 서버에 접근하였다.  
이 기간 동안 겪었던 이슈 중 하나가 서버에 이미지 파일을 올리는 부분이었다.  

Flutter와 MySQL을 연동하는 예제는 firebase 예제에 비해 많이 없을 뿐더러,  
image를 서버에 업로드하는 예제는 찾기 힘들다.  

따라서, 그것들을 포스팅 하고자 한다.  

---  

### ✏️ Flutter 에서 MySQL DB 사용하기

우선, firebase는 plugin을 import하여 함수형태로 `collection`, `document`에 쉽게 접근이 가능하다.  
또한, 쿼리를 날릴 수 있으며, `StreamBuilder`를 통해 data를 observing 하기 편리하다.  

MySQL은 아쉽게도 쉽게 접근할 수 있는 plugin이나 package가 없는 것으로 알고 있다(만약 있다면 알려주세요...)  

따라서, MySQL DB에 접근하려면 아래와 같은 작업을 거쳐야한다.  

**1.** Server에 php파일을 올린다.  
**2.** 플러터 앱 내에서 서버에 있는 php파일에 `http.post` 요청을 보낸다.  
**3.** php file이 DB에 쿼리를 날리고 결과를 받는다.  
**4.** 그 결과를 앱이 받아들인다.  
**5.** 그 후 logic 처리  

아주 간단히, `USER__INFO`라는 table에 user 정보가 담겨져 있고, `sign in` 하는 쿼리를 예시로 들어보자.  

`conn.php`  -> server와 connection하는 파일  

```php
<?php
   header('Content-Type: text/html; charset=utf-8');
   // server, user, pwd, db_name
   $connect = new mysqli("localhost", "[USER]", "[PASSWORD]", "[DB_NAME]");

   // Check Connection
   if ($connect) {
      echo "Connection Success!";
   }
   else {
      echo "Connection Failed";
      exit();
   }
?>
```

`sign.php` -> user sign php 파일  

```php
<?php	
	include 'conn.php';
	
	$username = $_POST['USER_ID'];
	$password = $_POST['USER_PWD'];
	
	$queryResult=$connect->query("SELECT * FROM USER_INFO WHERE USER_ID='".$username."' and USER_PWD='".$password."'");

	$result = array();
	
	while($fetchData = $queryResult->fetch_assoc()) {
		$result[] = $fetchData;
	}

	echo json_encode($result);
?>
```

위 php파일을 FTP(File Transfer Protocol) 프로그램 `FileZilla`를 이용하여 서버에 올리자.(나는 Filezilla를 사용하여서 언급한 것이지, 다른 프로그램을 사용해도 무방)  
이제 앱 내에서 http.POST방식으로 서버에 올라가있는 sign.php를 호출한다.  
물론 POST Method를 날릴 떄, body도 넣어주는 것을 잊지 말자.  
앱 내 코드는 아래와 같다.  

```dart
import 'package:http/http.dart' as http;
import 'dart:convert' as convert;

// http body
var body = {
  "USER_ID" : TextEditingController.text,
  "USER_PWD" : "123123"
};

final uri = Uri.parse("http://yourserver.com/sign.php");
final response = await http.post(uri, body: body);
var temp = convert.json.decode(response.body);

if (temp.length == 0) {
  print("로그인 정보 없음");
}

else {
  print("로그인 성공!\n");
  // TODO
}
```

위 코드에 로직을 첨가한다면 MySQL DB로 접근하여 멋진 로그인 로직을 만들어낼 수 있을 것이다.  

---  

### 🌴 Upload Image to Server

DB 쿼리의 대표적인 `CRUD(Create, Read, Update, Delete)`가 있다.  
그러한 쿼리문들은 위 php파일에 담으면 되는데, 이미지 파일은 어떻게 서버에 올릴 것인가?  
이미지는 string이 아니기 때문에, 기존 `CRUD` 작업과는 조금 다른 방식으로 php에서 처리될 것이다.  

이제부터, flutter를 이용하여 서버에 이미지 파일이 어떻게 올라가는지 코드를 통해 알아보자.  

크게 우리는 두 가지 과정을 거칠 것이다.  
**1번:** php파일을 이용하여 Image를 Server에 올림, **2번:** 올린 path를 DB에 저장  
2번은 위의 내용을 응용하면 되기 때문에(`INSERT INTO 사용`) 1번만 다루겠다.  

바로 코드단으로 들어가보자.  
conn.php는 위의 코드를 재활용하여 쓰자.  

`upload_image.dart`  

```dart
import 'package:http/http.dart' as http;
import 'dart:convert' as convert;
import 'package:image_picker/image_picker.dart';

static const UPLOADIMAGE = 'http://[나는닷홈썼음].dothome.co.kr/php/test.php';

class UploadImageToServer {
  /// image server에 upload
  Future<void> uploadQuery(XFile pickedImage) async {
    var uri = Uri.parse(HttpUrl.UPLOADIMAGE);

    var request = http.MultipartRequest("POST",uri);
    var pic = await http.MultipartFile.fromPath("image", pickedImage.path);

    request.files.add(pic);
    var response = await request.send();

    if (response.statusCode == 200) {
      print("image uploaded");
    }else{
      print("uploaded faild");
    }
  }
}

// ImagePicker를 아래와 같이 사용하였다.
// button을 만들어 onPressed()로 처리하였음
late XFile pickedImage;
final ImagePicker _picker = ImagePicker();
imageController.pickedImage = (await _picker.pickImage(source: ImageSource.gallery))!;
```  

위 코드를 활용하면 앱에서 php 파일로 image를 body에 태워 호출할 것이다.  

`test.php`  

```php
<?php
   include '../connection/conn.php';
   
   $image = $_FILES['image']['name'];
   $imagePath = '../../images/profile/'.$image;
   $tmp_name = $_FILES['image']['tmp_name'];

   move_uploaded_file($tmp_name, $imagePath);
   
   $connect->query("INSERT INTO image_storage (filename) VALUES ('".$image."')");
   
   if ($queryResult === TRUE) {
      echo "Image insertion success";
   } else {
      echo "Error: " .$connect->error;
   }
?>
```  

위 코드로 image를 연결된 서버에 올리고 그 path를 `image_storage table`에 `INSERT` 할 수 있다.  

위 과정으로 MySQL, php와 flutter를 이용하여 서버에 image path를 올렸다.  
이제 이 path 정보를 다른 table에 넣어줌으로 우리가 원하는 많은 작업들을 할 수 있을 것이다.  

---  

### 😎 끝으로...  

이번 예제는 웹에서 검색하여 찾기가 매우 힘들어 직접 포스팅을 하였다.  
Flutter로  MySQL 서버에 이미지를 업로드하는 예제였고, 위의 코드들을 응용하면 충분히 원하는 결과를 얻을 수 있을 것이다.  

위 과정에서 비동기식 처리는 잘 고민하여 적용하자.  