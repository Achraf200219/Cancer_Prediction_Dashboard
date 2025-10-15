import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PatientForm = ({ onSubmit, isLoading }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    age: 50,
    height_cm: 165.0,
    weight_kg: 70.0,
    has_diabetes: false,
    has_high_bp: false,
    family_history: false,
    age_at_menarche: 13,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              (name === 'age' || name === 'age_at_menarche') ? parseInt(value) :
              parseFloat(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-r border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{t('patientDetails')}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">{t('patientDetailsSubtitle')}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Biometrics Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 pb-2">{t('biometrics')}</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('age')}
            </label>
            <input
              type="number"
              name="age"
              min="20"
              max="90"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('height')}
            </label>
            <input
              type="number"
              name="height_cm"
              min="140"
              max="200"
              step="0.5"
              value={formData.height_cm}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('weight')}
            </label>
            <input
              type="number"
              name="weight_kg"
              min="40"
              max="150"
              step="0.5"
              value={formData.weight_kg}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Medical History Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 pb-2">{t('medicalHistory')}</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('hasDiabetes')}
            </label>
            <select
              name="has_diabetes"
              value={formData.has_diabetes ? "yes" : "no"}
              onChange={(e) => setFormData(prev => ({ ...prev, has_diabetes: e.target.value === "yes" }))}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="no">{t('no')}</option>
              <option value="yes">{t('yes')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('hasHighBP')}
            </label>
            <select
              name="has_high_bp"
              value={formData.has_high_bp ? "yes" : "no"}
              onChange={(e) => setFormData(prev => ({ ...prev, has_high_bp: e.target.value === "yes" }))}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="no">{t('no')}</option>
              <option value="yes">{t('yes')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('familyHistory')}
            </label>
            <select
              name="family_history"
              value={formData.family_history ? "yes" : "no"}
              onChange={(e) => setFormData(prev => ({ ...prev, family_history: e.target.value === "yes" }))}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="no">{t('no')}</option>
              <option value="yes">{t('yes')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('ageAtMenarche')}
            </label>
            <input
              type="number"
              name="age_at_menarche"
              min="8"
              max="20"
              value={formData.age_at_menarche}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? t('generating') : t('generatePrediction')}
        </button>
      </form>
    </div>
  );
};

export default PatientForm;
