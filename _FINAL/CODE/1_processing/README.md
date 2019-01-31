# Processing

## Prequisites

- Python 3.6
- Plac
- pytz

## SQL Files

- The `setup.sql` file contains all the sql commands used to setup the tables in Amazon Athena.
- The `process.sql` file contains queries to inspect different states of the data processing.

## Generate a new Grid

To generate a new grid run:
```
python grid.py grid.csv
```

## Fetch Historic Weather Data

To fetch the historic weather data for 2014 from weather.com run:

```
python scrape.py
```
