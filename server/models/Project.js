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
    enum: ['uxui', 'branding', 'editorial', 'graphic', 'motion', 'etc']
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

// slug 자동 생성 미들웨어
projectSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
