/**
 * Works Page - Dynamic Project Loading
 * API에서 프로젝트를 가져와 카테고리별로 렌더링
 */
(() => {
  // API URL - CONFIG에서 자동 결정
  const API_URL = CONFIG.API_URL;

  // 현재 페이지의 카테고리 추출
  const path = window.location.pathname;
  const categoryMatch = path.match(/works\/(\w+)\.html/);
  const category = categoryMatch ? categoryMatch[1] : null;

  // 갤러리 그리드 요소
  const galleryGrid = document.querySelector('.gallery-grid');

  if (!galleryGrid || !category) {
    console.error('Gallery grid or category not found');
    return;
  }

  // 로딩 상태 표시
  function showLoading() {
    galleryGrid.innerHTML = `
      <div class="loading-state">
        <p class="galmuri">Loading projects...</p>
      </div>
    `;
  }

  // 에러 상태 표시
  function showError(message) {
    galleryGrid.innerHTML = `
      <div class="empty-state">
        <p class="galmuri">${message}</p>
      </div>
    `;
  }

  // 빈 상태 표시
  function showEmpty() {
    galleryGrid.innerHTML = `
      <div class="empty-state">
        <p class="galmuri">No projects yet</p>
      </div>
    `;
  }

  // 프로젝트 카드 렌더링
  function renderProjects(projects) {
    if (!projects || projects.length === 0) {
      showEmpty();
      return;
    }

    galleryGrid.innerHTML = projects.map(project => `
      <article class="gallery-item">
        <a href="../projects/view.html?slug=${project.slug}" class="item-link">
          <div class="item-image">
            <img src="${project.thumbnail?.url || '../assets/img/placeholder.jpg'}" alt="${project.title}">
          </div>
          <div class="item-info">
            <h2 class="item-title">${project.title}</h2>
            <p class="item-year">${project.year}</p>
          </div>
        </a>
      </article>
    `).join('');
  }

  // API에서 프로젝트 가져오기
  async function fetchProjects() {
    showLoading();

    try {
      const response = await fetch(`${API_URL}/projects?category=${category}&published=true`);

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();

      if (data.success) {
        renderProjects(data.data);
      } else {
        showError('Failed to load projects');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // 서버 연결 실패 시 - 정적 콘텐츠 유지 또는 에러 메시지
      showError('서버에 연결할 수 없습니다. 로컬 서버가 실행 중인지 확인하세요.');
    }
  }

  // 페이지 로드 시 프로젝트 가져오기
  fetchProjects();
})();
