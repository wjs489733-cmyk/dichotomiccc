const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, featured, published = 'true' } = req.query;

    let query = {};

    // Filter by published status (default: only published)
    if (published === 'true') {
      query.isPublished = true;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const projects = await Project.find(query)
      .sort({ order: 1, createdAt: -1 })
      .select('-createdBy -updatedBy');

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/projects/:slug
// @desc    Get single project by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      isPublished: true
    }).select('-createdBy -updatedBy');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/projects/admin/all
// @desc    Get all projects (including unpublished) for admin
// @access  Private
router.get('/admin/all', auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ order: 1, createdAt: -1 })
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email');

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/projects/admin/:id
// @desc    Get single project by ID for admin (including unpublished)
// @access  Private
router.get('/admin/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('category').isIn(['uxui', 'branding', 'editorial', 'graphic', 'motion', 'etc'])
    .withMessage('Invalid category'),
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

    const projectData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
