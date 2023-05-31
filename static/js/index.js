document.addEventListener('DOMContentLoaded', () => {
  searchBox(); // 키워드 검색 구현을 위한 함수
  movieListing(); // 필터링된 영화 데이터를 프론트에 나열하는 함수
});

// 검색창 구현
const searchBox = () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  // 검색 버튼 클릭에 대한 이벤트 등록
  searchButton.addEventListener('click', () => {
    movieListing(searchInput.value); // 키워드 파라미터를 포함한 영화 리스팅
  });
  // 검색창 Enter 입력 대한 이벤트 등록
  searchInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      movieListing(searchInput.value);
    }
  });
};

// TMDB에서 영화 리소스를 가져오는 함수
const getMovies = async () => {
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
    'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
    options
  );
  const data = await responce.json();
  const movies = data['results'];

  return movies; // promise 객체에 리소스 object를 담아서 리턴
};

// 영화 정보를 프론트에 전달, 검색 키워드를 파라미터로 입력 (default = '')
const movieListing = async (keyword = '') => {
  movies = await getMovies(); // promise 객체의 데이터는 await로 꺼냄
  const keywordRegExp = new RegExp(keyword, 'i'); // 키워드를 정규표현식 객체로 생성, 'i'옵션으로 대소문자 구분 없도록 설정
  movies = movies.filter(
    // 영화 제목과 내용에 해당 키워드 포함 유무를 필터링
    (movie) => keywordRegExp.test(movie.original_title) || keywordRegExp.test(movie.overview)
  );

  // post-box 클래스에 동적 데이터 전달, UI 출력
  const postBox = document.getElementsByClassName('post-box')[0];
  postBox.innerHTML = ''; // empty post-box tag
  movies.forEach((movie) => {
    let { id, original_title, overview, poster_path } = movie;
    poster_path = 'https://image.tmdb.org/t/p/w300' + poster_path;
    tempHTML = `<div class="post" onclick="alert('movieId: ${String(id)}')">
                        <img src=${poster_path} width="300px">
                        <div class="post-content">
                          <h2>${original_title}</h2>
                          <div class="context-text">
                            <p>${overview}</p>
                          </div>
                        </div>
                      </div>`;
    postBox.innerHTML += tempHTML; // append 'post' tag
  });
};
