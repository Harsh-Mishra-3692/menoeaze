const User = require('./User');
const Symptom = require('./Symptom');
const ChatMessage = require('./ChatMessage');
const Post = require('./Post');
const Comment = require('./Comment');

// Define associations
User.hasMany(Symptom, { foreignKey: 'userId', as: 'symptoms' });
Symptom.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(ChatMessage, { foreignKey: 'userId', as: 'messages' });
ChatMessage.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Symptom,
  ChatMessage,
  Post,
  Comment
};

