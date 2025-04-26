import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DataVisualizations = ({ privatizedData, originalData }) => {
  if (!privatizedData || !originalData) return null;

  const metrics = Object.keys(originalData).filter(k => k !== 'incomeBin');
  const data = metrics.map(key => ({
    name: key,
    original: originalData[key],
    privatized: privatizedData[key]
  }));

  return (
    <div id="visualizations" className="data-visualizations w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Visualizations</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="original" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="privatized" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataVisualizations;
