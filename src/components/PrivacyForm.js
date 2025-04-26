import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Slider, 
  Tooltip, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import '../../App.css';

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

export default function PrivacyForm() {
  const [formData, setFormData] = useState({
    incomeBin: '',
    netWorth: '',
    rentOrMortgage: '',
    loanDebt: '',
    medicalExpenses: ''
  });
  const [epsilon, setEpsilon] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
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
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simulate an API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: 'success' });
        }, 1000);
      });

      if (response.data === 'success') {
        // Here you would normally handle the response data
        setPrivatizedData(formData);
        setFormData({
          incomeBin: '',
          netWorth: '',
          rentOrMortgage: '',
          loanDebt: '',
          medicalExpenses: ''
        });
      }
    } catch (err) {
      setError('An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPrivacyLevelColor = (epsilon) => {
    if (epsilon < 0.5) return 'success.main';
    if (epsilon < 1.5) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
        padding: 3
      }}
    >
      <Card sx={{ maxWidth: 800, width: '100%', mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
            Differential Privacy Demo
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Financial Information Section */}
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom color="primary">
                  Financial Information
                </Typography>
              </Grid>
              
              {['netWorth', 'rentOrMortgage', 'loanDebt', 'medicalExpenses'].map((key) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    label={key === 'netWorth'
                      ? 'Net Worth (USD)'
                      : key === 'rentOrMortgage'
                      ? 'Monthly Rent or Mortgage (USD)'
                      : key === 'loanDebt'
                      ? 'Outstanding Loan Debt (USD)'
                      : 'Annual Medical Expenses (USD)'}
                    type="number"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Income Range</InputLabel>
                  <Select
                    name="incomeBin"
                    value={formData.incomeBin}
                    onChange={handleChange}
                    required
                  >
                    {incomeLabels.map((label, index) => (
                      <MenuItem key={index} value={index}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Privacy Settings Section */}
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Privacy Settings
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography>Privacy Level (ε)</Typography>
                  <Tooltip title="Lower ε means more privacy but less accuracy. Higher ε means more accuracy but less privacy.">
                    <InfoOutlined sx={{ ml: 1, fontSize: '1rem', color: 'text.secondary' }} />
                  </Tooltip>
                </Box>
                <Tooltip 
                  title={`Current privacy protection: ${epsilon < 0.5 ? 'Maximum' : epsilon < 1.5 ? 'High' : 'Medium'}`}
                  arrow
                  placement="top"
                >
                  <Slider
                    value={epsilon}
                    min={0.1}
                    max={5}
                    step={0.1}
                    onChange={(_, value) => setEpsilon(value)}
                    sx={{
                      color: getPrivacyLevelColor(epsilon),
                      '& .MuiSlider-thumb': {
                        transition: 'all 0.2s'
                      }
                    }}
                  />
                </Tooltip>
                <Typography variant="body2" color="text.secondary">
                  Epsilon value: {epsilon}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>DP Mechanism</InputLabel>
                  <Select
                    name="dp_mechanism"
                    value={formData.dp_mechanism || ''}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="0">Randomized Response</MenuItem>
                    <MenuItem value="1">Exponential</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                    }
                  }}
                >
                  {isSubmitting ? 'Processing…' : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Results Card */}
      {privatizedData && (
        <Card sx={{ maxWidth: 800, width: '100%', mt: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              Privatized Output
            </Typography>
            <Box sx={{ 
              bgcolor: 'grey.50', 
              p: 2, 
              borderRadius: 1,
              fontFamily: 'monospace'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(privatizedData, null, 2)}
              </pre>
            </Box>
            {typeof privatizedData.incomeBin === 'number' && (
              <Typography sx={{ mt: 2 }}>
                <strong>Income:</strong> {incomeLabels[privatizedData.incomeBin]}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}