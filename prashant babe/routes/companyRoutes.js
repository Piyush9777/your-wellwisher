const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const seedData = require('../data/seedData');

let memoryCompanies = JSON.parse(JSON.stringify(seedData.companies));

// @route   GET /api/companies
// @desc    List all companies with recruitment stats
router.get('/', async (req, res, next) => {
  try {
    try {
      const companies = await Company.find();
      if (companies && companies.length > 0) {
        return res.status(200).json({ success: true, count: companies.length, data: companies });
      }
    } catch (e) {}

    res.status(200).json({
      success: true,
      count: memoryCompanies.length,
      data: memoryCompanies
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/companies/:slug
// @desc    Get detailed company recruitment blueprint and questions
router.get('/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    try {
      const company = await Company.findOne({ slug });
      if (company) {
        return res.status(200).json({ success: true, data: company });
      }
    } catch (e) {}

    const company = memoryCompanies.find(c => c.slug === slug);
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    res.status(200).json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
