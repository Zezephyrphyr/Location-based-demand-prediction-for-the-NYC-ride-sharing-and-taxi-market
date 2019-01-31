# Compare Algorithms
from time import time

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn import model_selection
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import (GridSearchCV, RandomizedSearchCV,
                                     cross_val_score, cross_validate,
                                     train_test_split)
from sklearn.preprocessing import StandardScaler


def evaluate(model, X_test, y_test):
    predictions = model.predict(X_test)
    errors = abs(predictions - y_test)
    mape = 100 * np.mean(errors / y_test)
    accuracy = max(0,100 - mape)
    print('Model Performance')
    print('Average Error: {:0.4f} degrees.'.format(np.mean(errors)))
    print('Accuracy = {:0.2f}%.'.format(accuracy))
    
    return accuracy

dataset = pd.read_csv('./aggregated.csv')
dataset = pd.concat([dataset, pd.get_dummies(dataset.day_of_week).rename(columns = "{}".format)], axis = 1)

dataset.drop(['day_of_week'], axis=1, inplace=True)
dataset.dropna(inplace=True)

X = dataset.iloc[:, 1:].values
y = dataset.iloc[:, 0].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

param_grid = {
    'n_estimators': [20,40,60,80,100,120,140,160,180,200], #number of trees in the forest
    'max_depth': [30,35,40,45,50,55,60], # max number of levels in each decision tree
    'max_features': ['auto', 'sqrt'], # max number of features considered for splitting a node
    'min_samples_split': [2,5,10,15,20], #min number of data points placed in a node before the node is split
    'min_samples_leaf': [1,2,4,6], # min number of data points allowed in a leaf node 
    'bootstrap': [True, False] # method for sampling data points (with or without replacement)
}


# Best parameters:  {'n_estimators': 200, 'min_samples_split': 2, 'min_samples_leaf': 1, 'max_features': 'auto', 'max_depth': 40, 'bootstrap': True}
# Best score:  0.985177877164777

# Model Performance
# Average Error: 15.8474 degrees.
# Accuracy = 60.71%.
# Model Performance
# Average Error: 15.4759 degrees.
# Accuracy = 61.17%.
# Testing Accuracy % Change of 0.75% from 60.71% to 61.17% (change of 0.46%).
#
#
# WARNING! Change n_iter and cv below. When they are 100 and 10 respectively, it will take 10+ hours on a 8 core CPU.
#
#
rfcTuning = GridSearchCV(RandomForestRegressor(), param_grid = param_grid, cv=10)
rfcTuning = RandomizedSearchCV(estimator = RandomForestRegressor(), param_distributions = param_grid, n_iter = 100, cv = 10, verbose=2, random_state=0)
rfcTuning.fit(X_train, y_train)
print("Random forest tuning: ")
print("Best parameters: ", rfcTuning.best_params_)
print("Best score: ", rfcTuning.best_score_, " \n")
    
base_model = RandomForestRegressor(n_estimators=15, random_state=0)
base_model.fit(X_train, y_train)
base_accuracy = evaluate(base_model, X_test, y_test)

best_random = rfcTuning.best_estimator_
random_accuracy = evaluate(best_random, X_test, y_test)

improvement = 100 * (random_accuracy - base_accuracy) / base_accuracy

print('Testing Accuracy % Change of {:0.2f}% from {:0.2f}% to {:0.2f}% (change of {:0.2f}%).'.format( improvement, base_accuracy, random_accuracy, random_accuracy-base_accuracy ))
