import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn import metrics
from joblib import dump

dataset = pd.read_csv('./aggregated.csv')

dataset = pd.concat([dataset, pd.get_dummies(dataset.day_of_week).rename(columns = "{}".format)], axis = 1)

dataset.drop(['day_of_week'], axis=1, inplace=True)
dataset.dropna(inplace=True)

#    demand  day  hour  temp  precip   x   y  Friday  Monday  Saturday  Sunday  Thursday  Tuesday  Wednesday
# 0    6650  306     1  34.5    10.0  15  17       0       0         0       1         0        0          0
# 1    6395   62    19   0.0    10.0  16  19       0       1         0       0         0        0          0
# 2    6321   84    19  14.0    10.0  16  19       0       0         0       0         0        1          0
# 3    6290  105    19  41.5     7.5  16  19       0       0         0       0         0        1          0
# 4    6267   83    18   2.0    10.0  16  19       0       1         0       0         0        0          0

# The coordinate pair is the most imporant predictor pushing the R^2 to more than 90, the weekdays help pushing it towards 100.

X = dataset.iloc[:, 1:].values
y = dataset.iloc[:, 0].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

regressor = RandomForestRegressor(n_estimators=20, random_state=0, max_depth=15)
regressor.fit(X_train, y_train)


y_pred = regressor.predict(X_test)

print('R^2:', metrics.r2_score(y_test, y_pred))
print('Mean Absolute Error:', metrics.mean_absolute_error(y_test, y_pred))
print('Mean Squared Error:', metrics.mean_squared_error(y_test, y_pred))
print('Root Mean Squared Error:', np.sqrt(metrics.mean_squared_error(y_test, y_pred)))

# Persits the model for future use
dump(regressor, './models/model.joblib')
