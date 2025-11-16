const { User, Symptom } = require('../database/models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      email: 'test@menoeaze.com',
      password: hashedPassword,
      name: 'Test User'
    });

    // Create sample symptoms
    const symptoms = [
      {
        userId: user.id,
        type: 'Hot flashes',
        description: 'Experiencing sudden heat waves',
        severity: 7,
        mood: '😰 Anxious',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        userId: user.id,
        type: 'Sleep issues',
        description: 'Difficulty falling asleep',
        severity: 6,
        mood: '😴 Tired',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    await Symptom.bulkCreate(symptoms);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();

