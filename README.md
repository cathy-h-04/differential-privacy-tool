
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
This is our home page and also contains the main form we are trying to privatize. Fill in the values of the form and click "See 