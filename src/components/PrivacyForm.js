import React from 'react';
import { FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';
import Card from './Card';
import { usePrivacyForm } from '../hooks/usePrivacyForm';

const incomeLabels = [
  "Less than $20k",
  "$20k–$40k",
  "$40k–$60k",
  "$60k–$100k",
  "100k-200k",
  "200k-300k",
  "300k-400k",
  "400k-500k",
  ">500k"
];

export default function PrivacyForm({ onDataSubmit }) {
  const {
    formData,
    epsilon,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
    setEpsilon
  } = usePrivacyForm();

  const onSubmit = async (e) => {
    try {
      const noisyData = await handleSubmit(e);
      onDataSubmit(noisyData, epsilon);
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded mb-4 text-center font-semibold" aria-live="assertive">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Financial Inputs */}
        <Card title="Financial Information" icon={FaMoneyBillWave}>
          {['netWorth', 'rentOrMortgage', 'loanDebt', 'medicalExpenses'].map((key) => (
            <label key={key} className="block mt-4">
              <span className="block text-base font-semibold text-gray-700 mb-1">
                {key === 'netWorth'
                  ? 'Net Worth (USD)'
                  : key === 'rentOrMortgage'
                  ? 'Monthly Rent or Mortgage (USD)'
                  : key === 'loanDebt'
                  ? 'Outstanding Loan Debt (USD)'
                  : 'Annual Medical Expenses (USD)'}
              </span>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full p-3 mt-1 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-lg bg-blue-50 placeholder-gray-400"
                required
                min="0"
                placeholder="Enter amount"
              />
            </label>
          ))}
          <label className="block mt-6">
            <span className="block text-base font-semibold text-gray-700 mb-1">Income Range</span>
            <select
              name="incomeBin"
              value={formData.incomeBin}
              onChange={handleChange}
              className="w-full p-3 mt-1 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-lg bg-blue-50"
              required
            >
              <option value="">Select</option>
              {incomeLabels.map((label, index) => (
                <option key={index} value={index}>{label}</option>
              ))}
            </select>
          </label>
        </Card>

        {/* Privacy Settings */}
        <Card title="Privacy Settings" icon={FaShieldAlt}>
          <label className="block mt-4">
            <span className="block text-base font-semibold text-gray-700 mb-1">Privacy Level (ε)</span>
            <input
              type="range"
              min="0.1"
              max="100"
              step="0.1"
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full mt-1 accent-blue-600"
            />
            <span className="text-sm text-gray-600 font-mono">Epsilon: <span className="font-bold text-blue-700">{epsilon}</span></span>
          </label>
          <label className="block mt-6">
            <span className="block text-base font-semibold text-gray-700 mb-1">DP Mechanism</span>
            <select
              name="dp_mechanism"
              value={formData.dp_mechanism}
              onChange={handleChange}
              className="w-full p-3 mt-1 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-lg bg-blue-50"
              required
            >
              <option value="">Select</option>
              <option value="0">Randomized Response</option>
              <option value="1">Exponential</option>
            </select>
          </label>
        </Card>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 font-bold rounded-xl text-white text-lg shadow-lg transition bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Processing…' : 'Submit'}
        </button>
      </form>
    </div>
  );
} 