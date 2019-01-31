#!/usr/bin/env python
from flask import Flask
from flask import make_response
from flask import request
import json
import lambda_function

app = Flask(__name__)

@app.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = '*'
    header['Content-Type'] = 'application/json'
    return response

@app.route("/rides", methods=['GET'])
def rides():
    # Create mock event to simulate API Gateway request
    event = {
        "params": {
            "querystring": {
                "date": request.args.get('date'),
                "hour": request.args.get('hour')
            }
        },
        "context":{
            "resource-path": "/rides"
        }
    }

    return json.dumps(lambda_function.lambda_handler(event, {}))
