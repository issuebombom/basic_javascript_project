import { getCurrentPage } from './info.js';

let currentPage = getCurrentPage();
// pagination
const pagination = () => {
  // 현재 페이지가 3이면 1, 2, 3, 4, 5를 구현합니다. 6이면 6, 7, 8, 9, 10을 구현합니다.
  currentPage = Number(currentPage);
  const pageLength = 5;
  const startNum = Math.floor((currentPage - 1) / pageLength) * pageLength;
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
    if (i === currentPage) {
      liElement.style.color = 'gold';
    }
  }

  // '다음 페이지 이동' 기호 생성 조건 (페이지 표시는 최대 100을 넘을 수 없습니다.)
  if (endNum < 100) {
    const liElement = `<li><a href="/?page=${endNum + 1}">≫</a></li>`;
    pageContainer.innerHTML += liElement;
  }
};

export { pagination };