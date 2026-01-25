# Dichotomiccc CMS 설치 가이드

관리자 시스템 설치 및 설정 가이드입니다.

## 📋 사전 준비

### 1. MongoDB Atlas 계정 생성 (무료)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 접속
2. 무료 계정 생성
3. 클러스터 생성 (Free Tier M0 선택)
4. Database Access에서 사용자 생성 (username/password 기록)
5. Network Access에서 0.0.0.0/0 추가 (모든 IP 허용)
6. 연결 문자열 복사 (Connect → Connect your application)
   - 형식: `mongodb+srv://username:password@cluster.mongodb.net/dichotomiccc?retryWrites=true&w=majority`

### 2. Cloudinary 계정 생성 (무료)

1. [Cloudinary](https://cloudinary.com/) 접속
2. 무료 계정 생성
3. Dashboard에서 다음 정보 확인:
   - Cloud Name
   - API Key
   - API Secret

## 🚀 백엔드 서버 설정

### 1. 의존성 설치

터미널을 열고 `server` 폴더로 이동:

```bash
cd server
npm install
```

### 2. 환경 변수 설정

`server/.env.example`을 복사해서 `server/.env` 파일 생성:

```bash
cp .env.example .env
```

`.env` 파일 편집:

```env
# MongoDB Connection (위에서 복사한 연결 문자열)
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/dichotomiccc?retryWrites=true&w=majority

# JWT Secret (랜덤 문자열 - 32자 이상 추천)
JWT_SECRET=your-super-secret-random-string-change-this-please-12345

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Default Credentials (처음 로그인할 계정)
ADMIN_EMAIL=admin@dichotomiccc.com
ADMIN_PASSWORD=changeme123
```

### 3. 서버 실행

개발 모드로 실행:

```bash
npm run dev
```

서버가 성공적으로 실행되면 다음과 같은 메시지가 표시됩니다:

```
✅ MongoDB Connected Successfully
✅ Default admin user created
   Email: admin@dichotomiccc.com
   Password: changeme123
   ⚠️  Please change the password after first login!
🚀 Server running on port 5000
```

## 🖥️ 관리자 페이지 사용

### 1. 로그인

브라우저에서 다음 주소로 접속:

```
http://localhost:3000/admin/login.html
```

또는 프로젝트를 Live Server로 열고:

```
/admin/login.html
```

로그인 정보:
- Email: `admin@dichotomiccc.com`
- Password: `changeme123`

### 2. 대시보드

로그인 후 대시보드에서 다음 작업이 가능합니다:
- 모든 프로젝트 목록 보기
- 프로젝트 생성/수정/삭제
- 공개/비공개 상태 관리
- Selected Work 지정

## 🔧 다음 단계 (곧 완성 예정)

현재 진행 상황:
- ✅ 백엔드 서버 (Node.js + Express)
- ✅ MongoDB 스키마 설계
- ✅ JWT 인증 시스템
- ✅ 프로젝트 CRUD API
- ✅ 이미지 업로드 API (Cloudinary)
- ✅ 관리자 로그인 페이지
- ✅ 관리자 대시보드

진행 중:
- ⏳ 프로젝트 에디터 페이지 (WYSIWYG)
- ⏳ 메인 사이트 동적 데이터 렌더링

## 🐛 문제 해결

### MongoDB 연결 실패

```
❌ MongoDB Connection Error
```

해결 방법:
1. MongoDB Atlas에서 IP 주소가 화이트리스트에 추가되었는지 확인
2. 연결 문자열의 username/password가 올바른지 확인
3. 데이터베이스 이름이 정확한지 확인

### 서버 포트 충돌

```
Error: listen EADDRINUSE: address already in use :::5000
```

해결 방법:
1. `.env` 파일에서 PORT 번호 변경 (예: 5001)
2. 또는 실행 중인 프로세스 종료

### CORS 에러

프론트엔드에서 API 호출 시 CORS 에러가 발생하면:

`server/server.js`의 CORS 설정 확인:
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 주소
  credentials: true
}));
```

## 📞 지원

문제가 있으면 이슈를 남겨주세요!
