const express = require('express');
const router = express.Router();
const { User, Symptom } = require('../database/models');
const { authenticateToken } = require('../auth/jwt');
const { Op } = require('sequelize');

// Get matched users (based on similar symptoms)
router.get('/matches', authenticateToken, async (req, res) => {
  try {
    // Get current user's symptoms
    const userSymptoms = await Symptom.findAll({
      where: { userId: req.user.id },
      attributes: ['type', 'severity']
    });

    if (userSymptoms.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Find users with similar symptoms
    const symptomTypes = userSymptoms.map(s => s.type);
    const allUsers = await User.findAll({
      where: { id: { [Op.ne]: req.user.id } },
      include: [{
        model: Symptom,
        as: 'symptoms',
        attributes: ['type', 'severity']
      }]
    });

    // Calculate similarity scores
    const matches = allUsers.map(user => {
      if (!user.symptoms || user.symptoms.length === 0) return null;

      const userSymptomTypes = user.symptoms.map(s => s.type);
      const commonSymptoms = symptomTypes.filter(t => userSymptomTypes.includes(t));
      const similarity = commonSymptoms.length / Math.max(symptomTypes.length, userSymptomTypes.length);

      return {
        id: user.id,
        name: user.name || user.email.split('@')[0],
        email: user.email,
        similarity: Math.round(similarity * 100) / 100,
        commonSymptoms
      };
    }).filter(m => m && m.similarity > 0.5)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    res.json({ success: true, data: matches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ success: false, error: 'Failed to get matches' });
  }
});

module.exports = router;

