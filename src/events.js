import { movieListing } from './movie.js';
import { getCurrentKeyword } from './info.js';

// 키워드 검색에 대한 이벤트를 등록합니다.
const hanlderSearch = () => {
  const searchBox = document.querySelector('.search-box');
  searchBox.addEventListener('submit', (event) => {
    event.preventDefault();
    movieListing(getCurrentKeyword());
  });
};

// 제목 클릭 시 메인페이지(page=1)로 이동하는 이벤트를 등록합니다.
const handlerTitle = () => {
  const pageTitle = document.querySelector('.header > h1');
  pageTitle.addEventListener('click', () => {
    window.location.href = `/?page=1`;
  });
};

export { hanlderSearch, handlerTitle };