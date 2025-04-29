import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

laplace_df = pd.read_csv('laplace.csv')

# drop the income bin column since it's None for laplace results
laplace_df = laplace_df.drop(columns=["Income Bin"], errors='ignore')

sns.set(style="whitegrid")

# a boxplot for all continuous fields
plt.figure(figsize=(10, 6))
sns.boxplot(data=laplace_df)
plt.title('Boxplot of Continuous Fields Privatized by Laplace Mechanism')
plt.xlabel('Fields')
plt.ylabel('Value (Dollars)')
plt.xticks(rotation=45)
plt.grid(True)
plt.show()
