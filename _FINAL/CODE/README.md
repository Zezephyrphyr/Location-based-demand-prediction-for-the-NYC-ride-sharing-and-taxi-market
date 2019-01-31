# Code

Code packages in this directory:

## 0_data

Includes the data or example data used or generated over the course of this project while `aggregated.csv` is the final processed dataset used for prediction.

## 1_processing

All the code used for processing the raw taxi data, generate the grid and fetch the weather data.

## 2_modelling

Code used to conduct the machine learning experiments and persist the final model to disk in order to use it in the backend for prediction.

## 3_backend

AWS Lambda function which sits behind AWS API Gateway and is called by the frontend to get the actual predictions.
This function uses the model genereated by the abovementioned code.

## 4_frontend

React frontend that viualizes the demand predictions in Google Maps.

## Overview video
https://youtu.be/QhIMlnaKrTk
