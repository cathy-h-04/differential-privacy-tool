import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivacyPlaygroundForm from './PrivacyPlaygroundForm';
import DataVisualization from './DataVisualization';
import DashboardLayout from './layouts/DashboardLayout';
import InfoCard from './components/InfoCard';
import PrivacyForm from './PrivacyForm';
import PersonalizedQueryPage from './Query';  
import PrivatizedPage from './PrivatizedPage';

import './App.css';

function App() {
  const [privatizedData, setPrivatizedData] = useState(null);
  const [epsilon, setEpsilon] = useState(1.0);

  const handleDataSubmit = (data, eps) => {
    setPrivatizedData(data);
    setEpsilon(eps);
  };

  const privacyInfo = [
    {
      title: 'What is Differential Privacy?',
      description: 'Differential privacy is a system for publicly sharing information about a dataset by describing the patterns of groups within the dataset while withholding information about individuals in the dataset.'
    },
    {
      title: 'Understanding Epsilon (ε)',
      description: 'Epsilon (ε) is the privacy budget. Lower values provide more privacy but less accuracy. Higher values provide more accuracy but less privacy.'
    },
    {
      title: 'Privacy Mechanisms',
      description: 'We use multiple privacy mechanisms including Laplace noise, randomized response, and exponential mechanisms to protect your data.'
    }
  ];

  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/playground" element={
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <PrivacyPlaygroundForm onDataSubmit={handleDataSubmit} />
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <DataVisualization privatizedData={privatizedData} epsilon={epsilon} />
                </div>
              </div>
            </div>
          } />
          <Route path="/" element={
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">This is the Home Page</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {privacyInfo.map((info, index) => (
                  <InfoCard
                    key={index}
                    title={info.title}
                    description={info.description}
                  />
                ))}
              </div>
              <div className="mt-6">
                <PrivacyForm />
              </div>
            </div>
          } />
          <Route path="/query" element={<PersonalizedQueryPage />} />
          <Route path="/about" element={
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
              <p className="text-gray-600">
                This project demonstrates the application of differential privacy in financial data visualization.
                It allows users to input their financial information while maintaining privacy through various
                differential privacy mechanisms.
              </p>
            </div>
          } />
          <Route path="/privatized" element={<PrivatizedPage />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
