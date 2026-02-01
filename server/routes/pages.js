const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const auth = require('../middleware/auth');

// 페이지 조회 (공개)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    let page = await Page.findOne({ slug });

    // 페이지가 없으면 기본값 반환
    if (!page) {
      const defaults = getDefaultContent(slug);
      if (!defaults) {
        return res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }
      return res.json({
        success: true,
        data: defaults
      });
    }

    res.json({
      success: true,
      data: page
    });

  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// 페이지 수정 (관리자 전용)
router.put('/:slug', auth, async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, subtitle, content, contactInfo, profile } = req.body;

    // slug 유효성 검사
    if (!['about', 'contact'].includes(slug)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid page slug'
      });
    }

    let page = await Page.findOne({ slug });

    if (page) {
      // 기존 페이지 업데이트
      page.title = title || page.title;
      page.subtitle = subtitle !== undefined ? subtitle : page.subtitle;
      page.content = content !== undefined ? content : page.content;
      page.contactInfo = contactInfo || page.contactInfo;
      page.profile = profile || page.profile;
      page.updatedBy = req.user._id;
    } else {
      // 새 페이지 생성
      page = new Page({
        slug,
        title: title || slug,
        subtitle,
        content,
        contactInfo,
        profile,
        updatedBy: req.user._id
      });
    }

    await page.save();

    res.json({
      success: true,
      message: 'Page updated successfully',
      data: page
    });

  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// 기본 콘텐츠 반환
function getDefaultContent(slug) {
  const defaults = {
    about: {
      slug: 'about',
      title: 'about',
      subtitle: 'min',
      content: '',
      profile: {
        name: 'min',
        focus: 'branding / editorial / uxui / graphic',
        tools: 'Figma, Adobe CC, Cinema 4D, Web',
        bio: '시각디자인을 공부하며, 브랜딩·편집·UXUI·모션까지 폭넓게 실험하는 아카이브를 만들고 있다. 이 사이트는 프로젝트를 "작품"이 아니라 "과정"으로 남기기 위한 공간이다.'
      },
      contactInfo: {
        email: 'wjs400@naver.com'
      }
    },
    contact: {
      slug: 'contact',
      title: 'contact',
      subtitle: '',
      content: '',
      contactInfo: {
        email: 'wjs400@naver.com',
        instagram: 'https://instagram.com/dichotomiccc'
      }
    }
  };

  return defaults[slug] || null;
}

module.exports = router;
