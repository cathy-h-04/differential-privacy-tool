import random
import requests
import time


# Set your backend endpoint here
BACKEND_URL = "http://127.0.0.1:5000/submit_data"  # example, you might need to change


income_ranges = [
   "Less than $20k",
   "$20k–$40k",
   "$40k–$60k",
   "$60k–$100k",
   "100k-200k",
   "200k-300k",
   "300k-400k",
   "400k-500k",
   ">500k"
]


dp_mechanisms = [
   "Randomized Response",
   "Exponential",
   "Shuffle",
   "Personalized DP"
]


def generate_user_data():
   return {
       "income_range": random.choice(income_ranges),
       "net_worth": round(random.uniform(-50000, 1000000), 2),
       "monthly_rent": round(random.uniform(0, 10000), 2),
       "loan_debt": round(random.uniform(0, 500000), 2),
       "medical_expenses": round(random.uniform(0, 50000), 2),
       "epsilon": round(random.uniform(0.5, 10), 2),
       "dp_mechanism": random.choice(dp_mechanisms)
   }


def send_data():
   user_data = generate_user_data()
   response = requests.post(BACKEND_URL, json=user_data)
  
   if response.status_code == 200:
       print(f"Success: {response.json()}")
       return response.json()
   else:
       print(f"Failed with status {response.status_code}")
       return None


def main():
   results = []
   num_requests = 50  # how many fake users you want to simulate


   for _ in range(num_requests):
       result = send_data()
       if result:
           results.append(result)
       time.sleep(0.1)  # small delay so you don't overload server
  
   # After sending, save all results
   import json
   with open("test_results.json", "w") as f:
       json.dump(results, f, indent=2)


   print(f"\nSaved {len(results)} results to 'test_results.json'.")


if __name__ == "__main__":
   main()



