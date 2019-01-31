# Backend

## Prequisites

- Python 3.6
- Flask

The following Python modules need to be installed in the the `modules` directory because they have to be part of the function and cannot be installed globally in AWS:

- scikit-learn
- redis
- joblib


## Setup Instructions

1. Install the module dependencies locally:
```
pip install <module_name> -t ./modules
```
2. Start the development server using Flask:
```
FLASK_APP=server.py flask run
```

## Update the Function

Use the following command to update the lambda function, executed in the root directory of the repo:

```
zip -r rideApi.zip * \
&& aws s3 cp rideApi.zip s3://cs6220-t1-raw/application/rideApi.zip \
&& aws lambda update-function-code \
--function-name arn:aws:lambda:us-east-1:333040789555:function:rideApi \
--s3-bucket cs6220-t1-raw \
--s3-key application/rideApi.zip \
&& rm rideApi.zip
```
