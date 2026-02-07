(() => {

  // -------------------------
  // API 설정
  // -------------------------
  const API_URL = CONFIG.API_URL;

  // -------------------------
  // 인트로 레이어 (레트로 부팅 화면)
  // -------------------------
  const introLanding = document.getElementById('intro-landing');
  const bootLog = document.getElementById('bootLog');
  const bootProgressContainer = document.getElementById('bootProgressContainer');
  const bootProgressFill = document.getElementById('bootProgressFill');
  const bootProgressPercent = document.getElementById('bootProgressPercent');
  const bootPrompt = document.getElementById('bootPrompt');

  let canEnter = false;
  let bootSequenceRunning = false;

  // 부팅 메시지 시퀀스
  const BOOT_MESSAGES = [
    { text: 'dichotomiccc BIOS v2.026', type: 'title', delay: 300 },
    { text: 'Copyright (C) 2026, dichotomiccc design archive', type: 'normal', delay: 200 },
    { text: '', type: 'normal', delay: 100 },
    { text: 'Checking system memory... 640K OK', type: 'success', delay: 400 },
    { text: 'Detecting design modules...', type: 'normal', delay: 300 },
    { text: '  - uxui.module         [OK]', type: 'success', delay: 150 },
    { text: '  - branding.module     [OK]', type: 'success', delay: 150 },
    { text: '  - editorial.module    [OK]', type: 'success', delay: 150 },
    { text: '  - graphic.module      [OK]', type: 'success', delay: 150 },
    { text: '  - motion.module       [OK]', type: 'success', delay: 150 },
    { text: '', type: 'normal', delay: 100 },
    { text: 'Initializing portfolio system...', type: 'normal', delay: 400 },
    { text: 'Loading creative assets...', type: 'normal', delay: 300 },
  ];

  // 인트로 종료 함수
  function closeIntro() {
    if (!introLanding || !canEnter) return;

    introLanding.classList.add('fade-out');

    setTimeout(() => {
      introLanding.style.display = 'none';
      localStorage.setItem('introVisited', 'true');
    }, 500);
  }

  // 부팅 라인 추가 함수
  function addBootLine(text, type) {
    if (!bootLog) return;

    const line = document.createElement('div');
    line.className = `boot-line ${type}`;
    line.textContent = text;
    bootLog.appendChild(line);

    // 스크롤 하단으로
    bootLog.scrollTop = bootLog.scrollHeight;
  }

  // 프로그레스 바 업데이트
  function updateProgress(percent) {
    if (bootProgressFill) {
      bootProgressFill.style.width = `${percent}%`;
    }
    if (bootProgressPercent) {
      bootProgressPercent.textContent = `${Math.round(percent)}%`;
    }
  }

  // 부팅 시퀀스 실행
  async function runBootSequence() {
    if (bootSequenceRunning) return;
    bootSequenceRunning = true;

    // 로그 초기화
    if (bootLog) bootLog.innerHTML = '';
    if (bootProgressContainer) bootProgressContainer.classList.remove('visible');
    if (bootPrompt) bootPrompt.classList.remove('visible');
    updateProgress(0);
    canEnter = false;

    // 부팅 메시지 순차 출력
    for (let i = 0; i < BOOT_MESSAGES.length; i++) {
      const msg = BOOT_MESSAGES[i];
      await new Promise(resolve => setTimeout(resolve, msg.delay));
      addBootLine(msg.text, msg.type);
    }

    // 프로그레스 바 표시
    await new Promise(resolve => setTimeout(resolve, 300));
    if (bootProgressContainer) {
      bootProgressContainer.classList.add('visible');
    }

    // 프로그레스 바 애니메이션 (0% -> 100%)
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 8 + 2; // 랜덤 증가
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);

        // 완료 메시지
        setTimeout(() => {
          addBootLine('', 'normal');
          addBootLine('System ready.', 'success');
          addBootLine('', 'normal');

          // 프롬프트 표시
          setTimeout(() => {
            if (bootPrompt) bootPrompt.classList.add('visible');
            canEnter = true;
            bootSequenceRunning = false;
          }, 400);
        }, 300);
      }
      updateProgress(progress);
    }, 80);
  }

  // 인트로 다시 열기 함수
  function openIntro() {
    if (!introLanding) return;

    introLanding.style.display = 'flex';
    introLanding.classList.remove('fade-out');

    // 부팅 시퀀스 다시 시작
    runBootSequence();
  }

  // 재방문 체크 - 첫 방문 시에만 인트로 표시
  if (introLanding) {
    if (localStorage.getItem('introVisited') === 'true') {
      introLanding.style.display = 'none';
    } else {
      // 첫 방문: 인트로 표시 및 부팅 시퀀스 시작
      introLanding.style.display = 'flex';
      runBootSequence();
    }
  }

  // 홈페이지 로고 클릭 시 인트로 다시 열기
  const siteTitle = document.getElementById('siteTitle');
  if (siteTitle) {
    siteTitle.addEventListener('click', openIntro);

    siteTitle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openIntro();
      }
    });
  }

  // 인트로 클릭/키 입력 시 종료
  if (introLanding) {
    introLanding.addEventListener('click', () => {
      if (canEnter) closeIntro();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (introLanding && introLanding.style.display !== 'none') {
      if (e.key === 'Escape') {
        // ESC: 즉시 건너뛰기
        canEnter = true;
        closeIntro();
      } else if (canEnter) {
        // 아무 키나 누르면 종료
        closeIntro();
      }
    }
  });

  // -------------------------
  // Theme switcher 테마 스위치
  // -------------------------
  const themeBtn = document.querySelector(".theme-btn");
  const themeMenu = document.getElementById("themeMenu");
  const redThemeBtn = document.getElementById("redTheme");

  // 페이지 로드 시 해금 상태 확인
  if (redThemeBtn && localStorage.getItem("redThemeUnlocked") === "true") {
    redThemeBtn.classList.remove("hidden");
  }

  // 페이지 로드 시 저장된 테마 적용
  const savedTheme = localStorage.getItem("siteTheme");
  if (savedTheme) {
    document.body.classList.remove(
      "theme-default",
      "theme-white",
      "theme-black",
      "theme-mint",
      "theme-red",
      "theme-mint-bg"
    );
    document.body.classList.add(savedTheme);
  }

  if (themeBtn && themeMenu) {
    themeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle("open");
    });

    themeMenu.addEventListener("click", (e) => {
      const opt = e.target.closest(".theme-option");
      if (!opt) return;

      const t = opt.dataset.theme;

      // 테마 변경 (CSS transition이 자동으로 부드럽게 처리)
      document.body.classList.remove(
        "theme-default",
        "theme-white",
        "theme-black",
        "theme-mint",
        "theme-red",
        "theme-mint-bg"
      );

      let themeClass = "theme-default";
      if (t === "white") themeClass = "theme-white";
      else if (t === "black") themeClass = "theme-black";
      else if (t === "mint") themeClass = "theme-mint";
      else if (t === "red") themeClass = "theme-mint-bg";

      document.body.classList.add(themeClass);

      // 테마를 localStorage에 저장
      localStorage.setItem("siteTheme", themeClass);

      themeMenu.classList.remove("open");
    });

    document.addEventListener("click", () => themeMenu.classList.remove("open"));
  }

  // -------------------------
  // GNB active state toggle
  // -------------------------
  const gnbLinks = document.querySelectorAll(".gnb a");

  gnbLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // 모든 링크에서 active 제거
      gnbLinks.forEach((l) => l.classList.remove("active"));
      // 클릭한 링크에만 active 추가
      link.classList.add("active");
    });
  });

  // -------------------------
  // Panel management (Works, About, Contact)
  // -------------------------
  const workPanel = document.getElementById("workPanel");
  const aboutPanel = document.getElementById("aboutPanel");
  const contactPanel = document.getElementById("contactPanel");
  const selectedWorkPanel = document.getElementById("selectedWorkPanel");
  const workImg = document.getElementById("workImg");
  const workCats = document.getElementById("workCats");
  const selectedWorkImg = document.getElementById("selectedWorkImg");
  const currentCatLabel = document.querySelector(".current-cat-label");

  // gnb 링크들
  const worksLink = document.querySelector('.gnb a[href="#works"]');
  const aboutLink = document.querySelector('.gnb a[href="about.html"]');
  const contactLink = document.querySelector('.gnb a[href="#contact"]');

  // 기본 폴백 이미지 (API 로드 전 또는 실패 시) - url과 slug 포함
  const DEFAULT_WORKS = {
    uxui: [{ url: "./assets/img/works/uxui/01.jpg", slug: null }],
    branding: [{ url: "./assets/img/works/branding/01.jpg", slug: null }],
    editorial: [{ url: "./assets/img/works/editorial/01.jpg", slug: null }],
    graphic: [{ url: "./assets/img/works/graphic/01.jpg", slug: null }],
    motion: [{ url: "./assets/img/works/motion/01.jpg", slug: null }],
    etc: [{ url: "./assets/img/works/etc/01.jpg", slug: null }],
  };

  // 동적으로 업데이트될 WORKS 객체 (url과 slug 포함)
  let WORKS = JSON.parse(JSON.stringify(DEFAULT_WORKS));

  // 현재 표시 중인 프로젝트 정보
  let currentProject = { url: null, slug: null, category: null };

  const idx = { uxui: 0, branding: 0, editorial: 0, graphic: 0, motion: 0, etc: 0 };
  let activeCat = "uxui";

  // API에서 카테고리별 최신 썸네일 가져오기
  async function loadCategoryThumbnails() {
    const categories = ['uxui', 'branding', 'editorial', 'graphic', 'motion', 'etc'];

    for (const category of categories) {
      try {
        const response = await fetch(`${API_URL}/projects?category=${category}&published=true&limit=5`);
        if (!response.ok) continue;

        const result = await response.json();
        const projects = result.data || [];

        if (projects.length > 0) {
          // 썸네일 URL과 slug 배열 생성
          const projectItems = projects
            .filter(p => p.thumbnail?.url)
            .map(p => ({ url: p.thumbnail.url, slug: p.slug }));

          if (projectItems.length > 0) {
            WORKS[category] = projectItems;
          }
        }
      } catch (error) {
        console.log(`Failed to load thumbnails for ${category}:`, error);
        // 실패 시 기본 이미지 유지
      }
    }

    // 현재 활성 카테고리 이미지 업데이트 (패널이 열려있는 경우)
    if (workPanel && workPanel.classList.contains('open')) {
      setActiveCat(activeCat, true);
    }
  }

  // 페이지 로드 시 썸네일 로드
  loadCategoryThumbnails();

  // 모든 패널 닫기
  function closeAllPanels() {
    if (workPanel) {
      workPanel.classList.remove("open");
      workPanel.setAttribute("aria-hidden", "true");
    }
    if (aboutPanel) {
      aboutPanel.classList.remove("open");
      aboutPanel.setAttribute("aria-hidden", "true");
    }
    if (contactPanel) {
      contactPanel.classList.remove("open");
      contactPanel.setAttribute("aria-hidden", "true");
    }
    if (selectedWorkPanel) {
      selectedWorkPanel.classList.remove("open");
      selectedWorkPanel.setAttribute("aria-hidden", "true");
    }
  }

  function openWorkPanel() {
    closeAllPanels();
    if (!workPanel) return;
    workPanel.classList.add("open");
    workPanel.setAttribute("aria-hidden", "false");
    setActiveCat("uxui", true);
  }

  function openAboutPanel() {
    closeAllPanels();
    if (!aboutPanel) return;
    aboutPanel.classList.add("open");
    aboutPanel.setAttribute("aria-hidden", "false");
  }

  function openContactPanel() {
    closeAllPanels();
    if (!contactPanel) return;
    contactPanel.classList.add("open");
    contactPanel.setAttribute("aria-hidden", "false");
  }

  function setActiveCat(cat, forceFirst = false) {
    activeCat = cat;

    // active 표시
    const btns = workCats.querySelectorAll(".cat");
    btns.forEach((b) => b.classList.toggle("is-active", b.dataset.cat === cat));

    // 모바일용 카테고리 라벨 업데이트
    if (currentCatLabel) {
      currentCatLabel.textContent = cat;
    }

    // 이미지 교체 (forceFirst면 첫 이미지, 아니면 다음 이미지)
    const list = WORKS[cat] || [];
    if (!list.length) return;

    if (forceFirst) idx[cat] = 0;
    else idx[cat] = (idx[cat] + 1) % list.length;

    const item = list[idx[cat]];
    currentProject = { url: item.url, slug: item.slug, category: cat };
    swapImg(item.url);
  }

  function swapImg(src) {
    if (!workImg) return;
    workImg.style.opacity = "0";
    // 살짝 딜레이 후 src 변경 → 페이드 인
    setTimeout(() => {
      workImg.src = src;
      workImg.onload = () => (workImg.style.opacity = "1");
      // 캐시로 onload 안 불릴 때 대비
      setTimeout(() => (workImg.style.opacity = "1"), 60);
    }, 160);
  }

  // 작품 이미지 클릭 시 해당 프로젝트 페이지로 이동
  if (workImg) {
    workImg.style.cursor = "pointer";
    workImg.addEventListener("click", () => {
      if (currentProject.slug) {
        // 프로젝트 상세 페이지로 이동
        window.location.href = `./projects/view.html?slug=${currentProject.slug}`;
      } else if (currentProject.category) {
        // slug가 없으면 카테고리 갤러리 페이지로 이동
        window.location.href = `./works/${currentProject.category}.html`;
      }
    });
  }

  // works 클릭 시 패널 열기
if (worksLink) {
  worksLink.addEventListener("click", (e) => {
    e.preventDefault();
    openWorkPanel();
  });
}

  // about 클릭 시 패널 열기
  if (aboutLink) {
    aboutLink.addEventListener("click", (e) => {
      e.preventDefault();
      openAboutPanel();
    });
  }

  // contact 클릭 시 패널 열기
  if (contactLink) {
    contactLink.addEventListener("click", (e) => {
      e.preventDefault();
      openContactPanel();
    });
  }

  // 모바일 닫기 버튼 이벤트 연결
  const closeBtns = document.querySelectorAll('.close-panel-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeAllPanels);
  });

  // About/Contact 썸네일 클릭 시 해당 페이지로 이동
  const aboutPreview = document.getElementById('aboutPreview');
  const contactPreview = document.getElementById('contactPreview');

  if (aboutPreview) {
    aboutPreview.addEventListener('click', () => {
      window.location.href = './about.html';
    });
    aboutPreview.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = './about.html';
      }
    });
  }

  if (contactPreview) {
    contactPreview.addEventListener('click', () => {
      window.location.href = './contact.html';
    });
    contactPreview.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = './contact.html';
      }
    });
  }

  // 카테고리 버튼 동작
  if (workCats) {
    // PC 호버: 프리뷰 이미지 변경
    workCats.addEventListener("mouseover", (e) => {
      if (window.innerWidth <= 768) return; // 모바일에서는 호버 무시
      const btn = e.target.closest(".cat");
      if (!btn) return;
      const cat = btn.dataset.cat;
      if (!cat || cat === "showall") return; // show all 버튼은 호버 시 이미지 변경 안함
      setActiveCat(cat, false);
    });

    // 클릭: 해당 카테고리 갤러리 페이지로 이동
    workCats.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat");
      if (!btn) return;
      const cat = btn.dataset.cat;
      if (!cat) return;

      // "show all" 버튼 클릭 시 all.html로 이동
      if (cat === "showall") {
        window.location.href = `./works/all.html`;
        return;
      }

      // 카테고리 갤러리 페이지로 이동
      window.location.href = `./works/${cat}.html`;
    });
  }

  // ESC로 패널 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if ((workPanel && workPanel.classList.contains("open")) ||
          (aboutPanel && aboutPanel.classList.contains("open")) ||
          (contactPanel && contactPanel.classList.contains("open"))) {
        closeAllPanels();
        e.stopPropagation(); // Easter modal 닫기와 충돌 방지
      }
    }
  });


  // -------------------------
  // Easter egg (3+ clicks)
  // (기존 코드와 동일)
  const personaTitle = document.getElementById("personaTitle");
  const modal = document.getElementById("easterModal");

  let clickCount = 0;
  let firstClickAt = 0;
  let rotateTimer = null;
  let isMin = false;
  let currentMode = localStorage.getItem("easterMode") || "illustration"; // illustration or design

  if (personaTitle) isMin = personaTitle.textContent.includes("_min");

  const blocks = modal ? Array.from(modal.querySelectorAll(".modal-content .msg")) : [];

  function resetClicks() {
    clickCount = 0;
    firstClickAt = 0;
  }

  function openModal(mode) {
    if (!modal) return;
    modal.classList.add("open");

    // 모드에 맞는 메시지만 표시
    const modeBlocks = blocks.filter(b => b.dataset.mode === mode);
    blocks.forEach((b) => b.classList.remove("on"));

    let i = 0;
    if (modeBlocks[i]) modeBlocks[i].classList.add("on");

    clearInterval(rotateTimer);
    rotateTimer = setInterval(() => {
      blocks.forEach((b) => b.classList.remove("on"));
      i = (i + 1) % modeBlocks.length;
      if (modeBlocks[i]) modeBlocks[i].classList.add("on");
    }, 900);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    clearInterval(rotateTimer);
    rotateTimer = null;
  }

  function togglePersonaLabel() {
    if (!personaTitle) return;
    isMin = !isMin;
    personaTitle.textContent = isMin ? "dichotomiccc_min" : "dichotomiccc_smin";
  }

  function unlockRedTheme() {
    if (!redThemeBtn) return;
    redThemeBtn.classList.remove("hidden");
    localStorage.setItem("redThemeUnlocked", "true");
  }

  function switchToMintBgTheme() {
    document.body.classList.remove(
      "theme-default",
      "theme-white",
      "theme-black",
      "theme-mint",
      "theme-red"
    );
    document.body.classList.add("theme-mint-bg");
  }

  function switchToBlackTheme() {
    document.body.classList.remove(
      "theme-default",
      "theme-white",
      "theme-black",
      "theme-mint",
      "theme-red",
      "theme-mint-bg"
    );
    document.body.classList.add("theme-black");
  }

  if (personaTitle) {
    personaTitle.addEventListener("click", () => {
      const now = Date.now();

      if (clickCount === 0) firstClickAt = now;

      if (now - firstClickAt > 2200) {
        resetClicks();
        firstClickAt = now;
        clickCount = 1;
        return;
      }

      clickCount += 1;

      if (clickCount >= 5) {
        togglePersonaLabel();

        if (currentMode === "illustration") {
          // 첫 번째 클릭: 일러스트 모드 + 레드 테마 해금 + 민트 배경 전환
          openModal("illustration");
          unlockRedTheme();
          switchToMintBgTheme();
          currentMode = "design";
          localStorage.setItem("easterMode", "design");
        } else {
          // 두 번째 클릭: 디자인 모드 + 검정 바탕 테마 복귀
          openModal("design");
          switchToBlackTheme();
          currentMode = "illustration";
          localStorage.setItem("easterMode", "illustration");
        }

        resetClicks();
      }
    });
  }

  if (modal) {
    modal.addEventListener("click", closeModal);
  }

  // ESC로 Easter Modal 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      closeModal();
    }
  });

  // -------------------------
  // Selected Work 프로젝트 호버 프리뷰 및 클릭 시 상세 페이지 이동
  // -------------------------
  const selectedWorksList = document.getElementById("selectedWorksList");
  let selectedWorkDataMap = {}; // slug -> API 데이터 매핑
  let selectedProjectSlug = null;
  let isPanelOpenForProject = false;

  // 이벤트 리스너를 바인딩하는 함수 (동적 리스트용)
  function bindSelectedWorkEvents() {
    const links = document.querySelectorAll(".works-list a");

    links.forEach((link) => {
      // 호버 시: 패널 열기 및 썸네일 표시 (PC만)
      link.addEventListener("mouseenter", () => {
        if (window.innerWidth <= 768) return;

        const slug = link.getAttribute("href").substring(1);
        const thumbnail = link.dataset.thumbnail;

        if (!isPanelOpenForProject) {
          closeAllPanels();
          if (selectedWorkPanel) {
            selectedWorkPanel.classList.add("open");
            selectedWorkPanel.setAttribute("aria-hidden", "false");
            isPanelOpenForProject = true;
          }
        }

        updateSelectedWorkPreview(slug, thumbnail);
      });

      // 클릭 시: 상세 페이지로 이동
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const slug = link.getAttribute("href").substring(1);
        window.location.href = `./selected/view.html?slug=${slug}`;
      });
    });
  }

  // API에서 Selected Works 로드하고 리스트 동적 생성
  async function loadSelectedWorksData() {
    try {
      const response = await fetch(`${API_URL}/selected-works?published=true`);
      if (!response.ok) {
        // API 실패 시 기존 하드코딩된 리스트 사용
        bindSelectedWorkEvents();
        return;
      }

      const result = await response.json();
      const works = result.data || [];

      if (works.length === 0) {
        // 데이터가 없으면 기존 리스트 유지
        bindSelectedWorkEvents();
        return;
      }

      // slug를 키로 하는 맵 생성
      works.forEach(work => {
        selectedWorkDataMap[work.slug] = work;
      });

      // 동적으로 리스트 생성
      if (selectedWorksList) {
        const listHTML = works.map(work => {
          // displayTitle이 있으면 사용, 없으면 title 사용
          const displayText = work.displayTitle || work.title;
          return `<li><a href="#${work.slug}" data-thumbnail="${work.thumbnail?.url || ''}" data-has-api-data="true">${displayText}</a></li>`;
        }).join('');

        selectedWorksList.innerHTML = listHTML;
      }

      // 새 리스트에 이벤트 바인딩
      bindSelectedWorkEvents();

    } catch (error) {
      console.log('Failed to load selected works data:', error);
      // 에러 시 기존 리스트 사용
      bindSelectedWorkEvents();
    }
  }

  // 페이지 로드 시 Selected Works 데이터 로드
  loadSelectedWorksData();

  // 썸네일 이미지 업데이트 함수
  function updateSelectedWorkPreview(slug, thumbnail) {
    selectedProjectSlug = slug;

    if (selectedWorkImg) {
      // 페이드 아웃 효과
      selectedWorkImg.style.opacity = "0";

      setTimeout(() => {
        if (thumbnail) {
          selectedWorkImg.src = thumbnail;
        } else {
          selectedWorkImg.src = `./assets/img/selected/${slug}.jpg`;
        }
        selectedWorkImg.alt = slug;

        // 페이드 인 효과
        selectedWorkImg.onload = () => (selectedWorkImg.style.opacity = "1");
        setTimeout(() => (selectedWorkImg.style.opacity = "1"), 60);
      }, 160);
    }
  }

  // Selected Work 이벤트 바인딩은 bindSelectedWorkEvents()에서 처리됨
  // (동적으로 로드된 목록과 폴백 목록 모두 지원)

  // 패널 이미지 클릭 시 상세 페이지로 이동
  if (selectedWorkImg) {
    selectedWorkImg.addEventListener("click", () => {
      if (selectedProjectSlug) {
        // 항상 selected work view 페이지로 이동
        window.location.href = `./selected/view.html?slug=${selectedProjectSlug}`;
      }
    });
  }

  // 패널이 닫힐 때 상태 초기화
  const originalCloseAllPanels = closeAllPanels;
  closeAllPanels = function() {
    originalCloseAllPanels();
    isPanelOpenForProject = false;
  };

  // -------------------------
  // History 키워드 감지 (타이핑으로 'history' 입력 시 모달 표시)
  // -------------------------
  const historyModal = document.getElementById('historyModal');
  const historyCloseBtn = document.getElementById('historyCloseBtn');
  const historyOkBtn = document.getElementById('historyOkBtn');

  let typedKeys = '';
  let typingTimer = null;

  function openHistoryModal() {
    if (historyModal) {
      historyModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeHistoryModal() {
    if (historyModal) {
      historyModal.setAttribute('aria-hidden', 'true');
    }
  }

  // 키 입력 감지
  document.addEventListener('keydown', (e) => {
    // 입력 필드에 포커스가 있으면 무시
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    // 특수키나 Ctrl/Cmd 조합은 무시
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
      return;
    }

    // 타이핑된 키 추가
    typedKeys += e.key.toLowerCase();

    // 타이머 초기화 (1.5초 동안 입력 없으면 리셋)
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      typedKeys = '';
    }, 1500);

    // 'history' 감지
    if (typedKeys.includes('history')) {
      openHistoryModal();
      typedKeys = ''; // 리셋
    }

    // 'admin' 감지 - 관리자 로그인 페이지로 이동
    if (typedKeys.includes('admin')) {
      window.location.href = './admin/login.html';
      typedKeys = ''; // 리셋
    }

    // 너무 길어지면 앞부분 제거 (메모리 절약)
    if (typedKeys.length > 20) {
      typedKeys = typedKeys.slice(-10);
    }
  });

  // 닫기 버튼
  if (historyCloseBtn) {
    historyCloseBtn.addEventListener('click', closeHistoryModal);
  }

  if (historyOkBtn) {
    historyOkBtn.addEventListener('click', closeHistoryModal);
  }

  // 배경 클릭으로 닫기
  if (historyModal) {
    historyModal.addEventListener('click', (e) => {
      if (e.target === historyModal) {
        closeHistoryModal();
      }
    });
  }

  // ESC로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && historyModal && historyModal.getAttribute('aria-hidden') === 'false') {
      closeHistoryModal();
    }
  });

  // -------------------------
  // 🔐 모바일 Admin 접근 (copyright 3회 탭)
  // -------------------------
  const copyrightEl = document.querySelector('.copyright');
  let copyrightTapCount = 0;
  let copyrightTapTimer = null;
  let adminInputVisible = false;

  if (copyrightEl) {
    copyrightEl.addEventListener('click', () => {
      // 이미 입력창이 보이면 무시
      if (adminInputVisible) return;

      copyrightTapCount++;

      // 2초 내에 탭하지 않으면 리셋
      clearTimeout(copyrightTapTimer);
      copyrightTapTimer = setTimeout(() => {
        copyrightTapCount = 0;
      }, 2000);

      // 3회 탭 시 입력창 표시
      if (copyrightTapCount >= 3) {
        copyrightTapCount = 0;
        showAdminInput();
      }
    });
  }

  function showAdminInput() {
    adminInputVisible = true;

    // 입력창 컨테이너 생성
    const inputContainer = document.createElement('div');
    inputContainer.className = 'admin-secret-input';
    inputContainer.innerHTML = `
      <input type="text" id="adminSecretField" placeholder="enter code..." autocomplete="off" autocapitalize="off" />
    `;

    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
      .admin-secret-input {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 12px 20px;
        background: rgba(7, 9, 13, 0.95);
        border-top: 1px solid rgba(163, 163, 163, 0.3);
        z-index: 9999;
        animation: slideUp 0.2s ease;
      }
      @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
      .admin-secret-input input {
        width: 100%;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(163, 163, 163, 0.3);
        color: var(--hi, #f0f0f0);
        font-family: "Galmuri7", monospace;
        font-size: 14px;
        outline: none;
      }
      .admin-secret-input input:focus {
        border-color: rgba(151, 228, 213, 0.5);
      }
      .admin-secret-input input::placeholder {
        color: var(--text-soft, #a3a3a3);
        opacity: 0.6;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(inputContainer);

    // 입력 필드에 포커스 (키보드 자동 표시)
    const inputField = document.getElementById('adminSecretField');
    setTimeout(() => inputField.focus(), 100);

    // Enter 키 감지
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = inputField.value.toLowerCase().trim();
        if (value === 'admin') {
          window.location.href = './admin/login.html';
        } else {
          // 틀리면 입력창 제거
          hideAdminInput(inputContainer);
        }
      }
      // ESC로 닫기
      if (e.key === 'Escape') {
        hideAdminInput(inputContainer);
      }
    });

    // 외부 클릭 시 닫기
    inputContainer.addEventListener('click', (e) => {
      if (e.target === inputContainer) {
        hideAdminInput(inputContainer);
      }
    });
  }

  function hideAdminInput(container) {
    container.style.animation = 'slideDown 0.2s ease forwards';
    const slideDownStyle = document.createElement('style');
    slideDownStyle.textContent = `
      @keyframes slideDown {
        from { transform: translateY(0); }
        to { transform: translateY(100%); }
      }
    `;
    document.head.appendChild(slideDownStyle);
    setTimeout(() => {
      container.remove();
      adminInputVisible = false;
    }, 200);
  }

})();