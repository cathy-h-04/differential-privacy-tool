import React from 'react';
import { FaChartBar, FaChartLine, FaChartPie, FaLock } from 'react-icons/fa';
import Card from './Card';

export default function DataVisualization({ privatizedData, epsilon }) {
  if (!privatizedData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaChartLine className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-500">Submit your financial data to see the visualization</p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getPrivacyLevelColor = (level) => {
    switch (level) {
      case 'High': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getPrivacyLevel = (eps) => {
    if (eps <= 0.5) return 'High';
    if (eps <= 1.5) return 'Medium';
    return 'Low';
  };

  const privacyLevel = getPrivacyLevel(epsilon);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Privatized Data</h2>
        <div className="flex items-center space-x-2">
          <FaLock className={`text-lg ${getPrivacyLevelColor(privacyLevel)}`} />
          <span className={`font-semibold ${getPrivacyLevelColor(privacyLevel)}`}>
            {privacyLevel} Privacy
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Net Worth</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(privatizedData.netWorth)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Monthly Housing</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(privatizedData.rentOrMortgage)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Loan Debt</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(privatizedData.loanDebt)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Medical Expenses</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(privatizedData.medicalExpenses)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500">Income Range</h3>
        <p className="text-xl font-bold text-gray-900">
          {privatizedData.incomeLabel}
        </p>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          Data has been privatized using ε = {epsilon.toFixed(2)}. 
          {privacyLevel === 'High' && ' This provides maximum privacy protection.'}
          {privacyLevel === 'Medium' && ' This provides a balance between privacy and accuracy.'}
          {privacyLevel === 'Low' && ' This provides maximum accuracy with reduced privacy protection.'}
        </p>
      </div>
    </div>
  );
} 