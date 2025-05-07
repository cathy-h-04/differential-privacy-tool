import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const getPrivacyLevel = (eps) => eps <= 1 ? 'High' : eps <= 5 ? 'Medium' : 'Low';

function generateRandomUserID() {
  return uuidv4();
}

function binData(val) {
  const bins = [20000, 40000, 60000, 100000, 200000, 300000, 400000, 500000, Infinity];
  for (let i = 0; i < bins.length; i++) {
    if (val <= bins[i]) {
      return i;
    }
  }
}


const addLaplaceNoise = (value, epsilon) => {
  const scale = 1 / epsilon;
  const u = Math.random() - 0.5;
  return value - scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
};



const randomizedResponseBinned = (trueBin, epsilon, numBins) => {
  const p = Math.exp(epsilon) / (Math.exp(epsilon) + numBins - 1);
  const random = Math.random();

  if (random < p) {
    return trueBin;
  }
  const otherBins = [...Array(numBins).keys()].filter(b => b !== trueBin);
  return otherBins[Math.floor(Math.random() * otherBins.length)];
};

const exponentialRandomNoise = (trueBin, epsilon, returnIndex = false) => {
  const centerBin = [10000, 30000, 50000, 80000, 150000, 250000, 350000, 450000, 750000];
  const actualValue = centerBin[trueBin];
  const utilityValue = (a, b) => -Math.abs(a - b);
  const scoreValue = centerBin.map(value => Math.exp((epsilon * utilityValue(actualValue, value)) / (2*740000)));
  
  const probTotal = scoreValue.reduce((a, b) => a + b, 0);
  const prob = scoreValue.map(score => score / probTotal);

  const random = Math.random();
  let acc = 0;
  for (let i = 0; i < prob.length; i++) {
    acc += prob[i];
    if (acc >= random) {
      return returnIndex ? i : centerBin[i];
    }
  }
};


export default function PrivacyForm() {
  const [formData, setFormData] = useState({
    incomeBin: '', // Default set to "select a range"
    epsilon: 1.0,
    netWorth: '',
    rentOrMortgage: '',
    loanDebt: '',
    medicalExpenses: ''
  });

  const [epsilonGlobal, setEpsilonGlobal] = useState(2.0);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = new Set(['epsilon','netWorth', 'rentOrMortgage', 'loanDebt', 'medicalExpenses']);

    setFormData({
      ...formData,
      [name]: numericFields.has(name) ? (value === '' ? '' : parseFloat(value)) : value
    });
  };

  const privatizeData = async () => {
    const errs = [];
    const { netWorth, incomeBin } = formData;
    if (!netWorth || isNaN(netWorth)) errs.push('Net Worth must be valid.');
    if (!incomeBin) errs.push('Income must be selected.');
    if (errs.length) return setErrors(errs);

    setErrors([]);
    const income = parseFloat(incomeBin);
    const numBins = 5;

    setFormData({
      ...formData,
      epsilon: formData.epsilon,
      incomeBin: exponentialRandomNoise(income, epsilonGlobal, true),
      netWorth: exponentialRandomNoise(binData(netWorth), epsilonGlobal, false),
      rentOrMortgage: exponentialRandomNoise(binData(formData.rentOrMortgage), epsilonGlobal, false),
      loanDebt: exponentialRandomNoise(binData(formData.loanDebt),epsilonGlobal, false),
      medicalExpenses: exponentialRandomNoise(binData(formData.medicalExpenses),epsilonGlobal, false), 
    });

    setShowModal(true); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("EPSILON IN SUBMISSION", formData.epsilon);
    const payload = {
      user_id: generateRandomUserID(),
      epsilon: parseFloat(formData.epsilon),
      income_bin: parseInt(formData.incomeBin),
      net_worth: parseFloat(formData.netWorth),
      rent_or_mortgage: parseFloat(formData.rentOrMortgage),
      loan_debt: parseFloat(formData.loanDebt),
      medical_expenses: parseFloat(formData.medicalExpenses),
    };

    try {
      console.log("Submitting data...");
      await fetch('http://127.0.0.1:5000/submit_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const audio = new Audio('/kungfu_trimmed.mov');
      audio.play().catch(err => console.error("Audio play error:", err));
  
      setTimeout(() => {
        window.location.href = '/privatized';
      }, 10000); 
  
    } catch (err) {
      console.error("Submission failed", err);
    }


    setIsSubmitting(false);
    setShowModal(false);
  }

  return (
    
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-300 p-4 rounded">
          <ul className="list-disc list-inside text-red-700">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}
      <h1 className="text-2xl font-bold">Privacy-Preserving Data Collector</h1>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Net Worth (USD)</span></label>
          <input type="number" name="netWorth" value={formData.netWorth} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Monthly Rent or Mortgage (USD)</span></label>
          <input type="number" name="rentOrMortgage" value={formData.rentOrMortgage} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Outstanding Loan Debt (USD)</span></label>
          <input type="number" name="loanDebt" value={formData.loanDebt} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Annual Medical Expenses (USD)</span></label>
          <input type="number" name="medicalExpenses" value={formData.medicalExpenses} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Income Range</span></label>
          <select
            name="incomeBin"
            value={formData.incomeBin}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select a range</option>
            {incomeLabels.map((label, idx) => (
              <option key={idx} value={idx}>{label}</option>
            ))}
          </select>
        </div>
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Privacy Level (ε)</span></label>
          <input
            type="range"
            min="0.1"
            max="100"
            step="0.1"
            value={formData.epsilon}
            onChange={(e) => setFormData(prev => ({ ...prev, epsilon: parseFloat(e.target.value) }))}
            className="range range-primary w-full"
          />
          <span className="text-sm text-gray-600"> ε: {formData.epsilon} ({getPrivacyLevel(formData.epsilon)} privacy)</span>
        </div>
        <button
          type="button" onClick={privatizeData}
          className="btn btn-primary"
        >
          Privatize My Data
        </button>
        {/* <button
          type="submit"
          className="btn btn-primary"
        >
          Submit
        </button> */}
      </form>
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
      <h2 className="text-xl font-semibold mb-4">Ready to submit privatized data?</h2>
      <p className="mb-6 text-sm text-gray-600">
        Your form has been privatized. Click "Submit" to send, or "Cancel" to go back.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
        >
          Submit
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
