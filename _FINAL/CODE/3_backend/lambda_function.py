import sys

# Make sure we are able to load the local modules
sys.path.append('./modules')

import json
import os
from datetime import datetime
from datetime import date
import calendar
from joblib import load
from sklearn.preprocessing import MinMaxScaler, StandardScaler
import numpy as np
import urllib.request
import redis

GRID_SIZE = 30

def lambda_handler(event, context):
    if event['context']['resource-path'] == '/rides':
        date_string = event['params']['querystring']['date'].lower()
        hour = event['params']['querystring']['hour']

        r = redis.Redis(host='redis-17637.c84.us-east-1-2.ec2.cloud.redislabs.com',
                        port=17637, db=0, password='io4i66Ip7JSKIaN1OsvBVJtRv0yAoHeE')

        cache_key = date_string + '_' + hour
        response = r.get(cache_key)

        if response:
            return json.loads(response)

        # Parse the incomming date
        predicted_date = datetime.strptime(date_string, '%Y-%m-%d')
        cal = calendar.Calendar(firstweekday=0)
        days = []
        for i in cal.iterweekdays():
            if i == predicted_date.weekday():
                days.append(1)
            else:
                days.append(0)

        # Get weather
        contents = json.loads(urllib.request.urlopen(
            "https://api.darksky.net/forecast/46ad1914de7f31ac51a8bddf31c68ee7/42.3601,-71.0589").read())
        daily_weather = contents['daily']['data']
        delta = (predicted_date.date() - date.today()).days
        temp = int((daily_weather[delta]['temperatureHigh'] +
                    daily_weather[delta]['temperatureLow']) / 2)
        precip = float(daily_weather[delta]['precipIntensity'])

        X = []

        for x in range(0, GRID_SIZE):
            for y in range(0, GRID_SIZE):
                X.append([
                    int(predicted_date.strftime('%j')),  # 'day'
                    int(hour),  # 'hour'
                    temp,  # 'temp'
                    precip,  # 'precip'
                    x,  # 'x'
                    y,  # 'y'
                    days[4],  # 'Friday'
                    days[0],  # 'Monday'
                    days[5],  # 'Saturday'
                    days[6],  # 'Sunday'
                    days[3],  # 'Thursday'
                    days[1],  # 'Tuesday'
                    days[2],  # 'Wednesday'
                ])

        model = load('./models/model.joblib')
        y_pred = model.predict(X)

        sc = StandardScaler()
        y_pred_scaled = sc.fit_transform(np.reshape(y_pred, (-1, 1)))
        sc = MinMaxScaler(feature_range=(0, 1))
        y_pred_scaled = sc.fit_transform(y_pred_scaled)

        y_pred = y_pred.flatten().tolist()
        y_pred_scaled = y_pred_scaled.flatten().tolist()

        response = [{"x": int(row[4]), "y": int(row[5]), "demand": float(
            y_pred[i]), "demand_scaled": float(y_pred_scaled[i])} for i, row in enumerate(X)]

        # Cache the result and store for the next 7 days
        r.set(cache_key, json.dumps(response), ex=604800)

        return response
