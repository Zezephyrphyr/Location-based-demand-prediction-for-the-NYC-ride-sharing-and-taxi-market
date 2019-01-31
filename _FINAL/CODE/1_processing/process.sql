-- Combined Taxi/Weather
select taxi.*, temp, precip_hrly from taxi
LEFT JOIN (
    SELECT date_format(weather.datetime_est, '%j-%k') as day_hour, avg(temp) as temp, avg(precip_hrly) as precip_hrly FROM weather GROUP BY date_format(weather.datetime_est, '%j-%k')
) weather ON(date_format(taxi.pickup_datetime, '%j-%k') = day_hour)
LIMIT 100

-- Combined Taxi/Grid
SELECT taxi.*, grid.x, grid.y FROM taxi
JOIN grid ON(taxi.pickup_latitude <= grid.north_latitude AND taxi.pickup_latitude >= grid.south_latitude
             AND taxi.pickup_longitude >= grid.west_longitude AND taxi.pickup_longitude <= grid.east_longitude)
LIMIT 10

-- Combined Total
select taxi.*, weather.temp, weather.precip_hrly, grid.x, grid.y from taxi
LEFT JOIN (
    SELECT date_format(weather.datetime_est, '%j-%k') as day_hour, avg(temp) as temp, avg(precip_hrly) as precip_hrly FROM weather GROUP BY date_format(weather.datetime_est, '%j-%k')
) weather ON(date_format(taxi.pickup_datetime, '%j-%k') = day_hour)
JOIN grid ON(taxi.pickup_latitude <= grid.north_latitude AND taxi.pickup_latitude >= grid.south_latitude
             AND taxi.pickup_longitude >= grid.west_longitude AND taxi.pickup_longitude <= grid.east_longitude)
LIMIT 100
