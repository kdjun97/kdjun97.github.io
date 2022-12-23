---
title: "[Flutter] Local DB Hive 예제"  
excerpt: "플러터에서 Local DB를 사용해보자"

categories:
  - Flutter
tags:
  - [Flutter]

permalink: /flutter/flutter-hive/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-12-22 10:00:00
last_modified_at: 2022-12-22 10:00:00
published: true
---

# ✔️ Local DB Hive

개발을 하다 보면 `Local Database`가 필요한 순간이 존재하기 마련이다.  
`MySQL`, `Firebase` 등의 DB를 사용하는 것이 아닌, 말 그대로 내 local에서 DB를 사용할 수 있다.  
아래 포스팅에서 만날 `Hive`를 쓰면 말이다.  

본문에서 `Hive`의 패키지 설치 및 사용법에 대해 알아보도록 하자.  
참고로 Hive는 공식 홈페이지에서 **Fast, Enjoyable & Secure NoSQL Database**라 언급되어있다.  
빠르고, 편리하고, 안전하며 NoSQL 기반 DB란다.  
Key-Value 형태로 사용할 수 있고, SQLite보다 성능이 뛰어나다.  
또한, 의존성이 없어 App, Desktop, Web에서도 사용이 가능하다고 한다.  
더 자세한 것은 아래 공식 홈페이지를 참고하자.  

[공식 홈페이지](https://pub.dev/packages/hive)  

---  

# ❓ Usage

Hive의 사용법을 알아보자.  
1. 패키지 설치
1. Hive Initialize
1. OpenBox
1. Use Hive(DB)

위 과정에서 Custom Model을 사용한다면 2번에 custom Model register 과정도 추가가 된다.  
자세한 것은 아래에서 다뤄보겠다.  

---  

# 📦 Install Package

[pub.dev](https://pub.dev/)  

위의 굉장히 친숙한 pub.dev 사이트로 들어가 package를 다운받도록 하겠다.  

```yaml
dependencies:	
  hive: ^2.2.3 # for local database NoSQL
  hive_flutter: ^1.1.0 # for local databaes NoSQL

dev_dependencies:
  hive_generator: ^1.1.0 # for hive generator
  build_runner: ^2.0.4 # for hive generator
```  

이 4개의 package들을 설치한다.  
가장 최근이면서 stable한 version을 설치하면 되겠다.  
`dev_dependencies` 아래의 2줄은 model에 대해 자동으로 build해줄 generator와 runner에 대한 부분이다.  
Custom Model을 위해 이 generator와 runner를 설치해준다.  
`dependencies` 아래 2줄은 실제 local db의 접근에 관련된 부분이다.  

---  

# 🤪 Init

`main.dart`  

```dart
// main.dart 
Future<void> main() async {
  await Hive.initFlutter();
  Hive.registerAdapter(PagingModelAdapter()); // Paging 관리하는 어댑터 추가
  Hive.registerAdapter(ImageModelAdapter()); // Camera Mission을 위한 Image 관리하는 어댑터 추가
  runApp(MyApp());
}
```  

내가 사용했던 코드의 일부를 가져왔다.  

Hive를 사용하기 위해선 main.dart에서 initialize를 해주어야 한다.  
~~마치 Firebase를 사용하기 위해 init을 해주는 것과 같다.~~  

---  

# 🙄 Custom Model

또한, custom model을 추가할 수 있다.  
Hive는 int, String, List, DateTime 등의 type들을 지원한다.  
하지만, custom model을 만드는 경우가 굉장히 많다.  
Custom model은 아래와 같은 상황에서 사용할 수 있다. 

```dart
UserModel userModel = new UserModel(age: 10, name:"철수");
HiveDB.add(userModel); // Local DB에 userModel 객체 바로 넣기.
```

이 때, UserModel이라는 type이 우리가 만들어준 type이므로, Adapter를 통해 커스텀 타입을 알려주어야 한다.  


```dart
// file_name : user_model.dart
import 'package:hive/hive.dart';

part 'user_model.g.dart';

@HiveType(typeId: 0)
class UserModel {
  @HiveField(0)
  int age; // 나이

  @HiveField(1)
  String name ; // 이름

  // Constructor
  UserModel({
    required this.age,
    required this.name,
  });
}
```  

위와 같은 model class를 생성했다고 가정하자.  
이러한 상황에서 우리가 만든 Custom model을 hive가 알기 쉽도록 TypeAdapter에 작성하여 등록 해주어야 한다.  

위 코드에서 line 3의 part 부분이 이해가 가지 않을 수 있다. 
이것은 위에서 `dev_dependencies`의 runner가 대신 만들어준다.  
따라서, 위와같이 경로만 잘 설정해주자.  

model을 만들고(위 UserModel) terminal에서 build_runner를 실행시킨다.  
`$ flutter packages pub run build_runner build`  

그럼 자동으로 **user_model.g.dart** 파일이 생성된다.  
이것이 `TypeAdapter`이다.  

이것을 적용시키기 위해선 아래와 같이 main.dart에 registerAdpater 작업을 해주면 된다.  

```dart
// main.dart
Future<void> main() async {
  await Hive.initFlutter();
  Hive.registerAdapter(UserModelAdapter()); // User 관리하는 어댑터 추가
}
```

실제로 model을 만들어 위와 같이 작업을 많이 하기 때문에 이 방법도 알아야하고, 단순히 int type 하나를 다루는 것이라면 어댑터 등록의 과정은 필요가 없다.  

`HiveType`  

class 위에 `@HiveType(typeid: 0)`  
이런식으로 명시되어있는 것을 볼 수 있다.  
이는 custom model 클래스를 명확히 하는 행위이다.  
또한, typeid는 unique해야한다.  
이 unique한 id값을 가지고 Hive는 이 클래스가 TypeAdapter라 인식하게 된다.  
typeid는 **0~223**의 값이 허용된다고 한다.  

`HiveField`  

각 field에 `@HiveField(field_num)`와 같이 field_num를 명시해준다.  
field_num에는 **0~255** 사이 값이 허용된다.  

나는 이 부분역시 unique하게 해주었다.  
정확히는 검색이 더 필요할 것 같다.  

---  

# 😒 Hive Usage

자 이제 Hive를 사용하기 위한 사전 작업은 끝났다.  

NoSQL 기반이기 때문에, 유연하게 사용할 수 있고, DB에 write, read하는 방법을 소개하겠다.  

`Create Table`  

DB Table을 생성한다고 보면 된다.  
예를 들면 User라는 Table을 생성한다고 보면 된다.  

Hive는 모든 것이 Box의 개념이다.  
따라서 Box라는 용어를 사용하고, table을 생성하는 부분은 아래와 같이 한다.  
생성보다는 Table을 사용하기 위한 Init 과정이라 보면 더 이해가 쉬울 것이다.  

미리 table을 만들어놓고 data를 넣어놓은 경우, 다시 openBox를 할 때는 덮어씌우는 것이 아니고 table을 사용하기 위해 init한다는 말이다.  

```dart
import 'package:hive_flutter/hive_flutter.dart';

Box<dynamic> aBox = await Hive.openBox('userTable');
```

데이터를 읽기는 아래와 같다.  
만약 존재하지 않는 key를 조회하면 `null`이 반환된다.  
keyword는 `get()`이다.  

`Read`  

```dart
import 'package:hive_flutter/hive_flutter.dart';

late Box<dynamic> userBox;
late Box<ImageModel> imgBox;

@override
void onInit() async {
  // box init
  userBox = await Hive.openBox('userTable');
  imgBox = await Hive.openBox<ImageModel>('imageTable');
}

// logic

if (userBox.get('aUser') == null) { // aUser라는 key에 value가 없을 경우
  // ...
}

String temp = userBox.get('bUser'); // bUser라는 key 값에 사용자의 이름이 들어가있다면 temp에 사용자 이름이 들어감.  
```

데이터 쓰기는 아래와 같다.  
데이터를 씀과 동시에 저장이 된다.  
keyword는 `put`이다.  

`Write`  

```dart
userBox.put('aUser', '철수');
userBox.put('bUser', '민수');

// custom Model도 가능
exBox.put('a', UserModel(name:'동준', age:26));
```

이렇게 되면, userBox에는 (<key,value> 값으로 aUser:철수, bUser:민수) 가 들어가게 된다.  


`Read Keys`  

Hive는 Key, Value의 형식이라 했다.  
아래와 같이 key 값들 전부를 조회할 수 있다.  

```dart
userBox.keys.forEach((element) {
  print("Key:$element, value:${userBox.get(element)}");
});
```

`Delete key`  

```dart
// key 값이 aUser인 field 삭제
userBox.delete('aUser');  
```

`clear`  

table(box)하나를 밀어버려야?할 상황이 생길 수 있다.  
그 경우 clear() 함수를 사용한다.  

```dart
userBox.clear();
```

---  

# 🎨 Put & Load Image

마지막으로 local db에 이미지를 넣고 load하는 예제를 끝으로 포스팅을 마무리하겠다.  

`image_model.dart`  

```dart
import 'dart:typed_data';

import 'package:hive/hive.dart';

part 'image_model.g.dart';

@HiveType(typeId: 1)
class ImageModel extends HiveObject{
  @HiveField(5)
  List<Uint8List>? img;
}
```

`image_model.g.dart`  

아래 명령어로 자동 생성  
`$ flutter packages pub run build_runner build`  

`viewModel.dart`  

```dart
List imagesAsBytes = []; //List of images converted to bytes
ImageModel imageModel = ImageModel();

Future<void> imgPick(PagingViewModel pvm, int nav) async {
  final pickedImg = await ImagePicker().pickImage(source: ImageSource.gallery); // 갤러리에서 이미지를 받아옴.

  if (pickedImg == null) return;

  File file = File(pickedImg.path);
  imagesAsBytes.add(file.readAsBytesSync());

  imageModel.img = imagesAsBytes.cast<Uint8List>();

  pvm.imageBox.put('img', imageModel);

  print("${pvm.imageBox.get('img')}");
}
```  

`ui.dart`  

```dart
// Image Widget
Image.memory(imageBox.get('img')!.img![0])
```
