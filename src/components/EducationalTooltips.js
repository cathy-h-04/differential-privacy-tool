import React from 'react';

const EducationalTooltips = () => (
  <div id="education" className="education-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-2">What is Differential Privacy?</h3>
      <p className="text-gray-600">A mathematical framework for quantifying privacy guarantees when releasing data.</p>
    </div>
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-2">Laplace Mechanism</h3>
      <p className="text-gray-600">Adds Laplace-distributed noise to numeric values to preserve privacy.</p>
    </div>
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-2">Randomized Response</h3>
      <p className="text-gray-600">A technique for collecting truthful data with privacy guarantees.</p>
    </div>
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-2">Privacy-Utility Tradeoff</h3>
      <p className="text-gray-600">Balancing data accuracy with privacy protection.</p>
    </div>
  </div>
);

export default EducationalTooltips;
