const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const seedData = require('../data/seedData');

let memoryResources = JSON.parse(JSON.stringify(seedData.resources));

// @route   GET /api/resources
// @desc    Get resources filtered by type (roadmap, interview_experience, study_material, pyq)
router.get('/', async (req, res, next) => {
  try {
    const { type, category, company } = req.query;

    try {
      const query = {};
      if (type && type !== 'all') query.type = type;
      if (category && category !== 'all') query.category = category;
      if (company && company !== 'all') query.company = company;

      const resources = await Resource.find(query);
      if (resources && resources.length > 0) {
        return res.status(200).json({ success: true, count: resources.length, data: resources });
      }
    } catch (e) {}

    let results = memoryResources;
    if (type && type !== 'all') {
      results = results.filter(r => r.type === type);
    }
    if (category && category !== 'all') {
      results = results.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }
    if (company && company !== 'all') {
      results = results.filter(r => r.company.toLowerCase() === company.toLowerCase());
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/resources/:id
// @desc    Get single resource details
router.get('/:id', async (req, res, next) => {
  try {
    try {
      const resource = await Resource.findById(req.params.id);
      if (resource) {
        return res.status(200).json({ success: true, data: resource });
      }
    } catch (e) {}

    const resource = memoryResources.find(r => r._id === req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    res.status(200).json({ success: true, data: resource });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
