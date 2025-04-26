import React, { useState } from 'react';
import PrivacyControls from './PrivacyControls';
import EducationalTooltips from './EducationalTooltips';

const FinancialForm = ({ onDataSubmit }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    netWorth: '',
    rentOrMortgage: '',
    loanDebt: '',
    medicalExpenses: '',
    incomeBin: '',
  });
  const [epsilon, setEpsilon] = useState(1.0);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    onDataSubmit(formData, epsilon);
  };

  return (
    <div className="financial-form">
      {step === 0 && (
        <div className="form-step">
          <h2>Financial Information</h2>
          <label>
            Net Worth
            <input
              type="number"
              name="netWorth"
              value={formData.netWorth}
              onChange={handleChange}
            />
          </label>
          <label>
            Rent or Mortgage
            <input
              type="number"
              name="rentOrMortgage"
              value={formData.rentOrMortgage}
              onChange={handleChange}
            />
          </label>
          <label>
            Loan Debt
            <input
              type="number"
              name="loanDebt"
              value={formData.loanDebt}
              onChange={handleChange}
            />
          </label>
          <label>
            Medical Expenses
            <input
              type="number"
              name="medicalExpenses"
              value={formData.medicalExpenses}
              onChange={handleChange}
            />
          </label>
          <label>
            Income Bin
            <select
              name="incomeBin"
              value={formData.incomeBin}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="0-50k">$0-50k</option>
              <option value="50-100k">$50-100k</option>
              <option value="100-200k">$100-200k</option>
              <option value="200k+">$200k+</option>
            </select>
          </label>
          <div className="form-nav">
            <button onClick={next}>Next</button>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="form-step">
          <PrivacyControls epsilon={epsilon} setEpsilon={setEpsilon} />
          <div className="form-nav">
            <button onClick={prev}>Back</button>
            <button onClick={next}>Next</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="form-step">
          <h2>Review & Submit</h2>
          <pre>{JSON.stringify({ ...formData, epsilon }, null, 2)}</pre>
          <div className="form-nav">
            <button onClick={prev}>Back</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
      <EducationalTooltips />
    </div>
  );
};

export default FinancialForm;
