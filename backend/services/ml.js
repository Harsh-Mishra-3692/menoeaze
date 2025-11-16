const { Symptom } = require('../database/models');
const { analyzePatterns } = require('../ml/analysis');

// TODO: Implement ML model loading and prediction
// const { loadModel, predict } = require('../ml/inference');

// Get personalized insights based on ML model
async function getPersonalizedInsights(userId) {
  try {
    const symptoms = await Symptom.findAll({
      where: { userId },
      order: [['timestamp', 'DESC']],
      limit: 30
    });

    if (symptoms.length === 0) {
      return {
        message: 'Start logging symptoms to get personalized insights',
        recommendations: []
      };
    }

    // TODO: Use ML model for predictions when implemented
    // const model = await loadModel();
    // const predictions = symptoms.map(s => {
    //   const features = [s.severity, new Date(s.timestamp).getDay(), s.mood ? 1 : 0];
    //   return predict(model, features);
    // });

    // Analyze patterns
    const patterns = analyzePatterns(symptoms);

    return {
      // predictions, // TODO: Add when ML model is implemented
      patterns,
      recommendations: generateRecommendations(symptoms, patterns)
    };
  } catch (error) {
    console.error('Get insights error:', error);
    throw error;
  }
}

// Generate health report
async function generateReport(userId, startDate, endDate) {
  try {
    const { Op } = require('sequelize');
    const where = { userId };
    if (startDate) where.timestamp = { ...where.timestamp, [Op.gte]: startDate };
    if (endDate) where.timestamp = { ...where.timestamp, [Op.lte]: endDate };

    const symptoms = await Symptom.findAll({
      where,
      order: [['timestamp', 'ASC']]
    });

    const report = {
      period: { startDate, endDate },
      totalSymptoms: symptoms.length,
      averageSeverity: symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length || 0,
      mostCommonSymptom: getMostCommonSymptom(symptoms),
      trends: analyzeTrends(userId, symptoms),
      recommendations: generateRecommendations(symptoms)
    };

    return report;
  } catch (error) {
    console.error('Generate report error:', error);
    throw error;
  }
}

// Analyze trends
async function analyzeTrends(userId, symptoms = null) {
  try {
    if (!symptoms) {
      symptoms = await Symptom.findAll({
        where: { userId },
        order: [['timestamp', 'ASC']]
      });
    }

    if (!symptoms || symptoms.length === 0) {
      return {
        frequency: 0,
        avgSeverity: 0,
        trend: 'insufficient_data',
        totalSymptoms: 0
      };
    }

    return analyzePatterns(symptoms);
  } catch (error) {
    console.error('Analyze trends error:', error);
    throw error;
  }
}

function generateRecommendations(symptoms, patterns = null) {
  const recommendations = [];
  
  if (symptoms.length === 0) return recommendations;

  const avgSeverity = symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length;
  
  if (avgSeverity > 7) {
    recommendations.push({
      type: 'urgent',
      message: 'Consider consulting with a healthcare provider about your symptoms',
      priority: 'high'
    });
  }

  if (patterns && patterns.frequency > 5) {
    recommendations.push({
      type: 'lifestyle',
      message: 'Regular exercise and stress management may help reduce symptom frequency',
      priority: 'medium'
    });
  }

  return recommendations;
}

function getMostCommonSymptom(symptoms) {
  const counts = {};
  symptoms.forEach(s => {
    counts[s.type] = (counts[s.type] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
}

module.exports = {
  getPersonalizedInsights,
  generateReport,
  analyzeTrends
};

