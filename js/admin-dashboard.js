(() => {
  const API_URL = 'http://localhost:5000/api';

  const userEmail = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const projectsContainer = document.getElementById('projectsContainer');

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
      // 토큰 만료
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

  // 프로젝트 목록 불러오기
  async function loadProjects() {
    try {
      const response = await apiRequest('/projects/admin/all');
      const projects = response.data;

      if (projects.length === 0) {
        projectsContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📁</div>
            <p class="empty-state-text">No projects yet. Create your first project!</p>
            <a href="./editor.html" class="btn-new-project">+ New Project</a>
          </div>
        `;
        return;
      }

      const grid = document.createElement('div');
      grid.className = 'projects-grid';

      projects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
      });

      projectsContainer.innerHTML = '';
      projectsContainer.appendChild(grid);

    } catch (error) {
      console.error('Load projects error:', error);
      projectsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">❌</div>
          <p class="empty-state-text">Failed to load projects</p>
          <button class="btn-new-project" onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }

  // 프로젝트 카드 생성
  function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';

    // 상태 뱃지
    let statusBadge = '';
    if (project.isFeatured) {
      statusBadge = '<span class="project-status-badge featured">Featured</span>';
    } else if (project.isPublished) {
      statusBadge = '<span class="project-status-badge published">Published</span>';
    } else {
      statusBadge = '<span class="project-status-badge draft">Draft</span>';
    }

    // 썸네일
    const thumbUrl = project.thumbnail?.url || '../assets/img/placeholder.jpg';

    card.innerHTML = `
      ${statusBadge}
      <div class="project-card-thumb">
        <img src="${thumbUrl}" alt="${project.title}" onerror="this.src='../assets/img/placeholder.jpg'">
      </div>
      <h3 class="project-card-title">${project.title}</h3>
      <div class="project-card-meta">
        <span>${project.category}</span>
        <span>${project.year}</span>
      </div>
      <div class="project-card-actions">
        <a href="./editor.html?id=${project._id}" class="btn-small">Edit</a>
        <button class="btn-small" onclick="window.viewProject('${project.slug}')">View</button>
        <button class="btn-small btn-danger" onclick="window.deleteProject('${project._id}', '${project.title}')">Delete</button>
      </div>
    `;

    return card;
  }

  // 프로젝트 보기
  window.viewProject = (slug) => {
    window.open(`../projects/view.html?slug=${slug}`, '_blank');
  };

  // 프로젝트 삭제
  window.deleteProject = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await apiRequest(`/projects/${id}`, {
        method: 'DELETE'
      });

      alert('Project deleted successfully');
      loadProjects(); // 목록 새로고침
    } catch (error) {
      console.error('Delete project error:', error);
      alert('Failed to delete project: ' + error.message);
    }
  };

  // 초기 로드
  loadProjects();

})();
