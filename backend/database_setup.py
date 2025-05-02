import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.db")

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

c.execute('''
CREATE TABLE IF NOT EXISTS user_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    epsilon REAL NOT NULL,
    income_bin INTEGER NOT NULL,
    net_worth REAL NOT NULL,
    rent_or_mortgage REAL NOT NULL,
    loan_debt REAL NOT NULL,
    medical_expenses REAL NOT NULL,
    is_processed BOOLEAN DEFAULT 0
);
''')

conn.commit()
conn.close()

print("Database and user_reports table created successfully!")
