const express = require('express');
const router = express.Router();
const { Post, Comment, User } = require('../database/models');
const { authenticateToken } = require('../auth/jwt');
const { body, validationResult } = require('express-validator');

// Get all posts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'name']
      }, {
        model: Comment,
        as: 'comments',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name']
        }],
        order: [['createdAt', 'ASC']]
      }],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    // Filter out user info if anonymous
    const filteredPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      isAnonymous: post.isAnonymous,
      likes: post.likes,
      createdAt: post.createdAt,
      user: post.isAnonymous ? null : {
        id: post.user.id,
        name: post.user.name || post.user.email.split('@')[0],
        email: post.user.email
      },
      comments: post.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        isAnonymous: comment.isAnonymous,
        createdAt: comment.createdAt,
        user: comment.isAnonymous ? null : {
          id: comment.user.id,
          name: comment.user.name || comment.user.email.split('@')[0]
        }
      }))
    }));

    res.json({ success: true, data: filteredPosts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ success: false, error: 'Failed to get posts' });
  }
});

// Create post
router.post('/', [
  authenticateToken,
  body('content').notEmpty().trim().isLength({ min: 1, max: 2000 }),
  body('isAnonymous').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { content, isAnonymous = false } = req.body;

    const post = await Post.create({
      userId: req.user.id,
      content,
      isAnonymous: Boolean(isAnonymous)
    });

    const postWithUser = await Post.findByPk(post.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'name']
      }]
    });

    res.status(201).json({
      success: true,
      data: {
        id: postWithUser.id,
        content: postWithUser.content,
        isAnonymous: postWithUser.isAnonymous,
        likes: postWithUser.likes,
        createdAt: postWithUser.createdAt,
        user: postWithUser.isAnonymous ? null : {
          id: postWithUser.user.id,
          name: postWithUser.user.name || postWithUser.user.email.split('@')[0],
          email: postWithUser.user.email
        }
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, error: 'Failed to create post' });
  }
});

// Like post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    post.likes += 1;
    await post.save();

    res.json({ success: true, data: { likes: post.likes } });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ success: false, error: 'Failed to like post' });
  }
});

// Add comment
router.post('/:id/comments', [
  authenticateToken,
  body('content').notEmpty().trim().isLength({ min: 1, max: 500 }),
  body('isAnonymous').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const { content, isAnonymous = false } = req.body;

    const comment = await Comment.create({
      postId: req.params.id,
      userId: req.user.id,
      content,
      isAnonymous: Boolean(isAnonymous)
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'name']
      }]
    });

    res.status(201).json({
      success: true,
      data: {
        id: commentWithUser.id,
        content: commentWithUser.content,
        isAnonymous: commentWithUser.isAnonymous,
        createdAt: commentWithUser.createdAt,
        user: commentWithUser.isAnonymous ? null : {
          id: commentWithUser.user.id,
          name: commentWithUser.user.name || commentWithUser.user.email.split('@')[0]
        }
      }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, error: 'Failed to add comment' });
  }
});

module.exports = router;

