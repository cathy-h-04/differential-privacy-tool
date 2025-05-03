import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const numericFields = new Set(['netWorth', 'rentOrMortgage', 'loanDebt', 'medicalExpenses', 'incomeBin']);

const mechanismDescriptions = {
  '0': 'Randomized Response: adds privacy by randomizing responses.',
  '1': 'Exponential Mechanism: selects outputs with probability based on utility.',
  '2': 'Shuffle: shuffles data for privacy.',
  '3': 'Shuffle-Private: shuffle with personalized privacy guarantees.',
  '4': 'Laplace: adds noise drawn from a Laplace distribution; categorical data will be obfuscated using Randomized Response'
};

const getPrivacyLevel = (eps) => eps <= 1 ? 'High' : eps <= 5 ? 'Medium' : 'Low';

function generateRandomUserID() {
  return uuidv4();
}


const randomizedResponseBinned = (trueBin, epsilon, numBins) => {
  const p = Math.exp(epsilon) / (Math.exp(epsilon) + numBins - 1);
  const random = Math.random();

  if (random < p) {
    return trueBin;
  }
  const otherBins = [...Array(numBins).keys()].filter(b => b !== trueBin);
  return otherBins[Math.floor(Math.random() * otherBins.length)];
};

const exponentialRandomNoise = (trueBin, epsilon) => {
  const centerBin = [10000, 30000, 50000, 80000, 150000, 250000, 350000, 450000, 750000];
  const actualValue = centerBin[trueBin];
  const utilityValue = (a, b) => -(Math.abs(a - b));
  const scoreValue = centerBin.map(value => Math.exp((epsilon * utilityValue(actualValue, value)) / 740000));
  let probTotal = 0;
  for (const score of scoreValue) {
    probTotal += score;
  }
  const prob = scoreValue.map(scoreValue => scoreValue / probTotal);

  const random = Math.random();
  let val = 0;
  for (let i = 0; i < prob.length; i++) {
    val += prob[i];
    if (val >= random) {
      return i;
    }
  }
};

function binData(val) {
  const bins = [20000, 40000, 60000, 100000, 200000, 300000, 400000, 500000, Infinity];
  for (let i = 0; i < bins.length; i++) {
    if (val <= bins[i]) {
      return i;
    }
  }
}

export default function PrivacyPlaygroundForm() {
  const [formData, setFormData] = useState({
    incomeBin: '',
    netWorth: '',
    rentOrMortgage: '',
    loanDebt: '',
    medicalExpenses: '',
    dp_mechanism: ''
  });

  const [epsilon, setEpsilon] = useState(2.0);
  const [privatizedData, setPrivatizedData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [globalEpsilon] = useState(1.0); // used for local DP only


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
    const numericFields = new Set(['netWorth', 'rentOrMortgage', 'loanDebt', 'medicalExpenses']);

    setFormData({
      ...formData,
      [name]: numericFields.has(name) ? (value === '' ? '' : parseFloat(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = [];
    if (!formData.netWorth || isNaN(formData.netWorth)) errs.push('Net Worth is required and must be a number.');
    if (!formData.incomeBin) errs.push('Income range is required.');
    if (!formData.dp_mechanism) errs.push('Please select a DP mechanism.');
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);

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

    // const testing_open_dp = {
    //   netWorth: formData.netWorth,
    //   epsilon: epsilon
    // }
    // const flask_response = await fetch('http://127.0.0.1:5000/laplace', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(testing_open_dp)
    // });

    // const open_dp_data = await flask_response.json();

    // console.log("OPEN DP DATA: ", open_dp_data);
    let noisy_income = null;
    let noisy_netWorth = null;
    let noisy_rent = null;
    let noisy_loanDebt = null;
    let noisy_medical = null;
    console.log("DP MECHANISM: ", formData.dp_mechanism);
    if (formData.dp_mechanism == 0) {
      noisy_income = randomizedResponseBinned(incomeBin, globalEpsilon, numBins);
      noisy_netWorth = randomizedResponseBinned(binData(formData.netWorth), globalEpsilon, numBins);
      noisy_rent = randomizedResponseBinned(binData(formData.rentOrMortgage), globalEpsilon, numBins);
      noisy_loanDebt = randomizedResponseBinned(binData(formData.loanDebt), globalEpsilon, numBins);
      noisy_medical = randomizedResponseBinned(binData(formData.medicalExpenses), globalEpsilon, numBins);
      //noisy_netWorth = open_dp_data.netWorthDP;
      // console.log("GLOBAL EPSILON: ", globalEpsilon)
    }
    else if (formData.dp_mechanism == 1) {
      noisy_income = exponentialRandomNoise(incomeBin, globalEpsilon);
      noisy_netWorth = exponentialRandomNoise(binData(formData.netWorth), globalEpsilon);
      noisy_rent = exponentialRandomNoise(binData(formData.rentOrMortgage), globalEpsilon);
      noisy_loanDebt = exponentialRandomNoise(binData(formData.loanDebt), globalEpsilon);
      noisy_medical = exponentialRandomNoise(binData(formData.medicalExpenses), globalEpsilon);
      //noisy_netWorth = open_dp_data.netWorthDP;
      //console.log(globalEpsilon)
    }
    else if (formData.dp_mechanism == 2) {
      setPrivatizedData(null); 
      alert("Shuffle DP injects local noise and then anonymizes when k responses are received on the server side.");
      return; 
    }
    else if (formData.dp_mechanism == 3) {
      setPrivatizedData(null); 
      alert("Personalized DP allows users to have fine-grained access over their own privacy parameters. See our DP Query Portal for more information.");
      return; 
    }
    else if (formData.dp_mechanism == 4){
      const send_to_open_dp = {
        rent: formData.rentOrMortgage,
        netWorth: formData.netWorth,
        loanDebt: formData.loanDebt,
        medical: formData.medicalExpenses,
        epsilon: epsilon
      }
      console.log(send_to_open_dp)
      const flask_response = await fetch('http://127.0.0.1:5000/laplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(send_to_open_dp)
      });
      const open_dp_data = await flask_response.json();
      noisy_netWorth = open_dp_data.netWorthDP
      noisy_rent = open_dp_data.rentDP 
      noisy_loanDebt = open_dp_data.loanDP
      noisy_medical = open_dp_data.medicalDP
      noisy_income = randomizedResponseBinned(incomeBin, globalEpsilon, numBins)
    }

    // noisy_rent = formData.rentOrMortgage;
    // noisy_loanDebt = formData.loanDebt;
    // noisy_medical = formData.medicalExpenses;
    console.log("NOISY NET WORTH: ", noisy_netWorth);
    const payload = {
      user_id: generateRandomUserID(),
      is_personalized: formData.dp_mechanism == 3, // TRUE only for Personalized DP
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

    // Only send to server for Shuffle and Personalized DP
    // if (formData.dp_mechanism == 2 || formData.dp_mechanism == 3) {
    //   console.log("Submitting data...");
    //   await fetch('http://127.0.0.1:5000/submit_data', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(payload),
    //   });
    // }
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
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-300 p-4 rounded">
          <ul className="list-disc list-inside text-red-700">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}
      <h1 className="text-2xl font-bold">Privacy-Preserving Data Collector</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            value={epsilon}
            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
            className="range range-primary w-full"
          />
          <span className="text-sm text-gray-600">ε: {epsilon} ({getPrivacyLevel(epsilon)} privacy)</span>
        </div>
        <div className="form-control w-full">
          <label className="label"><span className="label-text">DP Mechanism</span></label>
          <select
            name="dp_mechanism"
            value={formData.dp_mechanism}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            <option value="0">Randomized Response</option>
            <option value="1">Exponential</option>
            <option value="2">Shuffle</option>
            <option value="3">Personalized DP</option>
            <option value="4">Laplace</option>
          </select>
        </div>
        {formData.dp_mechanism && (
          <p className="text-sm text-gray-600 italic">{mechanismDescriptions[formData.dp_mechanism]}</p>
        )}
        <button
          type="submit"
          className="btn btn-primary"
        >
          See DP Results
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
