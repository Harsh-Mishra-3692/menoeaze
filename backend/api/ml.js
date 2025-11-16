const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../auth/jwt');
const { getPersonalizedInsights, generateReport, analyzeTrends } = require('../services/ml');

// Get personalized insights
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const insights = await getPersonalizedInsights(req.user.id);
    res.json({ success: true, data: insights });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ success: false, error: 'Failed to get insights' });
  }
});

// Generate health report
router.get('/report', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await generateReport(req.user.id, startDate, endDate);
    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
});

// Analyze trends
router.get('/trends', authenticateToken, async (req, res) => {
  try {
    const trends = await analyzeTrends(req.user.id);
    res.json({ success: true, data: trends });
  } catch (error) {
    console.error('Analyze trends error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze trends' });
  }
});

module.exports = router;

