const mongoose = require('mongoose');

const selectedWorkSchema = new mongoose.Schema({
  // 기본 정보
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  displayTitle: {
    type: String,
    trim: true
  },

  // 메타 정보
  category: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true
  },
  tools: {
    type: String,
    default: ''
  },

  // 콘텐츠
  overview: {
    type: String,
    default: ''
  },
  detail: {
    type: String,
    default: ''
  },

  // 대표 썸네일 (홈 화면 프리뷰용)
  thumbnail: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },

  // 갤러리 이미지 (여러 개)
  gallery: [{
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 }
  }],

  // 네비게이션 (이전/다음 프로젝트)
  navigation: {
    prev: {
      slug: { type: String, default: '' },
      title: { type: String, default: '' }
    },
    next: {
      slug: { type: String, default: '' },
      title: { type: String, default: '' }
    }
  },

  // 표시 순서
  order: {
    type: Number,
    default: 0
  },

  // 공개 여부
  published: {
    type: Boolean,
    default: false
  },

  // 메타데이터
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 업데이트 시간 자동 갱신
selectedWorkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SelectedWork', selectedWorkSchema);
