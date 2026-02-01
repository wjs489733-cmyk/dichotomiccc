/**
 * Selected Work View Page - Dynamic Selected Work Loading
 * URL 파라미터의 slug로 Selected Work 상세 정보를 가져와 렌더링
 */
(() => {
  // API URL - CONFIG에서 자동 결정
  const API_URL = CONFIG.API_URL;

  // URL에서 slug 추출
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  // Elements
  const projectTitle = document.getElementById('projectTitle');
  const projectContent = document.getElementById('projectContent');
  const projectNav = document.getElementById('projectNav');
  const prevLink = document.getElementById('prevLink');
  const nextLink = document.getElementById('nextLink');
  const backBtn = document.getElementById('backBtn');

  if (!slug) {
    showError('Selected work not found');
    return;
  }

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

  // Selected Work 렌더링
  function renderSelectedWork(work) {
    // 페이지 타이틀 업데이트
    const displayTitle = work.displayTitle || work.title.toUpperCase();
    document.title = `${displayTitle} · dichotomiccc`;
    projectTitle.textContent = displayTitle;

    // 메타 정보
    let metaHTML = `
      <section class="project-meta">
        <div class="meta-item">
          <span class="meta-label">Category</span>
          <span class="meta-value">${work.category}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Year</span>
          <span class="meta-value">${work.year}</span>
        </div>
    `;

    if (work.tools) {
      metaHTML += `
        <div class="meta-item">
          <span class="meta-label">Tools</span>
          <span class="meta-value">${work.tools}</span>
        </div>
      `;
    }
    metaHTML += '</section>';

    // Overview
    let overviewHTML = '';
    if (work.overview && work.overview !== '<p><br></p>') {
      overviewHTML = `
        <section class="project-description">
          ${work.overview}
        </section>
      `;
    }

    // 썸네일 이미지
    let thumbnailHTML = '';
    if (work.thumbnail && work.thumbnail.url) {
      thumbnailHTML = `
        <section class="project-gallery">
          <figure class="gallery-item">
            <img src="${work.thumbnail.url}" alt="${work.title}">
          </figure>
        </section>
      `;
    }

    // 갤러리 이미지들
    let galleryHTML = '';
    if (work.gallery && work.gallery.length > 0) {
      galleryHTML = `
        <section class="project-gallery">
          ${work.gallery.map(img => `
            <figure class="gallery-item">
              <img src="${img.url}" alt="${work.title}">
              ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}
            </figure>
          `).join('')}
        </section>
      `;
    }

    // Detail
    let detailHTML = '';
    if (work.detail && work.detail !== '<p><br></p>') {
      detailHTML = `
        <section class="project-description">
          ${work.detail}
        </section>
      `;
    }

    // 콘텐츠 조합
    projectContent.innerHTML = metaHTML + overviewHTML + thumbnailHTML + galleryHTML + detailHTML;

    // 네비게이션 설정
    if (work.navigation) {
      if (work.navigation.prev && work.navigation.prev.slug) {
        prevLink.href = `./view.html?slug=${work.navigation.prev.slug}`;
        prevLink.textContent = `← ${work.navigation.prev.title || 'prev'}`;
        prevLink.style.display = 'inline';
      }
      if (work.navigation.next && work.navigation.next.slug) {
        nextLink.href = `./view.html?slug=${work.navigation.next.slug}`;
        nextLink.textContent = `${work.navigation.next.title || 'next'} →`;
        nextLink.style.display = 'inline';
      }
    }

    if (prevLink.style.display === 'inline' || nextLink.style.display === 'inline') {
      projectNav.style.display = 'flex';
    }
  }

  // API에서 Selected Work 가져오기
  async function fetchSelectedWork() {
    try {
      const response = await fetch(`${API_URL}/selected-works/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          showError('Selected work not found');
        } else {
          showError('Failed to load selected work');
        }
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        renderSelectedWork(data.data);
      } else {
        showError('Selected work not found');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showError('서버에 연결할 수 없습니다.');
    }
  }

  // Back 버튼 이벤트
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      localStorage.setItem('introVisited', 'true');
    });
  }

  // 페이지 로드 시 Selected Work 가져오기
  fetchSelectedWork();
})();
