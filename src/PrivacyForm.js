import React, { useState } from 'react';

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
  const scoreValue = centerBin.map(value => Math.exp((epsilon*utilityValue(actualValue, value))/2.));
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
  const [formData, setFormData] = useState({incomeBin: '', netWorth: '', rentOrMortgage: '', loanDebt: '', medicalExpenses: ''});
  const [epsilon, setEpsilon] = useState(1.0);
  const [privatizedData, setPrivatizedData] = useState(null);

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
    setFormData({
      ...formData,
      [name]: name === 'income' ? value : parseFloat(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const incomeBin = parseFloat(formData.incomeBin);
    const numBins = 5;
    let noisy_income;
    console.log(formData.dp_mechanism)
    if (formData.dp_mechanism == 0){
      noisy_income = randomizedResponseBinned(incomeBin, epsilon, numBins);
    }
    else if (formData.dp_mechanism == 1){
     noisy_income = exponentialRandomNoise(incomeBin, epsilon, numBins);
    }
    console.log(noisy_income)
    const noisyData = {
      incomeBin: Math.floor(noisy_income),
      netWorth: addLaplaceNoise(formData.netWorth, epsilon),
      rentOrMortgage: addLaplaceNoise(formData.rentOrMortgage, epsilon),
      loanDebt: addLaplaceNoise(formData.loanDebt, epsilon),
      medicalExpenses: addLaplaceNoise(formData.medicalExpenses, epsilon),
    };
    setPrivatizedData(noisyData);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl space-y-6">
      <h1 className="text-2xl font-bold">Privacy-Preserving Data Collector</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
          Net Worth (USD)
          <input
            type="number"
            name="netWorth"
            value={formData.netWorth}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </label>

        <label className="block">
          Monthly Rent or Mortgage (USD)
          <input
            type="number"
            name="rentOrMortgage"
            value={formData.rentOrMortgage}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </label>

        <label className="block">
          Outstanding Loan Debt (USD)
          <input
            type="number"
            name="loanDebt"
            value={formData.loanDebt}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </label>

        <label className="block">
          Annual Medical Expenses (USD)
          <input
            type="number"
            name="medicalExpenses"
            value={formData.medicalExpenses}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </label>

        {/* <label className="block">
          Income
          <input
            type="number"
            name="loanDebt"
            value={formData.income}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </label> */}

        <label className="block">
            Income Range
            <select
                name="incomeBin"
                value={formData.incomeBin}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
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


