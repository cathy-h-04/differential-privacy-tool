from flask import Flask, request, jsonify
import opendp.prelude as dp
from flask_cors import CORS
import sqlite3
import os
import random
import numpy as np
import random
import math

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.db")

dp.enable_features("honest-but-curious", "contrib")
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])


MIN_BATCH_SIZE = 10  # Minimum reports needed to process a batch

# ------------------------ Helper Functions ------------------------

def randomized_response_binned(true_bin, epsilon, num_bins):
    p = math.exp(epsilon) / (math.exp(epsilon) + num_bins - 1)
    if random.random() < p:
        return true_bin
    else:
        other_bins = [b for b in range(num_bins) if b != true_bin]
        return random.choice(other_bins)
    
def laplace_noise(scale):
    return np.random.laplace(loc=0.0, scale=scale)

def privatize_personalized(row, threshold=2.0):
    user_epsilon = row['epsilon']
    num_bins = 5 

    if user_epsilon >= threshold:
        sampling_prob = 1.0
    else:
        sampling_prob = (np.exp(user_epsilon) - 1) / (np.exp(threshold) - 1)

    if random.random() <= sampling_prob:
        scale = 1.0 / threshold
        return {
            "income_bin": randomized_response_binned(row["income_bin"], threshold, num_bins),
            "net_worth": row["net_worth"] + laplace_noise(scale),
            "rent_or_mortgage": row["rent_or_mortgage"] + laplace_noise(scale),
            "loan_debt": row["loan_debt"] + laplace_noise(scale),
            "medical_expenses": row["medical_expenses"] + laplace_noise(scale)
        }
    else:
        return {
            "income_bin": None,
            "net_worth": None,
            "rent_or_mortgage": None,
            "loan_debt": None,
            "medical_expenses": None
        }

@app.route('/personalized_query', methods=['POST'])
def personalized_query():
    try:
        data = request.get_json()
        where_clause = data.get('where', '')

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()

        query = f"SELECT * FROM user_reports"
        if where_clause.strip():
            query += f" WHERE {where_clause}"

        print(f"Executing SQL: {query}")
        c.execute(query)
        rows = c.fetchall()
        conn.close()

        result = []
        total = len(rows)
        included = 0

        for row in rows:
            privatized = privatize_personalized(row)

            if any(value is not None for value in privatized.values()):
                included += 1
                print(f"Included user_id={row['user_id']}, ε={row['epsilon']}")
                result.append({
                    **privatized
                })
            else:
                print(f"Dropped user_id={row['user_id']} due to sampling (ε={row['epsilon']})")

        return jsonify({"status": "success", "count": len(result), "results": result}), 200

    except Exception as e:
        print(f"Error in /personalized_query: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500



def insert_shuffle_record(data):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute('''
        INSERT INTO user_reports (
            user_id, epsilon, income_bin, net_worth, rent_or_mortgage,
            loan_debt, medical_expenses
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['user_id'],
        data['epsilon'],
        data['income_bin'],
        data['net_worth'],
        data['rent_or_mortgage'],
        data['loan_debt'],
        data['medical_expenses'],
    ))

    conn.commit()
    conn.close()

def process_shuffle_batch_if_ready():
    """Check if enough shuffle rows exist. If yes, shuffle and write to clean database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    c.execute('SELECT COUNT(*) FROM user_reports WHERE is_processed = 0')
    unprocessed_count = c.fetchone()[0]

    if unprocessed_count < MIN_BATCH_SIZE:
        conn.close()
        return  # Not enough shuffle records yet

    # Enough records: fetch and shuffle
    c.execute('SELECT * FROM user_reports WHERE is_processed = 0 ORDER BY id ASC LIMIT ?', (MIN_BATCH_SIZE,))
    rows = list(c.fetchall())
    random.shuffle(rows)

    # Write shuffled noisy data to shuffled database
    write_shuffled_rows(rows)

    # Mark original records as processed
    ids = [str(row['id']) for row in rows]
    c.execute(f"UPDATE user_reports SET is_processed = 1 WHERE id IN ({','.join(['?'] * len(ids))})", ids)
    conn.commit()
    conn.close()

    print(f"Processed and saved a batch of {MIN_BATCH_SIZE} shuffled reports.")

def write_shuffled_rows(rows):
    """Write a list of shuffled noisy rows into the shuffled database."""
    SHUFFLE_DB_PATH = os.path.join(BASE_DIR, "shuffled_database.db")
    conn_shuffle = sqlite3.connect(SHUFFLE_DB_PATH)
    c_shuffle = conn_shuffle.cursor()

    for row in rows:
        c_shuffle.execute('''
            INSERT INTO shuffled_user_reports (
                income_bin, net_worth,
                rent_or_mortgage, loan_debt, medical_expenses
            ) VALUES (?, ?, ?, ?, ?)
        ''', (
            row["income_bin"],
            row["net_worth"],
            row["rent_or_mortgage"],
            row["loan_debt"],
            row["medical_expenses"]
        ))

    conn_shuffle.commit()
    conn_shuffle.close()


# ------------------------ Flask Endpoints ------------------------


@app.route('/laplace', methods=['POST'])
def laplace():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        net_worth = data.get('netWorth')
        epsilon = data.get('epsilon')

        if net_worth is None or epsilon is None:
            return jsonify({"error": "Missing netWorth or epsilon"}), 400

        net_worth = float(net_worth)
        epsilon = float(epsilon)

        if epsilon <= 0 or not (net_worth == net_worth):
            return jsonify({"error": "Invalid epsilon or net worth"}), 400

        laplace_mech = dp.m.make_laplace(dp.atom_domain(T=float), dp.absolute_distance(T=float), scale=750000/epsilon)
        clamped_net_worth = np.clip(net_worth, 0, 750000)
        dp_val = laplace_mech(clamped_net_worth)

        return jsonify({'netWorthDP': dp_val})

    except Exception as e:
        print(f"Error in /laplace: {e}")
        return jsonify({"error": str(e)}), 500



@app.route('/submit_data', methods=['POST'])
def submit_data():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400
        insert_shuffle_record(data)
        process_shuffle_batch_if_ready()

        return jsonify({"status": "success", "message": "Submitted. Shuffling triggered if batch ready."}), 200

    except Exception as e:
        print(f"Error in /submit_data: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run()
