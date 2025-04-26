import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaChartBar, FaShieldAlt, FaMoneyBillWave, FaChartPie } from 'react-icons/fa';
import './App.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DataVisualization({ privatizedData, epsilon }) {
  if (!privatizedData) return null;

  // Prepare data for charts
  const incomeData = [
    { name: 'Income', value: privatizedData.incomeBin },
    { name: 'Net Worth', value: privatizedData.netWorth },
  ];

  const expensesData = [
    { name: 'Rent/Mortgage', value: privatizedData.rentOrMortgage },
    { name: 'Loan Debt', value: privatizedData.loanDebt },
    { name: 'Medical', value: privatizedData.medicalExpenses },
  ];

  // Calculate privacy level based on epsilon
  const privacyLevel = Math.min(100, Math.max(0, (1 / epsilon) * 100));

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center mb-4">
            <FaMoneyBillWave className="text-blue-500 text-2xl mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Financial Overview</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Income Range: ${privatizedData.incomeBin * 20000} - ${(privatizedData.incomeBin + 1) * 20000}</p>
            <p className="text-gray-600">Net Worth: ${privatizedData.netWorth.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center mb-4">
            <FaChartPie className="text-green-500 text-2xl mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Monthly Expenses</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Rent/Mortgage: ${privatizedData.rentOrMortgage.toLocaleString()}</p>
            <p className="text-gray-600">Loan Debt: ${privatizedData.loanDebt.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center mb-4">
            <FaShieldAlt className="text-purple-500 text-2xl mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Privacy Level</h3>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${privacyLevel}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Epsilon: {epsilon}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Distribution Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <FaChartBar className="text-blue-500 text-2xl mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Income Distribution</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <FaChartPie className="text-green-500 text-2xl mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Expenses Breakdown</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 