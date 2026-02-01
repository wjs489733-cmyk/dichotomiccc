const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const SelectedWork = require('../models/SelectedWork');
const auth = require('../middleware/auth');

// @route   GET /api/selected-works
// @desc    Get all selected works (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { published = 'true' } = req.query;

    let query = {};

    // Filter by published status (default: only published)
    if (published === 'true') {
      query.published = true;
    }

    const works = await SelectedWork.find(query)
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: works.length,
      data: works
    });
  } catch (error) {
    console.error('Get selected works error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/selected-works/admin/all
// @desc    Get all selected works (including unpublished) for admin
// @access  Private
// NOTE: This route must be defined BEFORE /:slug to avoid "admin" being matched as a slug
router.get('/admin/all', auth, async (req, res) => {
  try {
    const works = await SelectedWork.find()
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: works.length,
      data: works
    });
  } catch (error) {
    console.error('Get all selected works error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/selected-works/admin/:id
// @desc    Get single selected work by ID for admin (including unpublished)
// @access  Private
// NOTE: This route must be defined BEFORE /:slug to avoid "admin" being matched as a slug
router.get('/admin/:id', auth, async (req, res) => {
  try {
    const work = await SelectedWork.findById(req.params.id);

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Selected work not found'
      });
    }

    res.json({
      success: true,
      data: work
    });
  } catch (error) {
    console.error('Get selected work by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/selected-works/:slug
// @desc    Get single selected work by slug
// @access  Public
// NOTE: This wildcard route must be defined AFTER specific routes like /admin/all and /admin/:id
router.get('/:slug', async (req, res) => {
  try {
    const work = await SelectedWork.findOne({
      slug: req.params.slug,
      published: true
    });

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Selected work not found'
      });
    }

    res.json({
      success: true,
      data: work
    });
  } catch (error) {
    console.error('Get selected work error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/selected-works
// @desc    Create new selected work
// @access  Private
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('year').notEmpty().withMessage('Year is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if slug already exists
    const existingWork = await SelectedWork.findOne({ slug: req.body.slug });
    if (existingWork) {
      return res.status(400).json({
        success: false,
        message: 'A selected work with this slug already exists'
      });
    }

    const work = new SelectedWork(req.body);
    await work.save();

    res.status(201).json({
      success: true,
      data: work
    });
  } catch (error) {
    console.error('Create selected work error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/selected-works/reorder/all
// @desc    Update order of selected works
// @access  Private
// NOTE: This route must be defined BEFORE /:id to avoid "reorder" being matched as an id
router.put('/reorder/all', auth, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    // Update order for each item
    const updatePromises = items.map((item, index) =>
      SelectedWork.findByIdAndUpdate(item.id, { order: index })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Reorder selected works error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/selected-works/:id
// @desc    Update selected work
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const work = await SelectedWork.findById(req.params.id);

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Selected work not found'
      });
    }

    const updatedWork = await SelectedWork.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedWork
    });
  } catch (error) {
    console.error('Update selected work error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/selected-works/:id
// @desc    Delete selected work
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const work = await SelectedWork.findById(req.params.id);

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Selected work not found'
      });
    }

    await work.deleteOne();

    res.json({
      success: true,
      message: 'Selected work deleted successfully'
    });
  } catch (error) {
    console.error('Delete selected work error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
