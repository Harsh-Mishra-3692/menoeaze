const express = require('express');
const router = express.Router();
const { User } = require('../database/models');
const { authenticateToken } = require('../auth/jwt');

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name', 'createdAt']
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    
    await User.update(
      { name },
      { where: { id: req.user.id } }
    );

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name', 'createdAt']
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

module.exports = router;

