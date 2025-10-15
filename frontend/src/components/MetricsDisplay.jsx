import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const MetricCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border-l-4 border-primary">
    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-blue-900 dark:text-blue-400 text-2xl font-bold">{value}</p>
  </div>
);

const MetricsDisplay = ({ patientData }) => {
  const { t } = useLanguage();
  
  if (!patientData) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-4">
        <MetricCard title={t('age')} value={patientData.age} />
        <MetricCard title={t('diabetes')} value={patientData.diabetes} />
      </div>
      <div className="space-y-4">
        <MetricCard title={t('height')} value={patientData.height} />
        <MetricCard title={t('highBP')} value={patientData.high_bp} />
      </div>
      <div className="space-y-4">
        <MetricCard title={t('weight')} value={patientData.weight} />
        <MetricCard title={t('familyHistory')} value={patientData.family_history} />
      </div>
    </div>
  );
};

export default MetricsDisplay;
