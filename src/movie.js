import { getCurrentPage, getCurrentLanguage } from './info.js';

// 영화 정보를 프론트에 전달, 현재페이지와 검색 키워드를 파라미터로 입력
export const movieListing = async (keyword = '') => {

  let page = getCurrentPage();
  let language = getCurrentLanguage();

  // TMDB에서 영화 리소스를 가져오는 함수
  const getMovies = async (page, language) => {
    // TMDB fetch 옵션
    const auth = {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OTA1ZTlkMmE3Y2ZkZmViNzM1MDEzYjZlNmQ3NzhiMyIsInN1YiI6IjY0NzU3NGU5YmJjYWUwMDExOGJmNmQ3OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NX73Ve8n9Sej2np-7mP-addEhM0R1Uo3k9hsfgl8PX8',
      },
    };
    const responce = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=${language}&page=${page}`, auth);
    const { results } = await responce.json();
    return results; // promise 객체에 리소스 object를 담아서 리턴
  };

  // 입력받은 키워드를 기준으로 영화를 필터링
  const keywordFilter = (movies, keyword) => {
    // 키워드를 정규표현식 객체로 생성, 'i'옵션으로 대소문자 구분 없도록 설정
    const keywordRegExp = new RegExp(keyword, 'i');
    // 영화 제목과 내용에 해당 키워드 포함 유무를 필터링
    const filteredMovies = movies.filter(
      (movie) => keywordRegExp.test(movie.original_title) || keywordRegExp.test(movie.overview)
    );

    return filteredMovies;
  };

  // 키워드 검색 시 pagination 기능을 숨깁니다.
  const displayPagination = (keyword) => {
    const pageContainer = document.querySelector('.page-container');
    keyword !== ''
      ? pageContainer.classList.add('hidden')
      : pageContainer.classList.remove('hidden');
  };

  // 영화 뿌려주기
  const generateMoviesTags = (movies) => {
    const postBox = document.querySelector('.post-box');

    // 검색 결과가 없을 경우
    if (movies.length === 0) {
      postBox.innerHTML = '<h1 style="color: gold;">해당 키워드를 포함한 검색 결과가 없습니다.</h1>';
      return;
    }
    // post-box 클래스에 동적 데이터 전달, UI 출력
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
  };

  // 영화 리스팅 실행
  const main = async () => {
    let movies = await getMovies(page, language);
    movies = keywordFilter(movies, keyword);
    generateMoviesTags(movies);
    displayPagination(keyword);
  };

  main();
};