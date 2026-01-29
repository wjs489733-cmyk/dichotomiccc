/**
 * Admin Page Editor
 * About/Contact 페이지 편집 기능
 */
(() => {
  const API_URL = CONFIG.API_URL;

  // DOM Elements
  const userEmail = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const pageTitle = document.getElementById('pageTitle');
  const pageForm = document.getElementById('pageForm');
  const saveBtn = document.getElementById('saveBtn');
  const pageTabs = document.querySelectorAll('.page-tab');
  const profileSection = document.getElementById('profileSection');
  const contactSection = document.getElementById('contactSection');

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

  // Quill 에디터 초기화
  const quill = new Quill('#quillEditor', {
    theme: 'snow',
    placeholder: 'Enter additional content...',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        ['clean']
      ]
    }
  });

  // 현재 페이지 상태
  let currentPage = 'about';

  // URL에서 페이지 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page');
  if (pageParam && ['about', 'contact'].includes(pageParam)) {
    currentPage = pageParam;
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

  // 페이지 데이터 로드
  async function loadPageData(slug) {
    try {
      const response = await apiRequest(`/pages/${slug}`);
      const page = response.data;

      // 폼에 데이터 채우기
      document.getElementById('title').value = page.title || '';
      document.getElementById('subtitle').value = page.subtitle || '';

      // Profile 정보 (about 페이지)
      if (page.profile) {
        document.getElementById('profileName').value = page.profile.name || '';
        document.getElementById('profileFocus').value = page.profile.focus || '';
        document.getElementById('profileTools').value = page.profile.tools || '';
        document.getElementById('profileBio').value = page.profile.bio || '';
      }

      // Contact 정보
      if (page.contactInfo) {
        document.getElementById('contactEmail').value = page.contactInfo.email || '';
        document.getElementById('contactInstagram').value = page.contactInfo.instagram || '';
        document.getElementById('contactBlog').value = page.contactInfo.blog || '';
        document.getElementById('contactOther').value = page.contactInfo.other || '';
      }

      // Quill 에디터 내용
      if (page.content) {
        quill.root.innerHTML = page.content;
      } else {
        quill.root.innerHTML = '';
      }

    } catch (error) {
      console.error('Load page error:', error);
    }
  }

  // 페이지 저장
  async function savePage(e) {
    e.preventDefault();

    const btnText = saveBtn.querySelector('.btn-text');
    const btnLoading = saveBtn.querySelector('.btn-loading');

    try {
      saveBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';

      const pageData = {
        title: document.getElementById('title').value,
        subtitle: document.getElementById('subtitle').value,
        content: quill.root.innerHTML,
        profile: {
          name: document.getElementById('profileName').value,
          focus: document.getElementById('profileFocus').value,
          tools: document.getElementById('profileTools').value,
          bio: document.getElementById('profileBio').value
        },
        contactInfo: {
          email: document.getElementById('contactEmail').value,
          instagram: document.getElementById('contactInstagram').value,
          blog: document.getElementById('contactBlog').value,
          other: document.getElementById('contactOther').value
        }
      };

      await apiRequest(`/pages/${currentPage}`, {
        method: 'PUT',
        body: JSON.stringify(pageData)
      });

      alert('Page saved successfully!');

    } catch (error) {
      console.error('Save page error:', error);
      alert('Failed to save page: ' + error.message);
    } finally {
      saveBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  }

  // 탭 전환
  function switchTab(slug) {
    currentPage = slug;

    // URL 업데이트
    const url = new URL(window.location);
    url.searchParams.set('page', slug);
    window.history.pushState({}, '', url);

    // 탭 활성화 상태 업데이트
    pageTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.page === slug);
    });

    // 제목 업데이트
    pageTitle.textContent = `Edit ${slug.charAt(0).toUpperCase() + slug.slice(1)} Page`;

    // 섹션 표시/숨김
    if (slug === 'about') {
      profileSection.style.display = 'block';
      contactSection.style.display = 'block';
    } else if (slug === 'contact') {
      profileSection.style.display = 'none';
      contactSection.style.display = 'block';
    }

    // 데이터 로드
    loadPageData(slug);
  }

  // 이벤트 리스너
  pageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.page);
    });
  });

  pageForm.addEventListener('submit', savePage);

  // 초기 로드
  switchTab(currentPage);

})();
