const express = require('express');
const router = express.Router();
const { Symptom } = require('../database/models');
const { authenticateToken } = require('../auth/jwt');
const { body, validationResult } = require('express-validator');

// Get all symptoms for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const symptoms = await Symptom.findAll({
      where: { userId: req.user.id },
      order: [['timestamp', 'DESC']]
    });

    res.json({ success: true, data: symptoms });
  } catch (error) {
    console.error('Get symptoms error:', error);
    res.status(500).json({ success: false, error: 'Failed to get symptoms' });
  }
});

// Create symptom
router.post('/', [
  authenticateToken,
  body('type').notEmpty().trim(),
  body('severity').isInt({ min: 1, max: 10 }),
  body('description').optional().trim(),
  body('issues').optional().trim(),
  body('mood').optional().trim(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const symptom = await Symptom.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({ success: true, data: symptom });
  } catch (error) {
    console.error('Create symptom error:', error);
    res.status(500).json({ success: false, error: 'Failed to create symptom' });
  }
});

// Get symptom by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const symptom = await Symptom.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!symptom) {
      return res.status(404).json({ success: false, error: 'Symptom not found' });
    }

    res.json({ success: true, data: symptom });
  } catch (error) {
    console.error('Get symptom error:', error);
    res.status(500).json({ success: false, error: 'Failed to get symptom' });
  }
});

// Update symptom
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const [updated] = await Symptom.update(req.body, {
      where: { id: req.params.id, userId: req.user.id },
      returning: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Symptom not found' });
    }

    const symptom = await Symptom.findByPk(req.params.id);
    res.json({ success: true, data: symptom });
  } catch (error) {
    console.error('Update symptom error:', error);
    res.status(500).json({ success: false, error: 'Failed to update symptom' });
  }
});

// Delete symptom
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Symptom.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Symptom not found' });
    }

    res.json({ success: true, message: 'Symptom deleted' });
  } catch (error) {
    console.error('Delete symptom error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete symptom' });
  }
});

module.exports = router;

