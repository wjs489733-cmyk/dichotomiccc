/**
 * Admin Floating Button
 * 로그인 상태에서만 표시되는 관리자 플로팅 버튼
 */
(() => {
  // 로그인 상태 확인
  const token = localStorage.getItem('authToken');

  if (!token) return; // 로그인 안 됐으면 아무것도 안 함

  // 플로팅 버튼 컨테이너 생성
  const adminFloat = document.createElement('div');
  adminFloat.className = 'admin-float';
  adminFloat.innerHTML = `
    <button class="admin-float-toggle" id="adminFloatToggle" aria-label="Admin Menu">
      <span class="admin-float-icon">+</span>
    </button>
    <div class="admin-float-menu" id="adminFloatMenu">
      <a href="/admin/editor.html" class="admin-float-item">
        <span class="item-icon">✏️</span>
        <span class="item-text galmuri">New Project</span>
      </a>
      <a href="/admin/dashboard.html" class="admin-float-item">
        <span class="item-icon">📋</span>
        <span class="item-text galmuri">Dashboard</span>
      </a>
      <button class="admin-float-item admin-logout" id="adminFloatLogout">
        <span class="item-icon">🚪</span>
        <span class="item-text galmuri">Logout</span>
      </button>
    </div>
  `;

  document.body.appendChild(adminFloat);

  // 토글 버튼 이벤트
  const toggleBtn = document.getElementById('adminFloatToggle');
  const menu = document.getElementById('adminFloatMenu');
  let isOpen = false;

  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    adminFloat.classList.toggle('open', isOpen);
    toggleBtn.querySelector('.admin-float-icon').textContent = isOpen ? '×' : '+';
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!adminFloat.contains(e.target) && isOpen) {
      isOpen = false;
      adminFloat.classList.remove('open');
      toggleBtn.querySelector('.admin-float-icon').textContent = '+';
    }
  });

  // 로그아웃 버튼
  const logoutBtn = document.getElementById('adminFloatLogout');
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.reload();
  });

  // 스타일 주입
  const style = document.createElement('style');
  style.textContent = `
    .admin-float {
      position: fixed;
      top: calc(var(--m, 40px) + 2px);
      right: calc(var(--m, 40px) + 30px);
      z-index: 49;
    }

    .admin-float-toggle {
      width: 14px;
      height: 14px;
      border-radius: 0;
      background: rgba(151, 228, 213, 0.9);
      border: 1px solid rgba(163, 163, 163, 0.35);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: all 0.2s ease;
    }

    .admin-float-toggle:hover {
      background: rgba(151, 228, 213, 1);
    }

    .admin-float-icon {
      font-size: 10px;
      color: #07090D;
      font-weight: bold;
      line-height: 1;
      transition: transform 0.2s ease;
    }

    .admin-float.open .admin-float-icon {
      transform: rotate(45deg);
    }

    .admin-float-menu {
      position: absolute;
      top: 20px;
      right: 0;
      background: rgba(7, 9, 13, 0.95);
      border: 1px solid rgba(163, 163, 163, 0.3);
      border-radius: 4px;
      padding: 8px 0;
      min-width: 140px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }

    .admin-float.open .admin-float-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .admin-float-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      color: var(--text-soft, #a3a3a3);
      text-decoration: none;
      font-size: 11px;
      transition: all 0.2s;
      border: none;
      background: none;
      width: 100%;
      cursor: pointer;
      text-align: left;
    }

    .admin-float-item:hover {
      background: rgba(163, 163, 163, 0.1);
      color: var(--hi, #f0f0f0);
    }

    .admin-float-item .item-icon {
      font-size: 12px;
    }

    .admin-float-item .item-text {
      font-size: 10px;
    }

    .admin-logout {
      border-top: 1px solid rgba(163, 163, 163, 0.2);
      margin-top: 4px;
      padding-top: 10px;
    }

    @media (max-width: 768px) {
      .admin-float {
        top: calc(var(--m, 20px) + 5px);
        right: calc(var(--m, 20px) + 32px);
      }

      .admin-float-toggle {
        width: 16px;
        height: 16px;
      }
    }
  `;
  document.head.appendChild(style);
})();
