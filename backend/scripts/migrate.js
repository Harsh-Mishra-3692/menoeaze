const { sequelize } = require('../database/connection');
const models = require('../database/models');

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database migrated successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();

