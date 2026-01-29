/**
 * Admin Selected Works Dashboard
 * Selected Work 목록 관리
 */
(() => {
  const API_URL = CONFIG.API_URL;

  const userEmail = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const selectedWorksContainer = document.getElementById('selectedWorksContainer');

  // 인증 확인
  const token = localStorage.getItem('authToken');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  if (!token) {
    window.location.href = './login.html';
    return;
  }

  // 사용자 정보 표시
  if (userEmail && userData.email) {
    userEmail.textContent = userData.email;
  }

  // 로그아웃
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = './login.html';
    });
  }

  // API 요청 헬퍼
  async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = './login.html';
      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Selected Works 목록 불러오기
  async function loadSelectedWorks() {
    try {
      const response = await apiRequest('/selected-works/admin/all');
      const works = response.data;

      if (works.length === 0) {
        selectedWorksContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📁</div>
            <p class="empty-state-text">No selected works yet. Create your first one!</p>
            <a href="./selected-editor.html" class="btn-new-project">+ New Selected Work</a>
          </div>
        `;
        return;
      }

      const grid = document.createElement('div');
      grid.className = 'projects-grid';

      works.forEach(work => {
        const card = createWorkCard(work);
        grid.appendChild(card);
      });

      selectedWorksContainer.innerHTML = '';
      selectedWorksContainer.appendChild(grid);

    } catch (error) {
      console.error('Load selected works error:', error);
      selectedWorksContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">❌</div>
          <p class="empty-state-text">Failed to load selected works</p>
          <button class="btn-new-project" onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }

  // Selected Work 카드 생성
  function createWorkCard(work) {
    const card = document.createElement('div');
    card.className = 'project-card';

    // 상태 뱃지
    let statusBadge = '';
    if (work.published) {
      statusBadge = '<span class="project-status-badge published">Published</span>';
    } else {
      statusBadge = '<span class="project-status-badge draft">Draft</span>';
    }

    // 썸네일
    const thumbUrl = work.thumbnail?.url || '../assets/img/placeholder.jpg';

    card.innerHTML = `
      ${statusBadge}
      <div class="project-card-thumb">
        <img src="${thumbUrl}" alt="${work.title}" onerror="this.src='../assets/img/placeholder.jpg'">
      </div>
      <h3 class="project-card-title">${work.displayTitle || work.title}</h3>
      <div class="project-card-meta">
        <span>${work.category}</span>
        <span>${work.year}</span>
      </div>
      <div class="project-card-actions">
        <a href="./selected-editor.html?id=${work._id}" class="btn-small">Edit</a>
        <button class="btn-small" onclick="window.viewSelectedWork('${work.slug}')">View</button>
        <button class="btn-small btn-danger" onclick="window.deleteSelectedWork('${work._id}', '${work.title}')">Delete</button>
      </div>
    `;

    return card;
  }

  // Selected Work 보기
  window.viewSelectedWork = (slug) => {
    window.open(`../projects/${slug}.html`, '_blank');
  };

  // Selected Work 삭제
  window.deleteSelectedWork = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await apiRequest(`/selected-works/${id}`, {
        method: 'DELETE'
      });

      alert('Selected work deleted successfully');
      loadSelectedWorks(); // 목록 새로고침
    } catch (error) {
      console.error('Delete selected work error:', error);
      alert('Failed to delete: ' + error.message);
    }
  };

  // 초기 로드
  loadSelectedWorks();

})();
