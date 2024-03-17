# views.py
import json
import os
from flask import Blueprint, render_template, redirect, url_for, request
from utils import get_data

views = Blueprint('views', __name__)


@views.route("/")
def default():
    return redirect(url_for("views.dashboard"))


@views.route("/dashboard")
def dashboard():
    AV_API_KEY = os.getenv('AV_API_KEY')
    stocks = ["AAPL", "MSFT", "NVDA", "TSM", "AVGO", "ORCL", "ADBE", "ASML", "CSCO", "CRM"]
    stock_data = {}
    previous_data = {}

    for symbol in stocks:
        stock_url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={AV_API_KEY}"
        data = get_data(stock_url)

        # Get the most recent date's data
        recent_date = list(data['Time Series (Daily)'].keys())[0]
        recent_data = data['Time Series (Daily)'][recent_date]

        # Get the previous date's data
        previous_date = list(data['Time Series (Daily)'].keys())[1]  # Assuming the data is sorted
        symbol_previous_data = data['Time Series (Daily)'][previous_date]

        stock_data[symbol] = recent_data
        previous_data[symbol] = symbol_previous_data

    url = url_for('views.stock')
    return render_template('dashboard.html', stock_data=stock_data, previous_data=previous_data, url=url)


@views.route("/stock")
def stock():
    AV_API_KEY = os.getenv('AV_API_KEY')
    symbol = request.args.get('symbol')

    # Time Series Daily API call
    stock_url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={AV_API_KEY}"
    data = get_data(stock_url)
    chart_data = [
        {
            'time': date,
            'open': float(values['1. open']),
            'high': float(values['2. high']),
            'low': float(values['3. low']),
            'close': float(values['4. close']),
        }
        for date, values in data['Time Series (Daily)'].items()
    ]
    chart_data.reverse()

    # Overview API call
    overview_url = f"https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey={AV_API_KEY}"
    overview_data = get_data(overview_url)
    overview_data = {key: overview_data[key] for key in overview_data}
    url = url_for('views.stock')

    return render_template("stock.html", data=json.dumps(chart_data), overview=json.dumps(overview_data), symbol=symbol, url=url)



