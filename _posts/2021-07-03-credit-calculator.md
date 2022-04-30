---
title: "[Python] 심심해서 파이썬으로 만든 학점 계산기"
excerpt: "Python으로 본인의 학점을 계산해보자"

categories:
  - Python
tags:
  - [Python]

permalink: /python/credit-calculator/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2021-07-03 16:30:00
last_modified_at: 2021-07-03 16:30:00
published: true
---

#### Credit Calculator

21년도 1학기 성적이 어제부로 다 나왔다.  
몇주 기다리면 학교 홈페이지에 업데이트된 전체 학점을 알아볼 수 있겠지만, 한국인은 기다릴 수 없는 민족이다.  
토요일이기도 하고 심심하기도 해서 학점 계산기를 만들어보았다.  

pandas를 이용해서 csv 파일을 읽어들어오는 것은 너무 귀찮았기 때문에, 코드 안에 list형식으로 각 학기의 정보를 넣어주었다.  
(굳이 코드 안에 list를 넣는 선택을 한 이유는, 나중에 재이수를 하더라도 코드 안에 있는 학점만 바꿔주면 되기 때문에 나쁘지 않다고 생각했음.)  

널리 널리 배포할 목적이었다면, csv를 읽는 형식으로 만들었겠지만 어차피 나만 쓸거기 때문에, 내가 알아보기 편하도록 짰다.(~~뭐든 편한게 짱이지..~~)  

기능은 현재까지 들은 총 학점, 총 pf학점, 전공평점, 교양평점, 총 평점을 print하게 해두었다.  
또한, 16년도 1학기 성적이 궁금할 경우 해당 학기만 뽑을 수 있도록 하고, 함수에 parameter를 어떻게 설정해주느냐에 따라 output이 달라지도록 만들었다.  
일단 모든 학점을 공개하기는 너무 부끄럽기 때문에 상위 두개의 학기...정도를 넣어두고 github에 올린다.(전체학기 정보는 local파일에 있다.)  

---  

#### 사용법

만약 clone을 떠서 사용하고싶다면, 
```python
sem_19_summer = [('사회봉사1','교양','P',1), ('다른과목','전공','A+',3)]
```  

이런식으로 list를 초기화해주고,  
`sem_cal(STRING_NAME, LIST)` 함수를 호출해주면 된다.  

ex)  
```python
sem_cal('19-1', sem_19_summer)
```  

만약 총 학기수를 계산하고 싶다면,  

```python
sem_19_summer = [('사회봉사1','교양','P',1)]
sem_20_summer = [('소프트웨어 입문','교양','A0',2)]
sem_21_1 = [('기초전자공학실험', '전공','P',3)]
sem_21_summer =[('현장실습(전산전자)', '전공', 'P', 3), ('시스템 개발 실무특론', '교양','P',2)]

sem_total=[]
sem_total = sem_19_summer + sem_20_summer + sem_21_1 + sem_21_summer
```

이런식으로 list를 합쳐주고, 함수를 호출해주면 된다.  
ex) 
```python
sem_cal('총',sem_total)  
```

> [Github 파이썬 코드](https://github.com/kdjun97/credit_calculator)  

결과는 아래와 같다(내 학점이 이렇다는게 아니고 예시를 든 것임.)  
![output](/assets/images/post_img/credit-calculator/result.PNG)  