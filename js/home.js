(() => {

  // -------------------------
  // 인트로 레이어
  // -------------------------
  const introLanding = document.getElementById('intro-landing');
  const introUser = document.getElementById('introUser');
  const introLogo = document.getElementById('introLogo');
  const introHint = document.getElementById('introHint');
  const clickCounter = document.getElementById('clickCounter');

  let bgClickCount = 0;
  let bgClickTimer = null;

  // 인트로 종료 함수 (디졸브 효과)
  function closeIntro() {
    if (!introLanding) return;

    // 페이드아웃 시작
    introLanding.classList.add('fade-out');

    // 애니메이션 완료 후 제거
    setTimeout(() => {
      introLanding.style.display = 'none';
      introLanding.classList.remove('fade-out');
      localStorage.setItem('introVisited', 'true');
    }, 800);
  }

  // 재방문 체크 - 첫 방문 시에만 인트로 표시
  if (introLanding) {
    if (localStorage.getItem('introVisited') === 'true') {
      introLanding.style.display = 'none';
    } else {
      // 첫 방문: 인트로 표시
      introLanding.style.display = 'flex';
    }
  }

  // 인트로 다시 열기 함수 (디졸브 효과)
  function openIntro() {
    if (!introLanding) return;

    // 인트로 표시
    introLanding.style.display = 'flex';
    introLanding.classList.remove('fade-out');

    // 클릭 카운터 초기화
    bgClickCount = 0;
    if (clickCounter) clickCounter.textContent = '';
    if (introHint) introHint.classList.remove('active');
  }

  // 홈페이지 로고 클릭 시 인트로 다시 열기
  const siteTitle = document.getElementById('siteTitle');
  if (siteTitle) {
    siteTitle.addEventListener('click', openIntro);

    // 키보드 접근성
    siteTitle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openIntro();
      }
    });
  }

  // 1. 'min' 클릭 시 about 페이지로 이동
  if (introUser) {
    introUser.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = 'about.html';
    });

    // 키보드 접근성
    introUser.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = 'about.html';
      }
    });
  }

  // 2. 로고 클릭/Enter 시 인트로 종료
  if (introLogo) {
    introLogo.addEventListener('click', closeIntro);

    // 키보드 접근성
    introLogo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeIntro();
      }
    });
  }

  // 3. 바탕 3번 클릭 시 인트로 종료
  if (introLanding) {
    introLanding.addEventListener('click', (e) => {
      // 로고나 min 버튼 클릭은 제외
      if (e.target !== introLanding && !e.target.closest('.pixel-animation-container')) {
        return;
      }

      bgClickCount++;

      // 클릭 카운터 업데이트
      if (clickCounter) {
        clickCounter.textContent = `${bgClickCount}/3`;
      }

      // 힌트 강조
      if (introHint) {
        introHint.classList.add('active');
      }

      // 타이머 초기화 (2.2초 내에 3번 클릭해야 함)
      clearTimeout(bgClickTimer);
      bgClickTimer = setTimeout(() => {
        bgClickCount = 0;
        if (clickCounter) clickCounter.textContent = '';
        if (introHint) introHint.classList.remove('active');
      }, 2200);

      // 3번 클릭 완료
      if (bgClickCount >= 3) {
        clearTimeout(bgClickTimer);
        closeIntro();
        bgClickCount = 0;
      }
    });
  }

  // 4. ESC 키로 인트로 건너뛰기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && introLanding && introLanding.style.display !== 'none') {
      closeIntro();
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

      if (t === "white") document.body.classList.add("theme-white");
      else if (t === "black") document.body.classList.add("theme-black");
      else if (t === "mint") document.body.classList.add("theme-mint");
      else if (t === "red") document.body.classList.add("theme-mint-bg");
      else document.body.classList.add("theme-default");

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

  const WORKS = {
    uxui: ["./assets/img/works/uxui/01.jpg", "./assets/img/works/uxui/02.jpg"],
    branding: ["./assets/img/works/branding/01.jpg", "./assets/img/works/branding/02.jpg"],
    editorial: ["./assets/img/works/editorial/01.jpg"],
    graphic: ["./assets/img/works/graphic/01.jpg"],
    motion: ["./assets/img/works/motion/01.jpg"],
    etc: ["./assets/img/works/etc/01.jpg"],
  };

  const idx = { uxui: 0, branding: 0, editorial: 0, graphic: 0, motion: 0, etc: 0 };
  let activeCat = "uxui";

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

    swapImg(list[idx[cat]]);
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


  // 카테고리 버튼 동작
  if (workCats) {
    // PC 호버: 프리뷰 이미지 변경
    workCats.addEventListener("mouseover", (e) => {
      if (window.innerWidth <= 768) return; // 모바일에서는 호버 무시
      const btn = e.target.closest(".cat");
      if (!btn) return;
      const cat = btn.dataset.cat;
      if (!cat) return;
      setActiveCat(cat, false);
    });

    // 클릭: 해당 카테고리 갤러리 페이지로 이동
    workCats.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat");
      if (!btn) return;
      const cat = btn.dataset.cat;
      if (!cat) return;

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
  const selectedWorkLinks = document.querySelectorAll(".works-list a");
  let selectedProjectName = null;
  let isPanelOpenForProject = false;

  selectedWorkLinks.forEach((link) => {
    // 클릭 시: 첫 클릭은 패널 열기, 같은 프로젝트 재클릭은 페이지 이동
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const projectName = link.getAttribute("href").substring(1); // #ddd -> ddd

      // 이미 같은 프로젝트 패널이 열려있으면 페이지 이동
      if (isPanelOpenForProject && selectedProjectName === projectName) {
        window.location.href = `./projects/${projectName}.html`;
        return;
      }

      // 다른 프로젝트 클릭 또는 첫 클릭: 이미지 교체 및 패널 열기
      selectedProjectName = projectName;

      // 이미지 경로 설정
      if (selectedWorkImg) {
        selectedWorkImg.src = `./assets/img/selected/${projectName}.jpg`;
        selectedWorkImg.alt = projectName;
      }

      // 패널이 이미 열려있으면 closeAllPanels 호출 안 함 (부드러운 전환)
      if (!isPanelOpenForProject) {
        closeAllPanels();
      }

      // 패널 열기
      if (selectedWorkPanel) {
        selectedWorkPanel.classList.add("open");
        selectedWorkPanel.setAttribute("aria-hidden", "false");
        isPanelOpenForProject = true;
      }
    });
  });

  // 패널 이미지 클릭 시 상세 페이지로 이동
  if (selectedWorkImg) {
    selectedWorkImg.addEventListener("click", () => {
      if (selectedProjectName) {
        window.location.href = `./projects/${selectedProjectName}.html`;
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

})();