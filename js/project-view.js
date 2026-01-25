/**
 * Project View Page - Dynamic Project Loading
 * URL 파라미터의 slug로 프로젝트 상세 정보를 가져와 렌더링
 */
(() => {
  // API URL - 로컬 개발용 (배포 시 변경 필요)
  const API_URL = 'http://localhost:5000/api';

  // URL에서 slug 추출
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  // Elements
  const projectTitle = document.getElementById('projectTitle');
  const projectContent = document.getElementById('projectContent');
  const projectNav = document.getElementById('projectNav');
  const categoryLink = document.getElementById('categoryLink');
  const backBtn = document.getElementById('backBtn');

  if (!slug) {
    showError('Project not found');
    return;
  }

  // 카테고리 이름 매핑
  const categoryNames = {
    uxui: 'UXUI',
    branding: 'Branding',
    editorial: 'Editorial',
    graphic: 'Graphic',
    motion: 'Motion',
    etc: 'Etc'
  };

  // 에러 상태 표시
  function showError(message) {
    projectTitle.textContent = 'Error';
    projectContent.innerHTML = `
      <div class="empty-state">
        <p class="galmuri">${message}</p>
        <a href="../index.html" class="galmuri" style="margin-top: 20px; display: inline-block;">← Back to home</a>
      </div>
    `;
  }

  // 프로젝트 렌더링
  function renderProject(project) {
    // 페이지 타이틀 업데이트
    document.title = `${project.title} · dichotomiccc`;
    projectTitle.textContent = project.title;

    // 메타 정보
    let metaHTML = `
      <section class="project-meta">
        <div class="meta-item">
          <span class="meta-label">Category</span>
          <span class="meta-value">${categoryNames[project.category] || project.category}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Year</span>
          <span class="meta-value">${project.year}</span>
        </div>
    `;

    // 메타 정보 - client, role, tags 등
    if (project.meta) {
      if (project.meta.client) {
        metaHTML += `
          <div class="meta-item">
            <span class="meta-label">Client</span>
            <span class="meta-value">${project.meta.client}</span>
          </div>
        `;
      }
      if (project.meta.role) {
        metaHTML += `
          <div class="meta-item">
            <span class="meta-label">Role</span>
            <span class="meta-value">${project.meta.role}</span>
          </div>
        `;
      }
    }
    metaHTML += '</section>';

    // 설명
    let descriptionHTML = '';
    if (project.description && project.description !== '<p><br></p>') {
      descriptionHTML = `
        <section class="project-description">
          ${project.description}
        </section>
      `;
    }

    // 썸네일 이미지
    let thumbnailHTML = '';
    if (project.thumbnail && project.thumbnail.url) {
      thumbnailHTML = `
        <section class="project-gallery">
          <figure class="gallery-item">
            <img src="${project.thumbnail.url}" alt="${project.title}">
          </figure>
        </section>
      `;
    }

    // 갤러리 이미지들
    let galleryHTML = '';
    if (project.images && project.images.length > 0) {
      galleryHTML = `
        <section class="project-gallery">
          ${project.images.map(img => `
            <figure class="gallery-item">
              <img src="${img.url}" alt="${project.title}">
              ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}
            </figure>
          `).join('')}
        </section>
      `;
    }

    // 콘텐츠 조합
    projectContent.innerHTML = metaHTML + descriptionHTML + thumbnailHTML + galleryHTML;

    // 네비게이션 설정
    categoryLink.href = `../works/${project.category}.html`;
    categoryLink.textContent = `← back to ${categoryNames[project.category] || project.category}`;
    projectNav.style.display = 'flex';

    // Back 버튼도 카테고리로 이동하도록
    backBtn.href = `../works/${project.category}.html`;
  }

  // API에서 프로젝트 가져오기
  async function fetchProject() {
    try {
      const response = await fetch(`${API_URL}/projects/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          showError('Project not found');
        } else {
          showError('Failed to load project');
        }
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        renderProject(data.data);
      } else {
        showError('Project not found');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showError('서버에 연결할 수 없습니다. 로컬 서버가 실행 중인지 확인하세요.');
    }
  }

  // Back 버튼 이벤트 (기본 동작 오버라이드 방지)
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      // href가 설정되어 있으므로 기본 동작 사용
      localStorage.setItem('introVisited', 'true');
    });
  }

  // 페이지 로드 시 프로젝트 가져오기
  fetchProject();
})();
