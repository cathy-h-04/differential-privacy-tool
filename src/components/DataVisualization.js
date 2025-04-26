import React from 'react';
import { FaChartBar, FaChartLine, FaChartPie } from 'react-icons/fa';
import Card from './Card';

export default function DataVisualization({ data, epsilon }) {
  if (!data) return null;

  const { incomeBin, netWorth, rentOrMortgage, loanDebt, medicalExpenses } = data;

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

  return (
    <div className="space-y-8">
      <Card title="Income Distribution" icon={FaChartPie}>
        <div className="p-4">
          <div className="text-2xl font-bold text-blue-700 mb-2">
            {incomeLabels[incomeBin]}
          </div>
          <div className="text-sm text-gray-600">
            Privacy Level (ε): {epsilon}
          </div>
        </div>
      </Card>

      <Card title="Financial Overview" icon={FaChartBar}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Net Worth</div>
            <div className="text-2xl font-bold text-blue-700">
              ${netWorth.toLocaleString()}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Monthly Housing</div>
            <div className="text-2xl font-bold text-blue-700">
              ${rentOrMortgage.toLocaleString()}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Loan Debt</div>
            <div className="text-2xl font-bold text-blue-700">
              ${loanDebt.toLocaleString()}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Medical Expenses</div>
            <div className="text-2xl font-bold text-blue-700">
              ${medicalExpenses.toLocaleString()}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Debt-to-Income Ratio" icon={FaChartLine}>
        <div className="p-4">
          <div className="text-2xl font-bold text-blue-700 mb-2">
            {((loanDebt / (rentOrMortgage * 12)) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            Based on annualized housing costs
          </div>
        </div>
      </Card>
    </div>
  );
} 