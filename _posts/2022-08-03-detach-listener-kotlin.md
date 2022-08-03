---
title: "[Kotlin] Firebase addSnapshotListener detach"
excerpt: "listener 중복으로 붙여지는 현상 해결"

categories:
  - Kotlin
tags:
  - [Kotlin]

permalink: /kotlin/detach-listener-kotlin/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2022-08-03 05:40:00
last_modified_at: 2022-08-03 05:40:00
published: true
---  

## ❓ 문제

Firebase를 사용할 때, collection 혹은 document에 `snapshot(listener)`를 붙이고 싶을 때가 있다.  
바로 아래와 같이 listner를 붙일 수 있다.  

```kotlin
fun btnCamera(view: View) {
	Log.d("카메라버튼", "버튼이 눌림")
	cameraSnapshot(farmId)
}

fun cameraSnapshot(farmId: String) {
	db.collection("buttons").document(farmId).addSnapshotListener { value, error ->
		Log.d("listener", "SnapshotListner 호출!")
	}
}
```

문제는 이와 같이 버튼을 여러번 클릭하면, 여러번 listener가 달린다는 것이다.  

![duplicate](/assets/images/post_img/kotlin/detach-listener-kotlin/duplicate.JPG)  

---  

## ✏️ Solved!

나는 위와 같은 상황에서, 버튼을 한 번 눌렀을 때, listener가 한 번만 달리게 하고 싶었다.  
그렇다면 왜 중복으로 계속 리스너가 달리는 것일까?  

`addSnapshotListener`는 cameraSnapshot 함수가 호출될 때마다 listener가 추가되기 때문!  
따라서, 원하는 액션을 한 뒤, `addSnapshotListener를 detach` 해주어야 한다.  

해결법은 간단하다.  
listener라는 변수를 선언하였고, 거기에 addSnapshotListner를 사용한 주소를 넣는다.  
listner를 detach 하고싶을 때, `listener.remove()`로 지워주면, 리스너 중복 문제가 해결된다.  

위의 코드를 아래와 같이 수정해보자.  

```kotlin
fun btnCamera(view: View) {
	Log.d("카메라버튼", "버튼이 눌림")
	cameraSnapshot(farmId)
}

var listener: ListenerRegistration? = null

fun cameraSnapshot(farmId: String) {
	listener = db.collection("buttons").document(farmId).addSnapshotListener { value, error ->
		Log.d("listener", "SnapshotListner 호출!")
		if (value!!.data!!["cameraButton"] as Boolean) {
			Log.d("listener", "값 true loading...")
		}
		else {
			Log.d("listener", "값 false로 바뀜 loading 해제 + listener 해제")
			listener?.remove()
		}
	}
}
```

나는 버튼을 눌렀을 때, listner를 달고, 그 값의 변화가 내가 원하는 조건이면 lisnter를 삭제하게 해주었다. 
결과는 아래와 같다.   

![result](/assets/images/post_img/kotlin/detach-listener-kotlin/result.JPG)  