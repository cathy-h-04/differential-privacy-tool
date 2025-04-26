import { useState } from 'react';
import { addLaplaceNoise, randomizedResponseBinned, exponentialRandomNoise } from '../utils/privacy';

export function usePrivacyForm() {
  const [formData, setFormData] = useState({
    incomeBin: '',
    netWorth: '',
    rentOrMortgage: '',
    loanDebt: '',
    medicalExpenses: '',
    dp_mechanism: ''
  });
  const [epsilon, setEpsilon] = useState(1.0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'incomeBin' ? value : parseFloat(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const incomeBin = parseFloat(formData.incomeBin);
      const numBins = 5;

      const testing_open_dp = {
        netWorth: formData.netWorth,
        epsilon: epsilon
      };

      const flask_response = await fetch('http://127.0.0.1:5000/laplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testing_open_dp)
      });
      const open_dp_data = await flask_response.json();

      let noisy_income;
      if (formData.dp_mechanism == 0) {
        noisy_income = randomizedResponseBinned(incomeBin, epsilon, numBins);
      } else if (formData.dp_mechanism == 1) {
        noisy_income = exponentialRandomNoise(incomeBin, epsilon, numBins);
      }

      const noisyData = {
        incomeBin: Math.floor(noisy_income),
        netWorth: open_dp_data.netWorthDP,
        rentOrMortgage: addLaplaceNoise(formData.rentOrMortgage, epsilon),
        loanDebt: addLaplaceNoise(formData.loanDebt, epsilon),
        medicalExpenses: addLaplaceNoise(formData.medicalExpenses, epsilon),
      };

      return noisyData;
    } catch (err) {
      setError("An error occurred while processing your data. Please try again.");
      console.error(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    epsilon,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
    setEpsilon
  };
} 