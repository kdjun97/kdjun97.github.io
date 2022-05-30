---
title: "Search Engine Web 구현해보기 (Python Flask 이용)"
excerpt: "나만의 검색엔진 만들어보기!"

categories:
  - Web
tags:
  - [Web, Python, Flask]

permalink: /web/search-engine-web/

toc: true
toc_sticky: true
toc_label: "Contents"
toc_icon: "lightbulb" # https://fontawesome.com/
 
date: 2021-06-27 20:00:00
last_modified_at: 2021-06-27 20:00:00
published: true
---

# 🔍 Python Flask를 이용, 웹과 DB 연동, 검색엔진 만들기.

> 실제 프로젝트 내용은 기업과 서약서를 작성했기 때문에, 기업과 관련된 내용들은 삭제했고, 이 포스팅은 검색엔진을 구현할 수 있다는 컨셉을 알려주기 위해 작성한 것임을 알린다.  

데이터베이스 수업 때, 통일 검색엔진을 만드는 프로젝트가 있었다.  
현재 블로그에 포스팅하는 부분은 연습할 당시 사용했던 테이블이나 결과물이다.  
이 포스팅의 결과물은 local에서 만든 table과 python flask를 연동하는 아주 간소화한 검색엔진 정도가 될 것이다.  

---  

실제 프로젝트에서는, **inverted index**테이블이 따로 있었지만, 여기서는 간단한 예제를 위해 테이블을 새로 생성했다.  
**INSERT INTO**로 그냥 넣어줬음. 테이블은 아래 참고.  
![table](/assets/images/post_img/search-engine-web/table.PNG)  

**TF-IDF**를 적용한 **ranking algorithm**또한, 본 예제에서는 뺐다.  

**inverted index**에 대해 알고 싶다면, `파이썬으로 형태소분석`과 비슷한 키워드로 검색하면 쉽게 이해할 수 있을 것이다.  
또한 ranking algorithm은 [이 링크](https://wikidocs.net/31698)에서 설명을 잘 해주었기 때문에 참고하면 좋을 것 같다.  

---

#### 🛠️ 검색엔진 개발

**Flask**는 파이썬 라이브러리이다.  
웹사이트를 만드는 데 아주 많은 도움을 주는 라이브러리다.  
또한, 부트스트랩에서 무료로 제공해주는 템플릿을 사용하면 이쁘게 꾸밀 수 있다.  

이제 위의 기술들로 검색엔진을 개발할 것인데, 정석 flow는 대략 이렇다.  

**1.** Data Prep 문서 하나를 한줄의 글 형식으로 쭉 나열.  

Doc1 "Title" + 'body', + ... + author  
Doc2 "Title" + 'body', + ... + author  
Doc3 "Title" + 'body', + ... + author  
.....  

**2.** 핵심은 형태소 분석.  

Doc1 <u>나</u>는 <u>학교</u>에서 <u>친구</u>와 <u>밥</u>을 <u>먹</u>었다.  
Doc2 <u>북한</u>의 <u>군사</u> <u>수석</u>이 <u>남한</u>의 <u>통일부</u> <u>장관</u>에게 <u>친서</u>를 <u>보내</u>어...  
Doc3 <u>북한</u>이 <u>최근</u> <u>평양</u> <u>시내</u> <u>학교</u>에 <u>친구</u> <u>없</u>는 <u>학생</u>들을.....  

파이썬에는 형태소 분석하는 라이브러리가 많이 존재하기 때문에 더 자세한 부분은 검색을 통해 이해하길 바란다. 

여기까지 하면 inverted index를 할 준비가 완료되었다.    

**3.** inverted index(Full Text Search)  

단어 사전을 만드는 느낌.  
ex)  
학교 1, 3  
친구 1, 3  
밥 1  
먹 1  
북한 2,3  
군사 2  
수석 2  
남한 2  
통일부 2  
장관 2  
친서 2  
보(내다) 2  
최근 3  
평양 3  
시내 3  
없 3  
학생 3  

**4.** Ranking Algorithm  

ex)  
학교 1 3 7 9 10 15 20  
친구 1 3 9 11 31 55 99  

대표적인 Ranking Algorithm에는 TF-IDF와 BM25가 있다.  
만약 **<u>학교</u>**라는 term(단어)가 주여졌을 때, 이렇게 비교한다.  
전체 문서에서 **<u>학교</u>**의 빈도 vs 1번 문서에서 **<u>학교</u>**의 빈도  

**5.** 데이터를 웹에서 가져오기  

윗 부분이 잘 되어있으면, SQL 쿼리를 통하여 본인이 필요한 부분만 가져오면 된다.  

하지만 이번 포스팅에서는, 위와 같은 과정을 다 생략하고, 수동으로 table을 만들어 주었고 , 다양한 기능들은 구현되지 않았다.  

따라서, 검색을 했을 때, 리스트를 보여주고, 그중에 하나를 클릭하면 상세페이지로 넘어가는 아주 간단한 기능까지만 구현하였다.  
아래에서 실행 영상 링크를 언급하며 포스팅을 마무리하도록 하겠다.  

---

#### ✔️ 실행 영상

[Youtube](https://www.youtube.com/watch?v=HonQW_yceh4)  