import React, { useState } from 'react';

// Laplace mechanism helper
const addLaplaceNoise = (value, epsilon) => {
  const scale = 1 / epsilon;
  const u = Math.random() - 0.5;
  return value - scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
};

export default function PrivacyForm() {
  const [formData, setFormData] = useState({ timeOnPage: '', clicks: '', scrollDepth: '' });
  const [epsilon, setEpsilon] = useState(1.0);
  const [privatizedData, setPrivatizedData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const noisyData = {
      timeOnPage: addLaplaceNoise(formData.timeOnPage, epsilon),
      clicks: addLaplaceNoise(formData.clicks, epsilon),
      scrollDepth: addLaplaceNoise(formData.scrollDepth, epsilon),
    };
    setPrivatizedData(noisyData);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl space-y-6">
      <h1 className="text-2xl font-bold">Privacy-Preserving Data Collector</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Time on Page (seconds)
          <input
            type="number"
            name="timeOnPage"
            value={formData.timeOnPage}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </label>

        <label className="block">
          Clicks
          <input
            type="number"
            name="clicks"
            value={formData.clicks}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </label>

        <label className="block">
          Scroll Depth (%)
          <input
            type="number"
            name="scrollDepth"
            value={formData.scrollDepth}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </label>

        <label className="block">
          Privacy Level (ε)
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={epsilon}
            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
            className="w-full mt-1"
          />
          <span className="text-sm text-gray-600">Epsilon: {epsilon}</span>
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {privatizedData && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Privatized Output</h2>
          <pre className="text-sm">
            {JSON.stringify(privatizedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
