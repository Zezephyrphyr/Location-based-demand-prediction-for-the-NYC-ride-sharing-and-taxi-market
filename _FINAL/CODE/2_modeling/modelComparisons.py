	
# Compare Algorithms
from time import time

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn import model_selection
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import (GridSearchCV, RandomizedSearchCV,
                                     cross_val_score, cross_validate,
                                     train_test_split)
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor


def evaluate(model, X_test, y_test):
    predictions = model.predict(X_test)
    errors = abs(predictions - y_test)
    mape = 100 * np.mean(errors / y_test)
    accuracy = 100 - mape
    print('Model Performance')
    print('Average Error: {:0.4f} degrees.'.format(np.mean(errors)))
    print('Accuracy = {:0.2f}%.'.format(accuracy))
    
    return accuracy

# Sample of 40K rows with demand set to classify (>= average is 1 while < average is 0)
# Goal of estimating timing and accuracy of different classifiers
dataset = pd.read_csv('./dataCleanedFinal.csv')
dataset = pd.concat([dataset, pd.get_dummies(dataset.day_of_week).rename(columns = "{}".format)], axis = 1)

dataset.drop(['day_of_week'], axis=1, inplace=True)
dataset.dropna(inplace=True)

X = dataset.iloc[:, 1:].values
y = dataset.iloc[:, 0].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

# prepare different classification models
models = []
models.append(('LR', LogisticRegression())) #TOO LOW ACCURACY
models.append(('LDA', LinearDiscriminantAnalysis()))
models.append(('KNN', KNeighborsClassifier()))
models.append(('CART', DecisionTreeClassifier()))
models.append(('RFC', RandomForestClassifier()))
models.append(('MLP', MLPClassifier(max_iter=1000))) #TOO SLOW & VOLATILE
models.append(('SVM', SVC())) #TOO SLOW. Takes approximately 15 minutes.
models.append(('NB', GaussianNB())) #TOO LOW ACCURACY

# evaluate each model in turn
for name, model in models:
        
    timeStart = time()
    model.fit(X_train, y_train)

    trainScore = accuracy_score(y_train, model.predict(X_train).round())
    testScore = accuracy_score(y_test, model.predict(X_test).round())
    timeElapsed = time() - timeStart

    msg = "%s: Train Score: %f Test Score: %f Time Elapsed: %f" % (name, trainScore, testScore, timeElapsed)
    print(msg)