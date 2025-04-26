import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const numericFields = new Set(['netWorth', 'rentOrMortgage', 'loanDebt', 'medicalExpenses', 'incomeBin']);


function generateRandomUserID() {
  return uuidv4();
}


// export NODE_OPTIONS=--openssl-legacy-provider
// npm start
// Laplace mechanism helper
const addLaplaceNoise = (value, epsilon) => {
  const scale = 1 / epsilon;
  const u = Math.random() - 0.5;
  return value - scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
};

const randomizedResponseBinned = (trueBin, epsilon, numBins) => {
    // TODO: FIX THIS FXN
    const p = Math.exp(epsilon) / (Math.exp(epsilon) + numBins - 1);
    const random = Math.random();

    if (random < p) {
      return trueBin;
    } 
    const otherBins = [...Array(numBins).keys()].filter(b => b !== trueBin);
    return otherBins[Math.floor(Math.random() * otherBins.length)];
    
  };

const exponentialRandomNoise = (trueBin, epsilon, numBins) => {
  const centerBin = [10000, 30000, 50000, 80000, 150000, 250000, 350000, 450000, 750000];
  const actualValue = centerBin[trueBin];
  const utilityValue = (a,b) => -(Math.abs(a-b));
  //the formula for the score function in this case is exp(epsilon*utility/2*change in u) where the change in u is the sesntivity of utility function. 
  const scoreValue = centerBin.map(value => Math.exp((epsilon*utilityValue(actualValue, value))/740000));
  //from here, we need to find the probability of each bin
  let probTotal = 0;
  for (const score of scoreValue){
    probTotal += score;
  }
  const prob = scoreValue.map(scoreValue => scoreValue/probTotal)
 
  const random = Math.random();
  let val = 0
  console.log(prob, random)
  for (let i=0; i < prob.length; i++){
    val += prob[i]
    if (val >= random){
      return i
    }
  }
}


export default function PrivacyForm() {
  const [formData, setFormData] = useState({
    incomeBin: '',
    netWorth: '',
    rentOrMortgage: '',
    loanDebt: '',
    medicalExpenses: ''
  });

  const [epsilon, setEpsilon] = useState(1.0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = new Set(['netWorth', 'rentOrMortgage', 'loanDebt', 'medicalExpenses']);
    
    setFormData({
      ...formData,
      [name]: numericFields.has(name) ? (value === '' ? '' : parseFloat(value)) : value
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      formData.netWorth === '' ||
      isNaN(formData.netWorth) ||
      isNaN(epsilon) ||
      epsilon <= 0 ||
      formData.incomeBin === '' ||
      isNaN(parseFloat(formData.incomeBin))
    ) {
      alert('Please fill out all fields and ensure epsilon and net worth are valid numbers.');
      return;
    }
  
    const incomeBin = parseFloat(formData.incomeBin);
    const numBins = 5;
  
    let open_dp_data = null;
  
    // Only call /laplace if using RR or Exponential
    if (formData.dp_mechanism == 0 || formData.dp_mechanism == 1) {
      const testing_open_dp = {
        netWorth: parseFloat(formData.netWorth),
        epsilon: parseFloat(epsilon)
      };
  
      const flask_response = await fetch('http://127.0.0.1:5000/laplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testing_open_dp)
      });
  
      open_dp_data = await flask_response.json();
    }
  
    let noisy_income = null;
    let noisy_netWorth = null;
    let noisy_rent = null;
    let noisy_loanDebt = null;
    let noisy_medical = null;
  
    if (formData.dp_mechanism == 0) {
      noisy_income = randomizedResponseBinned(incomeBin, epsilon, numBins);
      noisy_netWorth = open_dp_data.netWorthDP;
    }
    else if (formData.dp_mechanism == 1) {
      noisy_income = exponentialRandomNoise(incomeBin, epsilon, numBins);
      noisy_netWorth = open_dp_data.netWorthDP;
    }
    else if (formData.dp_mechanism == 2 || formData.dp_mechanism == 3) {
      noisy_income = incomeBin;
      noisy_netWorth = formData.netWorth;
    }
  
    noisy_rent = formData.rentOrMortgage;
    noisy_loanDebt = formData.loanDebt;
    noisy_medical = formData.medicalExpenses;
  
    const payload = {
      user_id: generateRandomUserID(),
      is_personalized: formData.dp_mechanism == 3, // TRUE only for Shuffle-Private
      epsilon: epsilon,
      dp_mechanism: formData.dp_mechanism,
      income_bin_real: incomeBin,
      income_bin_noisy: noisy_income,
      net_worth_real: formData.netWorth,
      net_worth_noisy: noisy_netWorth,
      rent_or_mortgage_real: formData.rentOrMortgage,
      rent_or_mortgage_noisy: noisy_rent,
      loan_debt_real: formData.loanDebt,
      loan_debt_noisy: noisy_loanDebt,
      medical_expenses_real: formData.medicalExpenses,
      medical_expenses_noisy: noisy_medical
    };
  
    // Send to Flask server
    await fetch('http://127.0.0.1:5000/submit_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    console.log(noisy_income);
  
    const noisyData = {
      incomeBin: Math.floor(noisy_income),
      netWorth: noisy_netWorth,
      rentOrMortgage: noisy_rent,
      loanDebt: noisy_loanDebt,
      medicalExpenses: noisy_medical,
    };
    setPrivatizedData(noisyData);
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

        <label className="block">
          Privacy Level (ε)
          <input
            type="range"
            min="0.1"
            max="100"
            step="0.1"
            value={epsilon}
            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
            className="w-full mt-1"
          />
          <span className="text-sm text-gray-600">Epsilon: {epsilon}</span>
        </label>

        <label className="block">
          DP Mechanism
          <select
            name="dp_mechanism"
            value={formData.dp_mechanism}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
            required
          >
            <option value="">Select</option>
            <option value="0">Randomized Response</option>
            <option value="1">Exponential</option>
            <option value="2">Shuffle</option>           
            <option value="3">Shuffle-Private</option>    
          </select>
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
          <pre className="text-sm mb-2">
            {JSON.stringify(privatizedData, null, 2)}
            </pre>
            {typeof privatizedData.incomeBin === 'number' && (
            <p className="text-sm text-gray-700">
                Privatized Income Bin: {incomeLabels[privatizedData.incomeBin]}
            </p>
            )}
        </div>
      )}
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


