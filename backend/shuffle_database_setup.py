import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "shuffled_database.db")  # Note: New file name!

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

c.execute('''
CREATE TABLE IF NOT EXISTS shuffled_user_reports (
    row_id INTEGER PRIMARY KEY AUTOINCREMENT, -- meaningless random ID
    income_bin_noisy INTEGER NOT NULL,
    net_worth_noisy REAL NOT NULL,
    rent_or_mortgage_noisy REAL NOT NULL,
    loan_debt_noisy REAL NOT NULL,
    medical_expenses_noisy REAL NOT NULL,
    is_processed BOOLEAN DEFAULT 0
);
''')

conn.commit()
conn.close()

print("Shuffled database and table created successfully!")
