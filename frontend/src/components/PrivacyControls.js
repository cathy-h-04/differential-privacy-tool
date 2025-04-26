import React from 'react';

const PrivacyControls = ({ epsilon, setEpsilon }) => {
  const level = epsilon <= 1 ? 'High' : epsilon <= 5 ? 'Medium' : 'Low';

  return (
    <div className="privacy-controls bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Privacy Controls</h2>
      <div className="mb-4">
        <label htmlFor="epsilon" className="block text-sm font-medium text-gray-700">
          Epsilon: {epsilon}
          <span title="Higher epsilon means less privacy" className="ml-2 cursor-help text-gray-400">?</span>
        </label>
        <input
          id="epsilon"
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={epsilon}
          onChange={e => setEpsilon(parseFloat(e.target.value))}
          className="w-full mt-2"
        />
      </div>
      <p className="text-sm text-gray-600">
        Privacy Level: <span className="font-medium text-gray-800">{level}</span>
      </p>
    </div>
  );
};

export default PrivacyControls;
