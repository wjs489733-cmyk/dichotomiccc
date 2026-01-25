# Dichotomiccc Backend Server

백엔드 API 서버 for 포트폴리오 관리 시스템

## 🚀 시작하기

### 1. 환경 변수 설정

`.env.example` 파일을 복사해서 `.env` 파일을 생성하세요:

```bash
cp .env.example .env
```

그리고 다음 값들을 설정하세요:

- **MONGODB_URI**: MongoDB Atlas 연결 문자열
- **JWT_SECRET**: JWT 토큰용 랜덤 문자열
- **CLOUDINARY_***: Cloudinary 계정 정보
- **ADMIN_EMAIL/PASSWORD**: 관리자 계정 정보

### 2. Dependencies 설치

```bash
npm install
```

### 3. 서버 실행

개발 모드 (nodemon):
```bash
npm run dev
```

프로덕션 모드:
```bash
npm start
```

## 📡 API 엔드포인트

### 인증 (Auth)
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보
- `POST /api/auth/change-password` - 비밀번호 변경

### 프로젝트 (Projects)
- `GET /api/projects` - 모든 프로젝트 조회 (public)
- `GET /api/projects/:slug` - 특정 프로젝트 조회
- `GET /api/projects/admin/all` - 모든 프로젝트 (관리자)
- `POST /api/projects` - 프로젝트 생성
- `PUT /api/projects/:id` - 프로젝트 수정
- `DELETE /api/projects/:id` - 프로젝트 삭제

### 업로드 (Upload)
- `POST /api/upload/image` - 단일 이미지 업로드
- `POST /api/upload/multiple` - 다중 이미지 업로드
- `DELETE /api/upload/:publicId` - 이미지 삭제

## 🔐 인증

모든 관리자 API는 JWT 토큰이 필요합니다.

요청 헤더에 다음을 포함하세요:
```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ 데이터베이스 스키마

### User
- email: String (unique)
- password: String (hashed)
- role: 'admin' | 'editor'

### Project
- title: String
- slug: String (auto-generated)
- category: 'uxui' | 'branding' | 'editorial' | 'graphic' | 'motion' | 'etc'
- year: String
- isFeatured: Boolean (Selected Work 여부)
- thumbnail: { url, publicId }
- images: [{ url, publicId, caption, order }]
- description: String (HTML)
- meta: { client, role, tags, link }
- isPublished: Boolean
- order: Number

## 📦 배포

Railway 또는 Render에 배포 가능합니다.

### Railway
1. Railway 계정 생성
2. New Project → Deploy from GitHub
3. 환경 변수 설정
4. 자동 배포

### Render
1. Render 계정 생성
2. New Web Service
3. GitHub 연동
4. 환경 변수 설정
5. Deploy

## ⚙️ 환경 변수

필수 환경 변수:
- `MONGODB_URI` - MongoDB 연결 문자열
- `JWT_SECRET` - JWT 시크릿 키
- `CLOUDINARY_CLOUD_NAME` - Cloudinary 클라우드 이름
- `CLOUDINARY_API_KEY` - Cloudinary API 키
- `CLOUDINARY_API_SECRET` - Cloudinary API 시크릿
