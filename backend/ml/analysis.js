/**
 * Pattern analysis for symptoms (JavaScript version)
 */

function analyzePatterns(symptoms) {
  if (!symptoms || symptoms.length === 0) {
    return {
      frequency: 0,
      avgSeverity: 0,
      trend: 'insufficient_data',
      totalSymptoms: 0
    };
  }

  // Convert Sequelize instances to plain objects if needed
  const symptomsArray = symptoms.map(s => ({
    timestamp: s.timestamp || s.createdAt || new Date(),
    severity: s.severity || 0
  }));

  // Calculate frequency (symptoms per week)
  let frequency = 0;
  if (symptomsArray.length > 1) {
    const firstDate = new Date(symptomsArray[0].timestamp);
    const lastDate = new Date(symptomsArray[symptomsArray.length - 1].timestamp);
    const days = Math.max(1, (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    frequency = (symptomsArray.length / days) * 7;
  } else if (symptomsArray.length === 1) {
    frequency = 7; // If only one symptom, assume weekly frequency
  }

  // Average severity
  const avgSeverity = symptomsArray.reduce((sum, s) => sum + (s.severity || 0), 0) / symptomsArray.length;

  // Trend analysis (increasing/decreasing)
  let trend = 'insufficient_data';
  if (symptomsArray.length >= 7) {
    const recent = symptomsArray.slice(-7);
    const older = symptomsArray.length >= 14 ? symptomsArray.slice(-14, -7) : symptomsArray.slice(0, -7);

    const recentAvg = recent.reduce((sum, s) => sum + (s.severity || 0), 0) / recent.length;
    const olderAvg = older.length > 0 
      ? older.reduce((sum, s) => sum + (s.severity || 0), 0) / older.length 
      : recentAvg;

    if (recentAvg > olderAvg * 1.1) {
      trend = 'increasing';
    } else if (recentAvg < olderAvg * 0.9) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }
  } else if (symptomsArray.length >= 3) {
    // For smaller datasets, compare first half vs second half
    const mid = Math.floor(symptomsArray.length / 2);
    const firstHalf = symptomsArray.slice(0, mid);
    const secondHalf = symptomsArray.slice(mid);

    const firstAvg = firstHalf.reduce((sum, s) => sum + (s.severity || 0), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, s) => sum + (s.severity || 0), 0) / secondHalf.length;

    if (secondAvg > firstAvg * 1.1) {
      trend = 'increasing';
    } else if (secondAvg < firstAvg * 0.9) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }
  }

  return {
    frequency: Math.round(frequency * 100) / 100,
    avgSeverity: Math.round(avgSeverity * 100) / 100,
    trend: trend,
    totalSymptoms: symptomsArray.length
  };
}

module.exports = {
  analyzePatterns
};

