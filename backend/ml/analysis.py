"""
Pattern analysis for symptoms.
"""
import numpy as np
from datetime import datetime, timedelta

def analyzePatterns(symptoms):
    """
    Analyze patterns in symptom data.
    
    Args:
        symptoms: Array of symptom objects with timestamp, severity, type
    
    Returns:
        Dictionary with pattern analysis
    """
    if not symptoms or len(symptoms) == 0:
        return {
            frequency: 0,
            avgSeverity: 0,
            trends: []
        }
    
    # Calculate frequency (symptoms per week)
    if len(symptoms) > 1:
        first_date = symptoms[0].timestamp
        last_date = symptoms[-1].timestamp
        days = (last_date - first_date).days or 1
        frequency = (len(symptoms) / days) * 7
    else:
        frequency = 0
    
    # Average severity
    avgSeverity = sum(s.severity for s in symptoms) / len(symptoms)
    
    # Trend analysis (increasing/decreasing)
    if len(symptoms) >= 7:
        recent = symptoms[-7:]
        older = symptoms[-14:-7] if len(symptoms) >= 14 else symptoms[:-7]
        
        recent_avg = sum(s.severity for s in recent) / len(recent)
        older_avg = sum(s.severity for s in older) / len(older) if older else recent_avg
        
        trend = 'increasing' if recent_avg > older_avg else 'decreasing' if recent_avg < older_avg else 'stable'
    else:
        trend = 'insufficient_data'
    
    return {
        frequency: round(frequency, 2),
        avgSeverity: round(avgSeverity, 2),
        trend: trend,
        totalSymptoms: len(symptoms)
    }

