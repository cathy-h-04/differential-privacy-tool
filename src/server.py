from flask import Flask, request, jsonify
import opendp.prelude as dp
from flask_cors import CORS
import sqlite3
import os
import random
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "shuffle_database.db")


dp.enable_features("honest-but-curious", "contrib")
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])


MIN_BATCH_SIZE = 10  # or whatever batch size you want

def laplace_noise(scale):
    return np.random.laplace(loc=0.0, scale=scale)

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

        try:
            net_worth = float(net_worth)
            epsilon = float(epsilon)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid types for netWorth or epsilon"}), 400

        if epsilon <= 0 or not (net_worth == net_worth):  # net_worth != net_worth checks for NaN
            return jsonify({"error": "Invalid epsilon or net worth"}), 400

        # Now safe
        laplace_mech = dp.m.make_laplace(dp.atom_domain(T=float), dp.absolute_distance(T=float), scale=1/epsilon)
        dp_val = laplace_mech(net_worth)

        return jsonify({'netWorthDP': dp_val})

    except Exception as e:
        print(f"Error in /laplace: {e}")
        return jsonify({"error": str(e)}), 500



@app.route('/submit_data', methods=['POST'])
def submit_data():
    try:
        data = request.get_json()

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()

        # Insert the incoming data
        c.execute('''
            INSERT INTO user_reports (
                user_id, is_personalized, epsilon, dp_mechanism,
                income_bin_real, income_bin_noisy,
                net_worth_real, net_worth_noisy,
                rent_or_mortgage_real, rent_or_mortgage_noisy,
                loan_debt_real, loan_debt_noisy,
                medical_expenses_real, medical_expenses_noisy
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['user_id'],
            int(data['is_personalized']),
            data['epsilon'],
            int(data['dp_mechanism']),
            data['income_bin_real'],
            data['income_bin_noisy'],
            data['net_worth_real'],
            data['net_worth_noisy'],
            data['rent_or_mortgage_real'],
            data['rent_or_mortgage_noisy'],
            data['loan_debt_real'],
            data['loan_debt_noisy'],
            data['medical_expenses_real'],
            data['medical_expenses_noisy']
        ))

        conn.commit()

        # After inserting, check how many unprocessed submissions there are
        c.execute('SELECT COUNT(*) FROM user_reports WHERE is_processed = 0')
        unprocessed_count = c.fetchone()[0]
        print(f"Currently {unprocessed_count} unprocessed reports.")


        # While enough unprocessed rows exist, shuffle+noisify in batches
        while unprocessed_count >= MIN_BATCH_SIZE:
            # Fetch exactly MIN_BATCH_SIZE unprocessed rows
            c.execute('SELECT * FROM user_reports WHERE is_processed = 0 ORDER BY id ASC LIMIT ?', (MIN_BATCH_SIZE,))
            rows = c.fetchall()
            rows = list(rows)

            random.shuffle(rows)

            processed = []

            for row in rows:
                epsilon = row['epsilon'] if row['is_personalized'] else 1.0
                scale = 1.0 / epsilon

                privatized = {
                    "income_bin": row["income_bin_real"],  # can privatize bin if needed
                    "net_worth": row["net_worth_real"] + laplace_noise(scale),
                    "rent_or_mortgage": row["rent_or_mortgage_real"] + laplace_noise(scale),
                    "loan_debt": row["loan_debt_real"] + laplace_noise(scale),
                    "medical_expenses": row["medical_expenses_real"] + laplace_noise(scale)
                }

                processed.append((row["id"], privatized))

            # Mark these rows as processed
            ids = [str(row_id) for row_id, _ in processed]
            c.execute(f"UPDATE user_reports SET is_processed = 1 WHERE id IN ({','.join(['?']*len(ids))})", ids)

            conn.commit()
            print(f"Shuffled and processed a batch of {MIN_BATCH_SIZE} reports.")


            # Re-check how many unprocessed reports remain
            c.execute('SELECT COUNT(*) FROM user_reports WHERE is_processed = 0')
            unprocessed_count = c.fetchone()[0]

        conn.close()

        return jsonify({"status": "success", "message": "Submitted. Shuffling triggered automatically if batch ready."}), 200

    except Exception as e:
        print(f"Error in /submit_data: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500



@app.route('/shuffle_and_noisify', methods=['GET'])
def shuffle_and_noisify():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    # Fetch unprocessed rows
    c.execute('SELECT * FROM user_reports WHERE is_processed = 0')
    rows = c.fetchall()

    if len(rows) < MIN_BATCH_SIZE:
        return jsonify({
            "status": "waiting",
            "message": f"Only {len(rows)} unprocessed reports. Waiting for at least {MIN_BATCH_SIZE}."
        }), 200

    # Shuffle the rows
    rows = list(rows)
    random.shuffle(rows)

    processed = []

    for row in rows:
        epsilon = row['epsilon'] if row['is_personalized'] else 1.0
        scale = 1.0 / epsilon

        privatized = {
            "income_bin": row["income_bin_real"],  # you can also privatize if needed
            "net_worth": row["net_worth_real"] + laplace_noise(scale),
            "rent_or_mortgage": row["rent_or_mortgage_real"] + laplace_noise(scale),
            "loan_debt": row["loan_debt_real"] + laplace_noise(scale),
            "medical_expenses": row["medical_expenses_real"] + laplace_noise(scale)
        }

        processed.append((row["id"], privatized))

    # Mark rows as processed
    ids = [str(row_id) for row_id, _ in processed]
    c.execute(f"UPDATE user_reports SET is_processed = 1 WHERE id IN ({','.join(['?']*len(ids))})", ids)
    conn.commit()
    conn.close()

    # Return privatized data
    return jsonify([entry for _, entry in processed]), 200

if __name__ == '__main__':
    app.run()