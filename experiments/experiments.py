import math 
import random 
import numpy as np
import opendp.prelude as dp
import pandas as pd 

dp.enable_features("honest-but-curious", "contrib")

def utility(a, b):
    return -abs(a - b)

def exponential(true_bin, epsilon):
    center_bin = [10000, 30000, 50000, 80000, 150000, 250000, 350000, 450000, 750000]
    actual_val = center_bin[true_bin]
    sensitivity = 1000000

    scores = [math.exp((epsilon * utility(actual_val, val)) / sensitivity) for val in center_bin]
    total = sum(scores)
    probs = [score / total for score in scores]

    rand = random.random()
    count = 0
    for i, p in enumerate(probs):
        count += p 
        if rand < count:
            return i 
        
def laplace(val, epsilon):
    laplace_mech = dp.m.make_laplace(dp.atom_domain(T=float), dp.absolute_distance(T=float), scale=750000/epsilon)
    clamped_net_worth = np.clip(val, 0, 1000000)
    dp_val = laplace_mech(clamped_net_worth)
    return dp_val

def randomized_response(true_bin, epsilon, num_bins):
    p = math.exp(epsilon) / (math.exp(epsilon) + num_bins - 1)
    random_value = random.random()

    if random_value < p:
        return true_bin
    other_bins = [b for b in range(num_bins) if b != true_bin]
    return random.choice(other_bins)

def bin_data(val):
    bins = [20000, 40000, 60000, 100000, 200000, 300000, 400000, 500000, float('inf')]
    for i, bin_limit in enumerate(bins):
        if val <= bin_limit:
            return i

def experiments(trials, epsilon):
    
    laplace_results = []
    rr_results = []
    exp_results = []
    true_results = []

    for _ in range(trials):
        net_worth = random.uniform(0, 1000000)  
        rent_or_mortgage = random.uniform(0, 1000000) 
        loan_debt = random.uniform(0, 100000)  
        medical_expenses = random.uniform(0, 1000000)  
        income_bins = ["Less than $20k", "$20k–$40k", "$40k–$60k", "$60k–$100k", "100k-200k", "200k-300k", "300k-400k", "400k-500k", ">500k"]
        income_bin_index = random.randint(0, len(income_bins) - 1)

        bin_net_worth = bin_data(net_worth)
        bin_rent_or_mortgage = bin_data(rent_or_mortgage)
        bin_loan_debt = bin_data(loan_debt)
        bin_medical_expenses = bin_data(medical_expenses)
        
        true_results.append([net_worth, rent_or_mortgage, loan_debt, medical_expenses, income_bin_index])
        laplace_results.append([laplace(net_worth, epsilon), laplace(rent_or_mortgage, epsilon), 
                                laplace(loan_debt, epsilon), laplace(medical_expenses, epsilon), None])
        exp_results.append([exponential(bin_net_worth, epsilon), exponential(bin_rent_or_mortgage, epsilon), 
                            exponential(bin_loan_debt, epsilon), exponential(bin_medical_expenses, epsilon),
                            exponential(income_bin_index, epsilon)])
        rr_results.append([randomized_response(bin_net_worth, epsilon, len(income_bins)),
                           randomized_response(bin_rent_or_mortgage, epsilon, len(income_bins)),
                           randomized_response(bin_loan_debt, epsilon, len(income_bins)),
                           randomized_response(bin_medical_expenses, epsilon, len(income_bins)),
                           randomized_response(income_bin_index, epsilon, len(income_bins))])

    cols = ['Net Worth', 'Rent or Mortgage', 'Loan Debt', 'Medical Expenses', 'Income Bin']
    true_df = pd.DataFrame(true_results, columns= cols)
    laplace_df = pd.DataFrame(laplace_results, columns = cols)
    exp_df = pd.DataFrame(exp_results, columns = cols)
    rr_df = pd.DataFrame(rr_results, columns = cols)

    true_df.to_csv('true.csv', index=False)
    laplace_df.to_csv('laplace.csv', index=False)
    exp_df.to_csv('exponential.csv', index=False)
    rr_df.to_csv('randomized_response.csv', index=False)

experiments(1000, 2)




