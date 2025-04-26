import React, { useState } from 'react';
import { FaLock, FaInfoCircle } from 'react-icons/fa';
import { usePrivacyForm } from '../hooks/usePrivacyForm';

const incomeLabels = [
  'Under $25,000',
  '$25,000 - $50,000',
  '$50,000 - $75,000',
  '$75,000 - $100,000',
  '$100,000 - $150,000',
  'Over $150,000'
];

export default function PrivacyForm({ onDataSubmit }) {
  const {
    formData,    setFormData,
    handleSubmit,
    error,
    isSubmitting,
    privacyLevel,
    epsilon,
    setEpsilon,
    mechanism,
    setMechanism
  } = usePrivacyForm();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const getPrivacyLevelColor = (level) => {
    switch (level) {
      case 'Low': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'High': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Financial Information</h2>
        <div className="flex items-center space-x-2">
          <FaLock className={`text-lg ${getPrivacyLevelColor(privacyLevel)}`} />
          <span className={`font-semibold ${getPrivacyLevelColor(privacyLevel)}`}>
            {privacyLevel} Privacy
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Net Worth
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <input
                type="number"
                name="netWorth"
                value={formData.netWorth}
                onChange={handleInputChange}
                className="pl-7 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rent/Mortgage
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <input
                type="number"
                name="rentOrMortgage"
                value={formData.rentOrMortgage}
                onChange={handleInputChange}
                className="pl-7 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Loan Debt
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <input
                type="number"
                name="loanDebt"
                value={formData.loanDebt}
                onChange={handleInputChange}
                className="pl-7 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Medical Expenses
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <input
                type="number"
                name="medicalExpenses"
                value={formData.medicalExpenses}
                onChange={handleInputChange}
                className="pl-7 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Income Range
          </label>
          <select
            name="incomeBin"
            value={formData.incomeBin}
            onChange={handleInputChange}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            {incomeLabels.map((label, index) => (
              <option key={index} value={index}>{label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Privacy Level (ε)
            </label>
            <span className="text-sm text-gray-500">{epsilon.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={epsilon}
            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>More Privacy</span>
            <span>More Accuracy</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Privacy Mechanism
          </label>
          <select
            value={mechanism}
            onChange={(e) => setMechanism(e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="laplace">Laplace Mechanism</option>
            <option value="randomized">Randomized Response</option>
            <option value="exponential">Exponential Mechanism</option>
          </select>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <FaInfoCircle className="mr-1" />
            {mechanism === 'laplace' && 'Adds controlled noise to numerical data'}
            {mechanism === 'randomized' && 'Randomly flips categorical responses'}
            {mechanism === 'exponential' && 'Selects output based on utility scores'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          } transition-colors duration-200`}
        >
          {isSubmitting ? 'Processing...' : 'Submit Data'}
        </button>
      </form>
    </div>
  );
}