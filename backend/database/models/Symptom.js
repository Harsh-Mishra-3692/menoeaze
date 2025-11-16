const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Symptom = sequelize.define('Symptom', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  issues: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: true
  },
  severity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Symptom;

