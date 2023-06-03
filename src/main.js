import { getCurrentKeyword } from './info.js';
import { hanlderSearch, handlerTitle } from './events.js';
import { movieListing } from './movie.js';
import { pagination } from './pagination.js';

// 이벤트 등록
hanlderSearch();
handlerTitle();

// 랜더링 후 실행 함수
movieListing(); // 영화 포스팅
pagination(); // 페이지네이션 구현

// 검색된 키워드 검색창에 계속 띄우기
const searchInput = document.querySelector('#search-input');
searchInput.value = getCurrentKeyword();

// 검색창에 커서 띄우기
searchInput.focus();