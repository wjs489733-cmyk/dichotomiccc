(() => {
  // -------------------------
  // Theme switcher 테마 스위치
  // -------------------------
  const THEME_KEY = "dichotomiccc_theme";
  const THEME_CLASSES = [
    "theme-default",
    "theme-white",
    "theme-black",
    "theme-mint",
    "theme-red",
    "theme-mint-bg",
  ];

  const themeBtn = document.querySelector(".theme-btn");
  const themeMenu = document.getElementById("themeMenu");
  const redThemeBtn = document.getElementById("redTheme");

  function applyThemeClass(cls) {
    document.body.classList.remove(...THEME_CLASSES);
    document.body.classList.add(cls);
  }

  // 저장된 테마 복원 (easter용 theme-mint-bg도 포함)
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme && THEME_CLASSES.includes(savedTheme)) {
    applyThemeClass(savedTheme);
  }

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

      // 테마 변경 + 저장
      let cls = "theme-default";
      if (t === "white") cls = "theme-white";
      else if (t === "black") cls = "theme-black";
      else if (t === "mint") cls = "theme-mint";
      else if (t === "red") cls = "theme-red";

      applyThemeClass(cls);
      localStorage.setItem(THEME_KEY, cls);

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

  // hover 시 해당 카테고리 "다음 이미지"로
  if (workCats) {
    workCats.addEventListener("mouseover", (e) => {
      const btn = e.target.closest(".cat");
      if (!btn) return;
      const cat = btn.dataset.cat;
      if (!cat) return;

      // hover하면 흰색(glow)은 CSS가 처리, 여기서는 이미지/active 처리
      setActiveCat(cat, false);
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

  // 바깥 클릭으로 닫기
  if (workPanel) {
    workPanel.addEventListener("click", (e) => {
      // 패널 내부 클릭은 무시
      if (e.target.closest(".work-panel-inner")) return;
      closeAllPanels();
    });
  }

  if (aboutPanel) {
    aboutPanel.addEventListener("click", (e) => {
      if (e.target.closest(".info-panel-inner")) return;
      closeAllPanels();
    });
  }

  if (contactPanel) {
    contactPanel.addEventListener("click", (e) => {
      if (e.target.closest(".info-panel-inner")) return;
      closeAllPanels();
    });
  }

  // -------------------------
  // Easter egg (3+ clicks)
  // -------------------------
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
    applyThemeClass("theme-mint-bg");
    localStorage.setItem(THEME_KEY, "theme-mint-bg");
  }

  function switchToBlackTheme() {
    applyThemeClass("theme-black");
    localStorage.setItem(THEME_KEY, "theme-black");
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

      if (clickCount >= 3) {
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
  // Selected Work 프로젝트 클릭 시 이미지 표시
  // -------------------------
  const selectedWorkLinks = document.querySelectorAll(".works-list a");

  selectedWorkLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const projectName = link.getAttribute("href").substring(1); // #ddd -> ddd

      // 이미지 경로 설정
      if (selectedWorkImg) {
        selectedWorkImg.src = `./assets/img/selected/${projectName}.jpg`;
        selectedWorkImg.alt = projectName;
      }

      // 패널 열기
      closeAllPanels();
      if (selectedWorkPanel) {
        selectedWorkPanel.classList.add("open");
        selectedWorkPanel.setAttribute("aria-hidden", "false");
      }
    });
  });

  // 패널 외부 클릭 시 닫기
  if (selectedWorkPanel) {
    selectedWorkPanel.addEventListener("click", (e) => {
      if (e.target.closest(".selected-work-panel-inner")) return;
      closeAllPanels();
    });
  }
})();
