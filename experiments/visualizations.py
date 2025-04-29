import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_squared_error

true_df = pd.read_csv('true.csv')
laplace_df = pd.read_csv('laplace.csv')

# only look at the continuous columns, skipping 'Income Bin'
columns = ['Net Worth', 'Rent or Mortgage', 'Loan Debt', 'Medical Expenses']

# will be used to store results from each column
mse_results = {}
bias_results = {}

for col in columns:
    true_vals = true_df[col]
    laplace_vals = laplace_df[col]
    
    mse = mean_squared_error(true_vals, laplace_vals)
    bias = np.mean(laplace_vals - true_vals)
    
    mse_results[col] = mse
    bias_results[col] = bias

print("Mean Squared Error (MSE) for each column:")
for col, mse in mse_results.items():
    print(f"{col}: {mse:.2f}")

print("\nBias, or average error, for each column:")
for col, bias in bias_results.items():
    print(f"{col}: {bias:.2f}")

# scatter plot of True vs Noisy values
for col in columns:
    plt.figure(figsize=(6, 6))
    sns.scatterplot(x=true_df[col], y=laplace_df[col], alpha=0.5)
    # add a y = x line for reference
    plt.plot([0, 1_000_000], [0, 1_000_000], '--r') 
    plt.title(f'True vs Laplace-Privatized {col}')
    plt.xlabel('True Value')
    plt.ylabel('Laplace Noisy Value')
    plt.grid(True)
    plt.show()
    