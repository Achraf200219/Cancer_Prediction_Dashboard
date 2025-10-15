import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const DownloadReport = ({ prediction, patientData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateCSV = () => {
    const date = new Date().toLocaleString();
    const { cancer_chance, risk_level } = prediction;
    
    const csvContent = [
      [t('reportTitle')],
      [''],
      [t('generatedOn'), date],
      [''],
      [t('patientInformation')],
      [t('age'), patientData.age],
      [t('height'), patientData.height],
      [t('weight'), patientData.weight],
      [t('diabetes'), patientData.diabetes],
      [t('highBP'), patientData.high_bp],
      [t('familyHistory'), patientData.family_history],
      [''],
      [t('predictionResults')],
      [t('riskLevel'), risk_level],
      [t('chance'), `${cancer_chance.toFixed(1)}%`],
      [''],
      [t('disclaimer')]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cancer_prediction_report_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const generatePDF = async () => {
    // Dynamic import to reduce initial bundle size
    const jsPDF = (await import('jspdf')).default;
    await import('jspdf-autotable');
    
    const doc = new jsPDF();
    const date = new Date().toLocaleString();
    const { cancer_chance, risk_level } = prediction;

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(t('reportTitle'), 105, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`${t('generatedOn')}: ${date}`, 105, 28, { align: 'center' });
    
    // Patient Information
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(t('patientInformation'), 20, 45);
    
    doc.autoTable({
      startY: 50,
      head: [['Field', 'Value']],
      body: [
        [t('age'), patientData.age.toString()],
        [t('height'), patientData.height],
        [t('weight'), patientData.weight],
        [t('diabetes'), patientData.diabetes],
        [t('highBP'), patientData.high_bp],
        [t('familyHistory'), patientData.family_history],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 136, 229] },
    });

    // Prediction Results
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(t('predictionResults'), 20, finalY);
    
    doc.autoTable({
      startY: finalY + 5,
      head: [['Metric', 'Value']],
      body: [
        [t('riskLevel'), risk_level],
        [t('chance'), `${cancer_chance.toFixed(1)}%`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 136, 229] },
      bodyStyles: {
        fontSize: 12,
        fontStyle: 'bold',
      },
    });

    // Disclaimer
    const disclaimerY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(9);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(100);
    const splitDisclaimer = doc.splitTextToSize(t('disclaimer'), 170);
    doc.text(splitDisclaimer, 20, disclaimerY);

    // Save
    doc.save(`cancer_prediction_report_${Date.now()}.pdf`);
    setIsOpen(false);
  };

  if (!prediction) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <span>{t('downloadReport')}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <button
            onClick={generatePDF}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg transition-colors"
          >
            <div className="font-semibold text-gray-800 dark:text-white">{t('downloadPDF')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Portable Document Format</div>
          </button>
          
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          
          <button
            onClick={generateCSV}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg transition-colors"
          >
            <div className="font-semibold text-gray-800 dark:text-white">{t('downloadCSV')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Comma Separated Values</div>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadReport;
