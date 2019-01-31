-- Setup the raw taxi data as a table in Athena

CREATE EXTERNAL TABLE taxi_raw (
   vendor_id string,
   pickup_datetime string,
   dropoff_datetime string,
   passenger_count string,
   trip_distance string,
   pickup_longitude string,
   pickup_latitude string,
   rate_code string,
   store_and_fwd_flag string,
   dropoff_longitude string,
   dropoff_latitude string,
   payment_type string,
   fare_amount string,
   surcharge string,
   mta_tax string,
   tip_amount string,
   tolls_amount string,
   total_amount string
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES ('separatorChar' = ',')
STORED AS TEXTFILE
LOCATION 's3://cs6220-t1-raw/taxi';

-- Reduce to the bare minimum of needed columns and convert to Parquet format

CREATE TABLE IF NOT EXISTS taxi
  WITH (format='PARQUET', external_location='s3://cs6220-t1-raw/preprocessed/taxi/') AS
SELECT
CAST(pickup_datetime as timestamp) as pickup_datetime,
CAST(pickup_latitude AS Decimal(9,6)) as pickup_latitude,
CAST(pickup_longitude AS Decimal(9,6)) as pickup_longitude
FROM taxi_raw WHERE trim(pickup_datetime) != 'pickup_datetime' ORDER BY pickup_datetime

-- Setup the raw weather data as a table in Athena

CREATE EXTERNAL TABLE weather_raw (
datetime_est string,
key string,
temp string,
snow_hrly string,
primary_swell_height string,
uv_desc string,
obs_id string,
precip_hrly string,
qualifier string,
wx_icon string,
wspd string,
feels_like string,
primary_wave_height string,
secondary_swell_height string,
qualifier_svrty string,
gust string,
secondary_swell_direction string,
icon_extd string,
wdir_cardinal string,
dewPt string,
terse_phrase string,
wx_phrase string,
precip_total string,
uv_index string,
wc string,
clds string,
water_temp string,
primary_wave_period string,
obs_name string,
primary_swell_period string,
wdir string,
pressure string,
pressure_tend string,
expire_time_gmt string,
pressure_desc string,
vis string,
max_temp string,
min_temp string,
class string,
primary_swell_direction string,
valid_time_gmt string,
heat_index string,
rh string,
blunt_phrase string,
day_ind string,
secondary_swell_period string
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES ('separatorChar' = ',')
STORED AS TEXTFILE
LOCATION 's3://cs6220-t1-raw/weather'
TBLPROPERTIES ("skip.header.line.count"="1");

-- Reduce to the bare minimum of needed columns and convert to Parquet format

CREATE TABLE IF NOT EXISTS weather
  WITH (format='PARQUET', external_location='s3://cs6220-t1-raw/preprocessed/weather/') AS
select
  CAST(datetime_est AS timestamp) as datetime_est,
  CAST(if(temp = '', null, temp) as integer) as temp,
  CAST(if(precip_hrly = '', null, precip_hrly) as real) as precip_hrly
FROM weather_raw ORDER BY datetime_est

-- Setup the raw grid data as a table in Athena

CREATE EXTERNAL TABLE grid_raw (
   x string,
   y string,
   north string,
   south string,
   east string,
   west string
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES ('separatorChar' = ',')
STORED AS TEXTFILE
LOCATION 's3://cs6220-t1-raw/grid'
TBLPROPERTIES ("skip.header.line.count"="1");

-- Convert grid table to Parquet format

CREATE TABLE IF NOT EXISTS grid
  WITH (format='PARQUET', external_location='s3://cs6220-t1-raw/preprocessed/grid/') AS
SELECT
CAST(x AS integer) as x,
CAST(y AS integer) as y,
CAST(north AS Decimal(9,6)) as north_latitude,
CAST(south AS Decimal(9,6)) as south_latitude,
CAST(east AS Decimal(9,6)) as east_longitude,
CAST(west AS Decimal(9,6)) as west_longitude
FROM grid_raw

-- Create a new table with the complete combined data

CREATE TABLE IF NOT EXISTS combined
  WITH (format='PARQUET', external_location='s3://cs6220-t1-raw/preprocessed/combined/') AS
SELECT taxi.pickup_datetime, weather.temp, weather.precip_hrly, grid.x, grid.y FROM taxi
LEFT JOIN (
    SELECT date_format(weather.datetime_est, '%j-%k') as day_hour, avg(temp) as temp, avg(precip_hrly) as precip_hrly FROM weather GROUP BY date_format(weather.datetime_est, '%j-%k')
) weather ON(date_format(taxi.pickup_datetime, '%j-%k') = day_hour)
JOIN grid ON(taxi.pickup_latitude <= grid.north_latitude AND taxi.pickup_latitude >= grid.south_latitude
             AND taxi.pickup_longitude >= grid.west_longitude AND taxi.pickup_longitude <= grid.east_longitude)
LIMIT 100


-- Create a new table with the complete combined aggregated data

CREATE TABLE IF NOT EXISTS aggregated
  WITH (format='PARQUET', external_location='s3://cs6220-t1-raw/preprocessed/aggregated/') AS
select count(*) as demand, CAST(date_format(pickup_datetime, '%j') as integer) as day, date_format(max(pickup_datetime), '%W') as day_of_week, CAST(date_format(pickup_datetime, '%H') as integer) as hour, avg(temp) as temp, avg(precip_hrly) as precip, x, y from combined
GROUP BY date_format(pickup_datetime, '%j'), date_format(pickup_datetime, '%H'), x, y
