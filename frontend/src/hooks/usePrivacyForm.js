import { useState } from 'react';

export function usePrivacyForm() {
  const [formData, setFormData] = useState({
    netWorth: '',
    rentOrMortgage: '',
    loanDebt: '',
    medicalExpenses: '',
    incomeBin: 0
  });

  const [epsilon, setEpsilon] = useState(1.0);
  const [mechanism, setMechanism] = useState('laplace');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const getPrivacyLevel = (eps) => {
    if (eps <= 0.5) return 'High';
    if (eps <= 1.5) return 'Medium';
    return 'Low';
  };

  const privacyLevel = getPrivacyLevel(epsilon);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Here you would normally make an API call to your Flask backend
      const response = await fetch('/api/privatize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          epsilon,
          mechanism
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process data');
      }

      const result = await response.json();
      // Handle the result as needed
      console.log('Privatized data:', result);
    } catch (err) {
      setError('An error occurred while processing your data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    error,
    isSubmitting,
    privacyLevel,
    epsilon,
    setEpsilon,
    mechanism,
    setMechanism
  };
} 