(() => {
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


  // hover 시 해당 카테고리 "다음 이미지"로
  if (workCats) {
    workCats.addEventListener("click", (e) => { // 모바일 고려하여 mouseover -> click으로 변경 고려
      const btn = e.target.closest(".cat");
      if (!btn) return;
      const cat = btn.dataset.cat;
      if (!cat) return;
      
      // 클릭 시 활성화 및 이미지 교체
      setActiveCat(cat, false);
    });
     // PC 호버 지원 유지
    workCats.addEventListener("mouseover", (e) => {
      if (window.innerWidth <= 768) return; // 모바일에서는 호버 무시
      const btn = e.target.closest(".cat");
      if (!btn) return;
      const cat = btn.dataset.cat;
      if (!cat) return;
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

  // 바깥 클릭으로 닫기 (모바일에서는 닫기 버튼이 있으므로 패널 배경 클릭 시 닫기)
  [workPanel, aboutPanel, contactPanel, selectedWorkPanel].forEach(panel => {
      if(panel) {
          panel.addEventListener("click", (e) => {
              // 패널 내부 콘텐츠나 닫기 버튼 클릭은 무시
              if (e.target.closest(".work-panel-inner") || 
                  e.target.closest(".info-panel-inner") || 
                  e.target.closest(".selected-work-panel-inner") ||
                  e.target.closest(".close-panel-btn")) return;
              closeAllPanels();
          });
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

})();