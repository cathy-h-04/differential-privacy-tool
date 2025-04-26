import React, { useState } from 'react';
import './App.css';

// THIS IS THE LATEST COMMIT

export default function PrivacyForm({ onDataSubmit }) {
  const [formData, setFormData] = useState({incomeBin: '', netWorth: '', rentOrMortgage: '', loanDebt: '', medicalExpenses: ''});
  const [epsilon, setEpsilon] = useState(1.0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'income' ? value : parseFloat(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const incomeBin = parseFloat(formData.incomeBin);
      const numBins = 5;

      const testing_open_dp = {
        netWorth: formData.netWorth,
        epsilon: epsilon
      }
      const flask_response = await fetch('http://127.0.0.1:5000/laplace',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testing_open_dp)
      });
      const open_dp_data = await flask_response.json();

      let noisy_income;
      if (formData.dp_mechanism == 0){
        noisy_income = randomizedResponseBinned(incomeBin, epsilon, numBins);
      }
      else if (formData.dp_mechanism == 1){
        noisy_income = exponentialRandomNoise(incomeBin, epsilon, numBins);
      }

      const noisyData = {
        incomeBin: Math.floor(noisy_income),
        netWorth: open_dp_data.netWorthDP,
        rentOrMortgage: addLaplaceNoise(formData.rentOrMortgage, epsilon),
        loanDebt: addLaplaceNoise(formData.loanDebt, epsilon),
        medicalExpenses: addLaplaceNoise(formData.medicalExpenses, epsilon),
      };

      onDataSubmit(noisyData, epsilon);
    } catch (err) {
      setError("An error occurred while processing your data. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <img src="https://img.icons8.com/fluency/96/privacy-policy.png" alt="Privacy Logo" className="mb-2" style={{width: 72, height: 72}} />
        <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight mb-1 drop-shadow">Differential Privacy Demo</h1>
        <p className="text-lg text-gray-600 font-medium">Protect your data. Learn how privacy works.</p>
      </div>
      <div className="w-full bg-white/90 shadow-2xl rounded-3xl p-8 border border-blue-100">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded mb-4 text-center font-semibold" aria-live="assertive">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Financial Inputs */}
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2">Financial Information</h2>
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
                <option value="0">Less than $20k</option>
                <option value="1">$20k–$40k</option>
                <option value="2">$40k–$60k</option>
                <option value="3">$60k–$100k</option>
                <option value="4">100k-200k</option>
                <option value="5">200k-300k</option>
                <option value="6">300k-400k</option>
                <option value="7">400k-500k</option>
                <option value="8">&gt; 500k</option>
              </select>
            </label>
          </div>
          {/* Privacy Settings */}
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2">Privacy Settings</h2>
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
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 font-bold rounded-xl text-white text-lg shadow-lg transition bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Processing…' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Differential Privacy helpers
function addLaplaceNoise(value, epsilon) {
  const scale = 1 / epsilon;
  const u = Math.random() - 0.5;
  return value - scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
}

function randomizedResponseBinned(trueBin, epsilon, numBins) {
  const p = Math.exp(epsilon) / (Math.exp(epsilon) + numBins - 1);
  if (Math.random() < p) return trueBin;
  const other = [...Array(numBins).keys()].filter((b) => b !== trueBin);
  return other[Math.floor(Math.random() * other.length)];
}

function exponentialRandomNoise(trueBin, epsilon, numBins) {
  const centerBins = [10000, 30000, 50000, 80000, 150000, 250000, 350000, 450000, 750000];
  const actual = centerBins[trueBin];
  const sensitivity = Math.max(...centerBins) - Math.min(...centerBins);
  const scores = centerBins.map((v) => Math.exp((-epsilon * Math.abs(v - actual)) / sensitivity));
  const total = scores.reduce((sum, s) => sum + s, 0);
  const probs = scores.map((s) => s / total);
  let r = Math.random();
  for (let i = 0; i < probs.length; i++) {
    r -= probs[i];
    if (r <= 0) return i;
  }
  return probs.length - 1;
}


