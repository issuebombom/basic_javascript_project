document.addEventListener('DOMContentLoaded', () => {
  const currNum = getQuery(); // 현재 페이지 정보를 가져오는 함수

  // 이벤트 등록
  handlerSearch(currNum); // 키워드 검색 구현을 위한 함수
  clickToMainPage(); // 타이틀 클릭 시 첫 페이지로 이동
  changeLanguage(currNum);

  // 랜더링 후 실행 함수
  movieListing(currNum); // 필터링된 영화 데이터를 프론트에 나열하는 함수
  pagination(currNum); // 현재 페이지에 따른 페이지네이션을 구현하는 함수

  // focus input box
  (() => {
    const inputBox = document.getElementById('search-input');
    inputBox.focus();
  })();
});

// 제목 클릭 시 메인페이지(page=1)로 이동
const clickToMainPage = () => {
  const pageTitle = document.querySelector('.header > h1');
  pageTitle.addEventListener('click', () => {
    window.location.href = `/?page=1`;
  });
};

// url의 쿼리를 가져옵니다.
const getQuery = () => {
  const params = new URLSearchParams(window.location.search);
  let pageNum = params.get('page');
  if (!pageNum) {
    pageNum = '1';
  }
  return pageNum;
};

// 현재 검색창에 입력된 키워드를 리턴합니다.
const getKeyword = () => {
  const searchInput = document.getElementById('search-input');
  return searchInput.value;
};

// 현재 선택된 언어 정보를 리턴합니다.
const getLanguage = () => {
  let currlanguage;
  const radioLanguage = document.getElementsByName('language');
  radioLanguage.forEach((radio) => {
    if (radio.checked) {
      currlanguage = radio.defaultValue;
    }
  });
  return currlanguage;
};

// 언어 선택 구현
const changeLanguage = (pageNum) => {
  // 언어 선택 라디오 버튼 구현
  const englishInput = document.getElementById('english');
  const koreanInput = document.getElementById('korean');

  // 라디오 버튼 이벤트 등록
  englishInput.addEventListener('change', () => {
    movieListing(pageNum, getKeyword(), 'en-US');
  });
  koreanInput.addEventListener('change', () => {
    movieListing(pageNum, getKeyword(), 'ko');
  });
};

// 검색창 이벤트 등록
const handlerSearch = (pageNum) => {
  const searchBox = document.querySelector('.search-box');
  const searchInput = document.querySelector('#search-input')

  // 페이지네이션 숨기기
  const hidePageContainer = () => {
    const pageContainer = document.querySelector('.page-container');
    pageContainer.classList.add('hidden');
  };

  // 페이지네이션 보이기
  const showPageContainer = () => {
    const pageContainer = document.querySelector('.page-container');
    pageContainer.classList.remove('hidden');
  };

  // 검색 실행 함수 (현재 페이지에 노출된 영화를 대상으로 키워드 검색)
  const search = () => {
    const searchKeyword = searchInput.value.trim();
    // 키워드 검색 시 pagination 기능을 숨깁니다.
    searchKeyword !== '' ? hidePageContainer() : showPageContainer();

    // 키워드 파라미터를 포함한 영화 리스팅
    movieListing(pageNum, searchKeyword, getLanguage());
    searchInput.value = searchKeyword; // trim 적용된 키워드를 검색창에 보여줌
  };
  // 키워드 검색에 대한 이벤트 등록
  searchBox.addEventListener('submit', (event) => {
    event.preventDefault()
    search();
  });
};

// TMDB에서 영화 리소스를 가져오는 함수
const getMovies = async (pageNum, language) => {
  // TMDB fetch 옵션
  const auth = {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTA1ZTlkMmE3Y2ZkZmViNzM1MDEzYjZlNmQ3NzhiMyIsInN1YiI6IjY0NzU3NGU5YmJjYWUwMDExOGJmNmQ3OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NX73Ve8n9Sej2np-7mP-addEhM0R1Uo3k9hsfgl8PX8',
    },
  };
  const responce = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?language=${language}&page=${pageNum}`, auth);
  const { results } = await responce.json();
  return results; // promise 객체에 리소스 object를 담아서 리턴
};

// 영화 정보를 프론트에 전달, 현재페이지와 검색 키워드를 파라미터로 입력
const movieListing = async (pageNum = '1', keyword = '', language = 'en-US') => {
  movies = await getMovies(pageNum, language); // promise 객체의 데이터는 await로 꺼냄
  const keywordRegExp = new RegExp(keyword, 'i'); // 키워드를 정규표현식 객체로 생성, 'i'옵션으로 대소문자 구분 없도록 설정
  movies = movies.filter(
    // 영화 제목과 내용에 해당 키워드 포함 유무를 필터링
    (movie) => keywordRegExp.test(movie.original_title) || keywordRegExp.test(movie.overview)
  );
  // 검색 결과가 없을 경우
  if (movies.length === 0) {
    const postBox = document.querySelector('.post-box');
    postBox.innerHTML = '<h1 style="color: gold;">해당 키워드를 포함한 검색 결과가 없습니다.</h1>';
    return;
  }
  // post-box 클래스에 동적 데이터 전달, UI 출력
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
  }, '');

  return language;
};

// pagination
const pagination = (currNum = 1) => {
  // 현재 페이지가 3이면 1, 2, 3, 4, 5를 구현합니다. 6이면 6, 7, 8, 9, 10을 구현합니다.
  currNum = Number(currNum);
  pageLength = 5;
  const startNum = Math.floor((currNum - 1) / pageLength) * pageLength;
  const endNum = startNum + 5;

  const pageContainer = document.querySelector('.page-container');
  pageContainer.innerHTML = ''; // empty page-container tag

  // '이전 페이지 이동' 기호 생성 조건
  if (endNum > 5) {
    const liElement = `<li><a href="/?page=${startNum}">≪</a></li>`;
    pageContainer.innerHTML += liElement;
  }

  // 현재 페이지를 기준으로 페이지 범위 구현
  for (let i = startNum + 1; i <= endNum; i++) {
    const liElement = document.createElement('li');
    const aElement = document.createElement('a');
    aElement.href = `/?page=${i}`;
    aElement.textContent = i;
    liElement.appendChild(aElement);
    pageContainer.appendChild(liElement);

    // 현재 페이지 번호는 금색으로 표시하여 현재 위치를 알려줍니다.
    if (i === currNum) {
      liElement.style.color = 'gold';
    }
  }

  // '다음 페이지 이동' 기호 생성 조건 (페이지 표시는 최대 100을 넘을 수 없습니다.)
  if (endNum < 100) {
    const liElement = `<li><a href="/?page=${endNum + 1}">≫</a></li>`;
    pageContainer.innerHTML += liElement;
  }
};
