const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  // 페이지 식별자 (about, contact 등)
  slug: {
    type: String,
    required: true,
    unique: true,
    enum: ['about', 'contact']
  },

  // 페이지 제목
  title: {
    type: String,
    required: true,
    trim: true
  },

  // 부제목
  subtitle: {
    type: String,
    default: ''
  },

  // 페이지 내용 (Rich Text HTML)
  content: {
    type: String,
    default: ''
  },

  // 연락처 정보 (contact 페이지용)
  contactInfo: {
    email: String,
    instagram: String,
    blog: String,
    other: String
  },

  // 프로필 정보 (about 페이지용)
  profile: {
    name: String,
    focus: String,
    tools: String,
    bio: String
  },

  // 페이지 하단 노트 (수정 가능한 안내 문구)
  note: {
    type: String,
    default: ''
  },

  // 수정 정보
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 업데이트 시간 자동 갱신
pageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Page', pageSchema);
