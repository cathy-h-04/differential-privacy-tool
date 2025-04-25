from flask import Flask, request, jsonify
import opendp.prelude as dp
from flask_cors import CORS

dp.enable_features("honest-but-curious", "contrib")
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/laplace', methods = ['POST'])
def laplace():
    data = request.get_json()
    net_worth = float(data.get('netWorth'))
    epsilon = data.get('epsilon')

    laplace = dp.m.then_laplace(scale = 1/epsilon)
    dp_val = laplace(net_worth)

    return jsonify({'netWorthDP': dp_val})

if __name__ == '__main__':
    app.run()