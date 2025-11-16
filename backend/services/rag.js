const { Symptom } = require('../database/models');

// Build context from user's symptoms for RAG
async function getRAGContext(userId, query) {
  try {
    // Get user's recent symptoms
    const recentSymptoms = await Symptom.findAll({
      where: { userId },
      order: [['timestamp', 'DESC']],
      limit: 10
    });

    // Get symptom statistics
    const allSymptoms = await Symptom.findAll({
      where: { userId },
      order: [['timestamp', 'DESC']]
    });

    // Build context from user's symptoms
    let context = '';
    
    if (allSymptoms.length > 0) {
      const avgSeverity = allSymptoms.reduce((sum, s) => sum + s.severity, 0) / allSymptoms.length;
      const symptomTypes = {};
      allSymptoms.forEach(s => {
        symptomTypes[s.type] = (symptomTypes[s.type] || 0) + 1;
      });
      const mostCommon = Object.entries(symptomTypes).sort((a, b) => b[1] - a[1])[0];

      context += `User's symptom history:\n`;
      context += `- Total symptoms logged: ${allSymptoms.length}\n`;
      context += `- Average severity: ${avgSeverity.toFixed(1)}/10\n`;
      if (mostCommon) {
        context += `- Most common symptom: ${mostCommon[0]} (${mostCommon[1]} times)\n`;
      }
      
      if (recentSymptoms.length > 0) {
        context += `\nRecent symptoms (last 10):\n`;
        recentSymptoms.forEach(s => {
          context += `- ${s.type} (severity: ${s.severity}/10`;
          if (s.mood) context += `, mood: ${s.mood}`;
          context += `, ${new Date(s.timestamp).toLocaleDateString()})\n`;
        });
      }
    } else {
      context = 'User is new and has not logged any symptoms yet.';
    }

    return context;
  } catch (error) {
    console.error('RAG context error:', error);
    return '';
  }
}

module.exports = {
  getRAGContext
};

