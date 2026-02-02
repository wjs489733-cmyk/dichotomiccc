const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  // 기본 정보
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'uxui', 'branding', 'editorial', 'graphic', 'motion', 'etc',
      'selected_ddd', 'selected_thevois', 'selected_aurevo', 'selected_solife',
      'selected_iptime_re', 'selected_drOracle_re', 'selected_re_memory'
    ]
  },
  year: {
    type: String,
    required: true
  },

  // Selected Work 여부
  isFeatured: {
    type: Boolean,
    default: false
  },

  // 썸네일 이미지
  thumbnail: {
    url: String,
    publicId: String  // Cloudinary public_id for deletion
  },

  // 프로젝트 상세 이미지들
  images: [{
    url: String,
    publicId: String,
    caption: String,
    order: Number
  }],

  // 프로젝트 설명 (Rich Text HTML)
  description: {
    type: String,
    default: ''
  },

  // 메타데이터
  meta: {
    client: String,
    role: String,
    tags: [String],
    link: String
  },

  // 공개 여부
  isPublished: {
    type: Boolean,
    default: false
  },

  // 정렬 순서
  order: {
    type: Number,
    default: 0
  },

  // 생성/수정 정보
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// slug 자동 생성 미들웨어 (validation 전에 실행)
projectSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    // 타이틀에서 slug 생성 (영문, 숫자, 하이픈만 허용)
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/[가-힣]/g, '') // 한글 제거
      .replace(/(^-|-$)/g, '')
      .replace(/-+/g, '-'); // 연속 하이픈 제거

    // slug가 비어있으면 타임스탬프 사용
    if (!baseSlug) {
      baseSlug = 'project-' + Date.now();
    }

    this.slug = baseSlug;
  }
  next();
});

// 업데이트 시간 자동 갱신
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
