
# CS2080project
## Overview
This repository is split into **backend** (Flask API) and **frontend** (React/Tailwind) folders.

Run the backend. Cd into the backend/ folder
1. First, set up a python virtual environment for the backend:
python3 -m venv venv

2. Then, activate the environment
source venv/bin/activate

### Backend
- Navigate to the backend folder:
  ```bash
  cd backend
  pip install -r requirements.txt
  python3 database_setup.py
  python3 shuffle_database_setup.py
  python3 server.py
  ```

### Frontend
- Navigate to the frontend folder:
  ```bash
  cd frontend
  npm install
  npm start
  ```

### Quick Guide
- /Data Input 
This is our home page and also contains the main form we are trying to privatize. Fill in the values of the form and click "Privatize My Data". The form autopopulates with exponential mechanism with binning for all of the fields, essentially injecting noise locally. NOTHING is sent to the server with this button. 
After user clicks on the button, scroll down, and you will see an option to submit (only after the user clicks on privatize my data). This is what is sent server side to database.

We thus enforce that all data reaching the server is privatized with epsilon of 2.0 (which we set in our code). 

- /Privacy Playground

Here, user can experiment with different mechanisms to see their results. Note that ONLY networth column has the mechanism applied. For shuffle and Personalized DP, this option does not really make sense for a single user to experiment on, so a modal pops up that explains these concepts. 

- /Run Query
Build a SQL query using the interface. On the server side, the query is executed. For every row that is queried, we apply personalzied DP, looking up the row's personal epsilon, running the personal DP mechanism, and determining whether to include the row or not. 