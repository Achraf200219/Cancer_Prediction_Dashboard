import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PredictionCard = ({ prediction }) => {
  const { t } = useLanguage();
  
  if (!prediction) return null;

  const { cancer_chance, risk_level, risk_class } = prediction;
  
  const getRiskTranslation = (level) => {
    switch (level) {
      case 'High': return t('highRisk');
      case 'Moderate': return t('moderateRisk');
      case 'Low': return t('lowRisk');
      default: return level;
    }
  };

  const getGradientClass = () => {
    switch (risk_class) {
      case 'high-risk':
        return 'bg-gradient-to-br from-red-400 to-red-600';
      case 'moderate-risk':
        return 'bg-gradient-to-br from-yellow-300 to-yellow-500';
      case 'low-risk':
        return 'bg-gradient-to-br from-green-400 to-green-600';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  return (
    <div className={`${getGradientClass()} rounded-lg p-8 text-white text-center shadow-lg`}>
      <p className="text-xl font-semibold mb-2">{getRiskTranslation(risk_level)}</p>
      <h2 className="text-6xl font-bold mb-2">{cancer_chance.toFixed(1)}%</h2>
      <p className="text-lg">{t('chanceOfCancer')}</p>
    </div>
  );
};

export default PredictionCard;
