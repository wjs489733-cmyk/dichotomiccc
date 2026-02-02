/**
 * All Works Page - Load and Filter Projects
 * 모든 작업물을 불러오고 필터링하는 기능
 */
(() => {
  const API_URL = CONFIG.API_URL;

  // Elements
  const worksGrid = document.getElementById('worksGrid');
  const resultsCount = document.getElementById('resultsCount');
  const categoryFilters = document.getElementById('categoryFilters');
  const yearFilters = document.getElementById('yearFilters');
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');

  // State
  let allProjects = [];
  let filteredProjects = [];
  let currentCategory = 'all';
  let currentYear = 'all';
  let searchQuery = '';

  // 카테고리 이름 매핑
  const categoryNames = {
    uxui: 'UXUI',
    branding: 'Branding',
    editorial: 'Editorial',
    graphic: 'Graphic',
    motion: 'Motion',
    etc: 'Etc'
  };

  // 프로젝트 로드
  async function loadProjects() {
    try {
      const response = await fetch(`${API_URL}/projects?published=true`);

      if (!response.ok) {
        throw new Error('Failed to load projects');
      }

      const data = await response.json();
      allProjects = data.data || [];

      // 년도 필터 버튼 동적 생성
      generateYearFilters();

      // 필터링 및 렌더링
      applyFilters();

    } catch (error) {
      console.error('Load projects error:', error);
      worksGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">❌</div>
          <p class="galmuri">Failed to load works</p>
        </div>
      `;
      resultsCount.textContent = '0 works';
    }
  }

  // 년도 필터 버튼 동적 생성
  function generateYearFilters() {
    const years = [...new Set(allProjects.map(p => p.year))].sort((a, b) => b - a);

    // 기존 "all" 버튼 유지하고 년도 버튼 추가
    years.forEach(year => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn galmuri';
      btn.dataset.filter = year;
      btn.textContent = year;
      yearFilters.appendChild(btn);
    });
  }

  // 필터 적용
  function applyFilters() {
    filteredProjects = allProjects.filter(project => {
      // 카테고리 필터
      if (currentCategory !== 'all' && project.category !== currentCategory) {
        return false;
      }

      // 년도 필터
      if (currentYear !== 'all' && project.year !== currentYear) {
        return false;
      }

      // 검색어 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = project.title.toLowerCase().includes(query);
        const categoryMatch = project.category.toLowerCase().includes(query);
        const yearMatch = project.year.toString().includes(query);
        const descMatch = project.description?.toLowerCase().includes(query);

        if (!titleMatch && !categoryMatch && !yearMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });

    renderProjects();
    updateResultsCount();
  }

  // 프로젝트 렌더링
  function renderProjects() {
    if (filteredProjects.length === 0) {
      worksGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📁</div>
          <p class="galmuri">No works found</p>
        </div>
      `;
      return;
    }

    worksGrid.innerHTML = filteredProjects.map(project => createProjectCard(project)).join('');

    // 카드 클릭 이벤트
    worksGrid.querySelectorAll('.work-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.dataset.slug;
        if (slug) {
          window.location.href = `../projects/view.html?slug=${slug}`;
        }
      });
    });
  }

  // 프로젝트 카드 HTML 생성
  function createProjectCard(project) {
    const thumbUrl = project.thumbnail?.url || '../assets/img/placeholder.jpg';
    const categoryLabel = categoryNames[project.category] || project.category;

    return `
      <article class="work-card galmuri" data-slug="${project.slug}">
        <div class="work-card-thumb">
          <img src="${thumbUrl}" alt="${project.title}" loading="lazy" onerror="this.src='../assets/img/placeholder.jpg'">
          <span class="work-card-category">${categoryLabel}</span>
        </div>
        <h3 class="work-card-title">${project.title}</h3>
        <div class="work-card-meta">
          <span>${project.year}</span>
        </div>
      </article>
    `;
  }

  // 결과 수 업데이트
  function updateResultsCount() {
    const count = filteredProjects.length;
    const total = allProjects.length;

    if (currentCategory === 'all' && currentYear === 'all' && !searchQuery) {
      resultsCount.textContent = `${count} works`;
    } else {
      resultsCount.textContent = `${count} of ${total} works`;
    }
  }

  // 필터 버튼 활성화 상태 업데이트
  function updateFilterButtonStates(container, activeFilter) {
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === activeFilter);
    });
  }

  // 카테고리 필터 클릭 이벤트
  categoryFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    currentCategory = btn.dataset.filter;
    updateFilterButtonStates(categoryFilters, currentCategory);
    applyFilters();
  });

  // 년도 필터 클릭 이벤트
  yearFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    currentYear = btn.dataset.filter;
    updateFilterButtonStates(yearFilters, currentYear);
    applyFilters();
  });

  // 검색 입력 이벤트
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchQuery = e.target.value.trim();

    // 클리어 버튼 표시/숨김
    searchClear.style.display = searchQuery ? 'block' : 'none';

    // 디바운스로 검색 성능 최적화
    searchTimeout = setTimeout(() => {
      applyFilters();
    }, 300);
  });

  // 검색 클리어 버튼
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.style.display = 'none';
    applyFilters();
  });

  // Enter 키로 검색
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(searchTimeout);
      searchQuery = e.target.value.trim();
      applyFilters();
    }
  });

  // URL 파라미터로 초기 필터 설정
  function initFromURLParams() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('category')) {
      currentCategory = params.get('category');
      updateFilterButtonStates(categoryFilters, currentCategory);
    }

    if (params.has('year')) {
      currentYear = params.get('year');
      // 년도 버튼은 프로젝트 로드 후 생성되므로 나중에 업데이트
    }

    if (params.has('q')) {
      searchQuery = params.get('q');
      searchInput.value = searchQuery;
      searchClear.style.display = searchQuery ? 'block' : 'none';
    }
  }

  // 초기화
  initFromURLParams();
  loadProjects();

})();
