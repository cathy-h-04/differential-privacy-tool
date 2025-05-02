import React, { useState } from 'react';

const allFields = [
  '*',
  'income_bin',
  'net_worth',
  'rent_or_mortgage',
  'loan_debt',
  'medical_expenses'
];

const queryableColumns = [
  'income_bin',
  'net_worth',
  'rent_or_mortgage',
  'loan_debt',
  'medical_expenses'
];

const operators = ['=', '!=', '<', '<=', '>', '>='];

export default function Query() {
  const [selectedFields, setSelectedFields] = useState(['*']);
  const [conditions, setConditions] = useState([{ column: '', operator: '=', value: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConditionChange = (index, field, value) => {
    const updated = [...conditions];
    updated[index][field] = value;
    setConditions(updated);
  };

  const handleAddCondition = () => {
    setConditions([...conditions, { column: '', operator: '=', value: '' }]);
  };

  const handleRemoveCondition = (index) => {
    const updated = [...conditions];
    updated.splice(index, 1);
    setConditions(updated);
  };

  const buildWhereClause = () => {
    return conditions
      .filter(c => c.column && c.operator && c.value !== '')
      .map(c => `${c.column} ${c.operator} ${c.value}`)
      .join(' AND ');
  };

  const buildFullQuery = () => {
    const selectClause = selectedFields.length === 0
      ? '*'
      : selectedFields.includes('*')
        ? '*'
        : selectedFields.join(', ');
    const where = buildWhereClause();
    return `SELECT ${selectClause} FROM user_reports${where ? ' WHERE ' + where : ''}`;
  };

  const handleQuery = async () => {
    setIsLoading(true);
    setError('');
    try {
      const whereClause = buildWhereClause();
      const response = await fetch('http://127.0.0.1:5000/personalized_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          where: whereClause,
          select: selectedFields.includes('*') ? '*' : selectedFields
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setResults(data.results);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error or server not responding.');
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Query Personalized DP Dataset</h1>

      <div className="space-y-6 mb-6">

        {/* SELECT field(s) */}
        <div>
          <label className="block font-medium text-sm mb-2">SELECT Fields</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allFields.map((field) => (
              <label key={field} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field)}
                  onChange={(e) => {
                    if (field === '*') {
                      setSelectedFields(e.target.checked ? ['*'] : []);
                    } else {
                      const updated = selectedFields.includes(field)
                        ? selectedFields.filter(f => f !== field)
                        : [...selectedFields.filter(f => f !== '*'), field];
                      setSelectedFields(updated);
                    }
                  }}
                />
                <span>{field}</span>
              </label>
            ))}
          </div>
        </div>

        {/* WHERE conditions */}
        <div>
          <label className="block font-medium text-sm mb-2">WHERE Conditions</label>
          {conditions.map((c, idx) => (
            <div key={idx} className="flex items-center gap-3 mb-2">
              <select
                value={c.column}
                onChange={(e) => handleConditionChange(idx, 'column', e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">Column</option>
                {queryableColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
              <select
                value={c.operator}
                onChange={(e) => handleConditionChange(idx, 'operator', e.target.value)}
                className="border rounded px-2 py-1"
              >
                {operators.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
              <input
                type="text"
                value={c.value}
                onChange={(e) => handleConditionChange(idx, 'value', e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Value"
              />
              {conditions.length > 1 && (
                <button
                  onClick={() => handleRemoveCondition(idx)}
                  className="text-red-600 text-lg font-bold"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddCondition}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            + Add Condition
          </button>
        </div>

        {/* Preview */}
        <div className="bg-gray-100 border border-gray-300 rounded px-4 py-3 text-sm text-gray-700 font-mono">
          <strong>Generated Query:</strong><br />
          <code>{buildFullQuery()}</code>
        </div>

        <button
          onClick={handleQuery}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium mt-4"
          disabled={isLoading}
        >
          {isLoading ? 'Running...' : 'Run Query'}
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {results.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Returned {results.length} Records</h2>
          <div className="overflow-x-auto rounded border border-gray-300">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {(selectedFields.includes('*') && results.length > 0
                    ? Object.keys(results[0])
                    : selectedFields
                  ).filter(key => key !== 'user_id').map((key) => (
                    <th key={key} className="px-4 py-2 font-medium text-gray-700 border-r">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    {(selectedFields.includes('*') && results.length > 0
                      ? Object.keys(results[0])
                      : selectedFields
                    ).filter(key => key !== 'user_id').map((key) => (
                      <td key={key} className="px-4 py-2 text-gray-800 border-r">
                        {typeof row[key] === 'number'
                          ? row[key].toFixed(2)
                          : row[key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
