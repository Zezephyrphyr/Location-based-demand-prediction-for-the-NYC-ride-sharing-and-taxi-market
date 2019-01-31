import requests
import calendar
from datetime import datetime
import pytz
import csv

YEAR = 2014
API_KEY = '6532d6454b8aa370768e63d6ba5a832e'

for month in range(1,13):
    month_range = calendar.monthrange(YEAR, month)
    start_date = str(YEAR) + str(month).zfill(2) + '01'
    end_date = str(YEAR) + str(month).zfill(2) + str(month_range[1])
    url = 'https://api.weather.com/v1/geocode/40.77000046/-73.98000336/observations/historical.json?apiKey=%s&startDate=%s&endDate=%s&units=e' % (API_KEY, start_date, end_date)

    r = requests.get(url)

    if r.status_code != 200:
        print('Problem with the request.')
        exit()

    weather = r.json()
    f = csv.writer(open("weather"+str(month).zfill(2)+".csv", "w+"))

    headers =  list(weather['observations'][0].keys())

    f.writerow(['datetime_est'] + headers)

    for observation in weather['observations']:
        date_time = datetime.utcfromtimestamp(observation['valid_time_gmt']) #.strftime('%Y-%m-%d %H:%M:%S'))
        date_time = date_time.replace(tzinfo=pytz.utc).astimezone(pytz.timezone('US/Eastern'))

        f.writerow([date_time.strftime('%Y-%m-%d %H:%M:%S')] + [observation[key] for key in headers])

