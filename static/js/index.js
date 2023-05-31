document.addEventListener('DOMContentLoaded', () => {
  const currNum = getPageNum(); // 현재 페이지 정보를 가져오는 함수

  // 이벤트 등록
  searchBox(currNum); // 키워드 검색 구현을 위한 함수
  clickToMainPage(); // 타이틀 클릭 시 첫 페이지로 이동

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
    window.location.href = '/?page=1';
  });
};

// 페이지 번호 가져오기 (쿼리를 가져옵니다.)
const getPageNum = () => {
  const params = new URLSearchParams(window.location.search);
  let pageNum = params.get('page');
  if (!pageNum) {
    pageNum = '1';
  }
  return pageNum;
};

// 검색창 구현
const searchBox = (pageNum) => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  // 검색 버튼 클릭에 대한 이벤트 등록
  searchButton.addEventListener('click', () => {
    movieListing(pageNum, searchInput.value); // 키워드 파라미터를 포함한 영화 리스팅
  });
  // 검색창 Enter 입력 대한 이벤트 등록
  searchInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      movieListing(pageNum, searchInput.value);
    }
  });
};

// TMDB에서 영화 리소스를 가져오는 함수
const getMovies = async (pageNum) => {
  // TMDB fetch 옵션
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      // 인증키
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTA1ZTlkMmE3Y2ZkZmViNzM1MDEzYjZlNmQ3NzhiMyIsInN1YiI6IjY0NzU3NGU5YmJjYWUwMDExOGJmNmQ3OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NX73Ve8n9Sej2np-7mP-addEhM0R1Uo3k9hsfgl8PX8',
    },
  };
  const responce = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${pageNum}`,
    options
  );
  const data = await responce.json();
  const movies = data['results'];

  return movies; // promise 객체에 리소스 object를 담아서 리턴
};

// 영화 정보를 프론트에 전달, 현재페이지와 검색 키워드를 파라미터로 입력
const movieListing = async (pageNum = '1', keyword = '') => {
  movies = await getMovies(pageNum); // promise 객체의 데이터는 await로 꺼냄
  const keywordRegExp = new RegExp(keyword, 'i'); // 키워드를 정규표현식 객체로 생성, 'i'옵션으로 대소문자 구분 없도록 설정
  movies = movies.filter(
    // 영화 제목과 내용에 해당 키워드 포함 유무를 필터링
    (movie) => keywordRegExp.test(movie.original_title) || keywordRegExp.test(movie.overview)
  );

  // post-box 클래스에 동적 데이터 전달, UI 출력
  const postBox = document.getElementsByClassName('post-box')[0];
  postBox.innerHTML = ''; // empty post-box tag
  movies.forEach((movie) => {
    let { id, original_title, vote_average, overview, poster_path } = movie;
    poster_path = 'https://image.tmdb.org/t/p/w300' + poster_path;
    tempHTML = `<div class="post" onclick="alert('영화 id: ${String(id)}')">
                        <img src=${poster_path} width="300px">
                        <div class="post-content">
                          <h3>${original_title} (⭐️ ${vote_average})</h3>
                          <div class="context-text">
                            <p>${overview}</p>
                          </div>
                        </div>
                      </div>`;
    postBox.innerHTML += tempHTML; // append 'post' tag
  });
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
