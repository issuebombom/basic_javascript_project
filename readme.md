# 자바스크립트 개인 프로젝트 01

![mainpage](./img/reference_main.png)

---

### 프로젝트 개요 및 기능

> 자바스크립트 기본 문법에 익숙해지기 위한 미니 프로젝트입니다.  
> TMDB에서 Top rated movie API를 통해 영화 정보를 제공합니다.  
> 키워드 검색 구현을 통해 영화 title과 overview를 기준으로 일치하는 단어가 포함된 영화 필터링을 구현합니다.

### 주요 구현 기능

> 페이지네이션  
>  ▶︎ 페이지 번호에 쿼리문 추가하여 TMDB API 주소의 `page` 쿼리와 연동  
>  ▶︎ 페이지를 5개 단위로 보여지도록 구현 (ex. 1 2 3 4 5 >>)  
>  ▶︎ '이전 페이지', '다음 페이지'를 꺽쇠 기호로 구현  
>  ▶︎ 조회 가능한 페이지를 100페이지로 제한함  
>  ▶︎ 동적 구현 1: 꺽쇠 기호가 필요없을 경우 숨김  
>  ▶︎ 동적 구현 2: 현재 페이지가 7페이지면 6 7 8 9 10 페이지네이션 출력  
>  ▶︎ 현재 보고 있는 페이지번호는 색깔을 달리함

> 키워드 검색 기능  
>  ▶︎ 사이트 접속 시 커서가 검색창에 위치하도록 구현  
>  ▶︎ 엔터키로 검색 동작 구현  
>  ▶︎ `trim` 메소드 추가하여 빈칸 검색 예방  
>  ▶︎ 검색 키워드의 대소문자 구분 없음  
>  ▶︎ 영화 제목, 내용 기준으로 키워드 검색 결과 출력  
>  ▶︎ 검색 결과가 없을 경우 안내 문구 출력  
>  ▶︎ 키워드 검색 시 페이지네이션 숨김 처리

> 기타  
>  ▶︎ 언어 변경 기능 구현  
>  ▶︎ 메인 타이틀 클릭 시 메인페이지 이동  
>  ▶︎ 영화 포스터 클릭 시 영화 id 팝업  
>  ▶︎ 포스터 hover 시 금색 테두리 생성  
>  ▶︎ 평점은 영화 포스터 우상단에 겹쳐서 출력  
>  ▶︎ display: flex 구현  
>  ▶︎ 포스터 크기 고정 및 스크롤 지원  
>  ▶︎ 페이지 이동 시 로딩 스피너 구현

### 주요 이슈 및 해결

#### 1. 검색창 이용 시 대소문자 구분 없이 필터링 가능하도록 구현

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

> RegExp 객체를 생성하여 찾고자 하는 키워드를 정규표현식으로 등록  
> 'i' 옵션을 통해 검증 시 대소문자를 구분하지 않도록 지정  
> movie.original_title(프로퍼티 네임)에 대해서 정규표현식을 기준으로 포함 여부를 확인

정규표현식은 일반적으로 정규표현'식'을 써서 유효성 검사 또는 텍스트 전처리에 활용되지만 정규표현식으로 단어 자체를 넣는다면 검사 대상에게 해당하는 단어가 포함되어 있는가를 확인하는 용도로 사용할 수 있습니다.  
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

#### 2. HTML 태그 불러오기

document.querySelector vs document.getElementByClass  
`document.getElementByClass`로 태그를 불러올 경우 배열에 담아서 가져온다는 사실을 몰라서 오래 해맸습니다.  
그래서 아래와 같이 0번으로 인덱싱 후 사용해야 정상 작동합니다.

```javascript
const post = document.getElementByClass('post')
post[0].addEventListener ...
```

`document.querySelector`의 경우 배열에 담지 않기 때문에 이로 인한 피해를 방지할 수 있습니다.

하지만 동일한 클래스를 지닌 여러 태그에 대해서 이벤트 리스너를 적용해야 한다면 아래와 같이 사용할 수 있습니다.

```javascript
// post 클래스 태그가 여러 개 있다고 가정합니다.
const posts = document.querySelectorAll('post')
posts.forEach((post) => {
  post.addEventListener ...
})
```

이처럼 동일한 여러 태그를 대상으로 이벤트 리스너를 적용할 수 있습니다.

저의 경우 해당 기능으로 각 태그에 `'hidden'` 이라는 class를 추가하고, CSS에서 hidden 클래스에 `display: none;`를 적용하여 동적으로 숨기는 기능을 추가하는데 활용했습니다.

#### 3. 선택한 라디오태그 결과 가져오기
처음에는 html 여러 라디오 태그 중 선택된 태그에는 checked라는 항목이 붙는다고 생각했습니다. 그래서 선택된 라디오 태그의 value를 가져오는 기능을 구현하려 했습니다. 하지만 크롬 개발자 도구를 통해 html을 살펴보면 실제로 어떤 라디오 태그를 선택하더라도 html 태그 상에서는 변화가 없었습니다. 

여기서 console.dir() 기능을 통해 해당 태그가 지니고 있는 객체를 확인할 수 있다는 점을 알게 되었고, 이 점을 통해 각 라디오 태그가 checked 상태인지 아닌지를 확인할 수 있었습니다.
```javascript
const getLanguage = () => {
  let currlanguage;
  const radioLanguage = document.getElementsByName('language');
  radioLanguage.forEach((radio) => {
    console.dir(radio) // radio 태그의 객체를 확인합니다.
  });
}
```

그래서 아래와 같이 라디오 태그의 객체에 직접 접근하여 checked 상태에 따른, 즉 선택된 라디오 태그에 설정된 기본값을 가져오는 방식을 통해 현재 프론트 상에서 선택된 태그의 값을 가져올 수 있었습니다.


```javascript
const getLanguage = () => {
  let currlanguage;
  const radioLanguage = document.getElementsByName('language');
  radioLanguage.forEach((radio) => {
    if (radio.checked) {
      currlanguage = radio.defaultValue;
    }
  });
  return currlanguage;
}
```

console.dir을 통해 기본적으로 제공되는 자바스크립트 메소드 뿐 아니라 내가 지닌 태그의 객체에 직접 접근할 수 있다는 것을 배울 수 있었습니다.

#### 4. forEach로 누적값을 구한다면 reduce 적용
배열을 꺼내서 각 요소의 누적값을 구하는 로직이라면 reduce가 더 깔끔하다는 것을 느꼈다.
```javascript
// Before
const postBox = document.querySelector('.post-box');
postBox.innerHTML = ''; // empty post-box tag
movies.forEach((movie) => {
  let { id, original_title, vote_average, overview, poster_path } = movie;
  poster_path = 'https://image.tmdb.org/t/p/w300' + poster_path;
  tempHTML = `<div class="post" onclick="alert('영화 id: ${String(id)}')">
                      <img src=${poster_path}>
                      <p class="overlay-text">⭐️ ${vote_average}</p>
                      <div class="post-content">
                        <h3>${original_title}</h3>
                        <div class="context-text">
                          <p>${overview}</p>
                        </div>
                      </div>
                    </div>`;
  postBox.innerHTML += tempHTML; // append 'post' tag
});

// After
const postBox = document.querySelector('.post-box');
postBox.innerHTML = movies.reduce((accumulation, eachData) => {
  let { id, original_title, vote_average, overview, poster_path } = eachData;
  return accumulation + `
          <div class="post" onclick="alert('영화 id: ${String(id)}')">
            <img src=${'https://image.tmdb.org/t/p/w300' + poster_path}>
            <p class="overlay-text">⭐️ ${vote_average}</p>
            <div class="post-content">
              <h3>${original_title}</h3>
              <div class="context-text">
                <p>${overview}</p>
              </div>
            </div>
          </div>
  `;
}, ''); // innerHTML의 초기화
```
forEach를 사용할 경우 postBox.innerHTML의 초기화(빈값으로 만들기)과정과 더하는 과정이 분리되어 있지만 reduce를 적용함으로서 이 기능을 하나로 합칠 수 있다. 또한 reduce에서 accumulation 변수에 해당하는 누적값이 초기에는 빈값('')을 받고 이후로는 각 iteration의 return값을 누적하는 원리를 이용하여 return문에 바로 누적 연산을 적용하였다.  
추가적으로 img url의 불필요한 덧셈 과정을 축소했다.

#### 5. form 태그로 검색창 기능 축소
기존 방식에서는 검색창 구현을 위해 input태그와 button태그를 div태그로 감쌌다.  
그래서 input태그에서 enter입력을 통한 검색 명령과 button클릭 시 검색 명령을 각각 이벤트 리스너로 등록해줘야 했다.

```html
<!-- Before -->
<div class="search-box">
  <input id="search-input" type="text" placeholder="키워드를 입력하세요" style="width: 200px; height: 30px;">
  <button id="search-button" type="submit" style="height: 36px;">검색</button>
</div>
```
```javascript
// 검색 버튼 클릭에 대한 이벤트 등록
  searchButton.addEventListener('click', () => {
    search();
  });
  // 검색창 Enter 입력 대한 이벤트 등록
  searchInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      search();
    }
  });
```

하지만 form 태그의 자식태그로 검색 구현을 한 뒤 submit에 대한 이벤트리스너를 적용한다면 클릭과 엔터에 대한 이벤트를 따로 등록할 필요가 없었다.
```html
<!-- After -->
<form class="search-box">
  <input id="search-input" type="text" placeholder="키워드를 입력하세요" style="width: 200px; height: 30px;">
  <button id="search-button" type="submit" style="height: 36px;">검색</button>
</form>
```
```javascript
searchBox.addEventListener('submit', (event) => {
  event.preventDefault()
  search();
})
```
saerchBox는 form 태그로, input과 button의 부모 태그이다.  
여기서 적용된 개념은 `이벤트 버블링`과 `form`태그 내 input태그는 엔터키에 대한 이벤트가 기본적으로 내장되어 있다는 점이다.  

이벤트버블링은 자식 태그의 이벤트를 부모 태그에서 처리할 수 있도록 위임되는 현상을 말한다. 그래서 button 태그의 `submit` 이벤트가 부모 태그인 form태그에서도 핸들링이 가능한 것이다. 

> 💡 `Tip`  
이벤트 버블링과 아래 메서드를 활용한다면 여러 자식 태그들에게서 발생하는 동일한 이벤트에 대해서 각각 다른 기능이 발현되도록 할 수 있다.  
`event.target` : 이벤트가 발생한 요소  
`event.currentTarget`: 이벤트 핸들러가 등록되어 있는 요소

또한 form태그에 submit 이벤트 핸들러가 등록된 경우 자식 태그의 input 태그는 엔터키 입력 시 submit 이벤트가 발생하도록 기본적으로 설정되어 있다.  

그리고 form 태그 내부의 input과 button은 기본 타입이 submit이다. 그래서 사실 button 태그의 type을 명시하지 않아도 작동에 문제가 없다.  

>💡 `Tip`  
form태그 submit 이벤트는 기본적으로 내장된 이벤트가 있다.  
만약 자식태그의 input태그에 `name="memberId"`가 명시되어 있는 상태에서 입력창에 숫자 1을 적고 엔터키를 누른다면 url에 `?memberId=1`이라는 쿼리문을 추가하여 페이지를 새로고침한다.  
위 기본 이벤트를 활용할 수 있겠지만 현재 구현하고자 하는 기능에서는 불필요한 기능이므로 `event.preventDefault()` 메서드를 통해 기본 이벤트 발생을 방지하고 있다.

