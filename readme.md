# 자바스크립트 개인 프로젝트 01

![mainpage](./img/main.png)

---

### 프로젝트 개요 및 기능

> 자바스크립트 기본 문법에 익숙해지기 위한 미니 프로젝트입니다.  
> TMDB에서 Top rated movie API를 통해 영화 정보를 제공합니다.  
> 키워드 검색 구현을 통해 영화 title과 overview를 기준으로 일치하는 단어가 포함된 영화 필터링을 구현합니다.

### 주요 이슈 및 해결

#### 검색창 이용 시 대소문자 구분 없이 필터링 가능하도록 구현

```javascript
movies = movies.filter(
  (movie) =>
    movie.original_title.toLowerCase().includes(keyword) ||
    movie.overview.toLowerCase().includes(keyword)
);
```

처음에는 위 코드와 같이 영화 제목과 내용(overview)을 전부 소문자로 바꿔서 해당 키워드를 포함한 영화에 대해 필터링하도록 작성했습니다.  
하지만 위 경우 keyword가 대문자로 작성된다면 의도한대로 작동되지 않습니다. 즉 찾고자 하는 키워드와 타겟 텍스트 모두 대소문자 구분을 하지 않아야 합니다.

이를 위해 아래와 같이 작성했습니다.

```javascript
const keyword = 'Godfather';
const keywordRegExp = new RegExp(keyword, 'i');
movies = movies.filter((movie) => keywordRegExp.test(movie.original_title));
```

위 코드는 정규표현식을 활용한 방법입니다.

- RegExp 객체를 생성하여 찾고자 하는 키워드를 정규표현식으로 등록
- 'i' 옵션을 통해 검증 시 대소문자를 구분하지 않도록 지정
- movie.original_title(프로퍼티 네임)에 대해서 정규표현식을 기준으로 포함 여부를 확인

정규표현식은 일반적으로 정규표현'식'을 써서 유효성 검사 또는 텍스트 전처리에 활용되지만  
정규표현식으로 단어 자체를 넣는다면 검사 대상에게 해당하는 단어가 포함되어 있는가를 확인하는 용도로 사용할 수 있습니다.  
추가적으로 'i' 옵션을 통해 대소문자를 가리지 않도록 설정하여서 찾는 키워드와 타겟 모두 대소문자 구분 없이 필터링이 가능합니다.

참고로 제가 아는 정규표현식은 일반적으로 아래와 같이 사용됩니다.

```javascript
// 이메일 양식 유효성 검사
const re = new RegExp('^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');

const keyword01 = 'abc@google.com';
const keyword02 = 'abc.google.com';
console.log(re.test(keyword01)); // true
console.log(re.test(keyword02)); // false
```

```javascript
// 키워드에서 한글만 추출
const re = new RegExp('[^가-힣]+', 'g');
const keyword = '가a01나b01다';
const result = keyword.replace(re, '');
console.log(result); // '가나다'
```

#### 랜더링 후 커서 위치를 검색창으로 설정 (focus)

```javascript
// focus input box
(() => {
  const inputBox = document.getElementById('search-input');
  inputBox.focus();
})();
```

즉시 실행 함수를 `DOMContentLoaded`에 적용하여 매 접속 시 자동으로 검색창에 커서가 설정되도록 구현

