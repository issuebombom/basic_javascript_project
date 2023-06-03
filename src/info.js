// 현재 페이지 정보를 가져옵니다.
const getCurrentPage = () => {
  const params = new URLSearchParams(window.location.search);
  let currentPage = params.get('page');
  if (!currentPage) {
    currentPage = '1';
  }
  return currentPage;
};

// 현재 선택된 언어 정보를 가져옵니다.
const getCurrentLanguage = () => {
  const radioLanguage = document.getElementsByName('language');
  return Array.from(radioLanguage).find((radio) => radio.checked).defaultValue;
};

// 현재 선택된 키워드를 가져옵니다.
const getCurrentKeyword = () => {
  const searchInput = document.querySelector('#search-input');
  return searchInput.value.trim();
};

export { getCurrentPage, getCurrentLanguage, getCurrentKeyword };