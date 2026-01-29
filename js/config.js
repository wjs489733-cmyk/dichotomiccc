/**
 * API Configuration
 * 환경에 따라 자동으로 API URL 전환
 */
const CONFIG = {
  // 로컬 개발 환경이면 localhost, 아니면 Render 서버 URL 사용
  API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://dichotomiccc-ap.onrender.com/api'
};

// 디버그용 로그 (개발 환경에서만)
if (window.location.hostname === 'localhost') {
  console.log('🔧 Development mode - API:', CONFIG.API_URL);
}
