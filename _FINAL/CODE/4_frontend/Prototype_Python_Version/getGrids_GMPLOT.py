import pandas as pd
import requests
import gmplot
import math

"""
# this is for test within this file.
date = '2018-12-01'
hour = '16'
url = 'https://owtjarn4j7.execute-api.us-east-1.amazonaws.com/prod/rides?date=' + str(date) +'&hour='+str(hour)
print(url)
data = requests.get(url).json()
df = pd.DataFrame.from_dict(data)
#df.head()

north = 40.90493915804564;
south = 40.48846518521376;
east = -73.72326885045277;
west = -74.27971341040893;
N = 30;
col =0;
row =0;
latUnit = (north-south)/N;
lngUnit = (east-west)/N;
center = [[(0.,0.) for x in range(N)] for y in range(N)];
for x in range(N):
    for y in range(N):
        center[y][x]= (south + (y+0.5)*latUnit, west + (x+0.5)*lngUnit)


latitude_list=[]
longitude_list = []
for i in range(df.shape[0]):
    x = df.iat[i,2]
    y = df.iat[i,3]
    count = df.iat[i,0]
    for j in range(math.floor(count)):
        latitude_list.append(center[y][x][0])
        longitude_list.append(center[y][x][1])


gmap = gmplot.GoogleMapPlotter(40.6974881,-73.979681, 10, 'AIzaSyBITWvoHqr-SOsoWrC1of17do9eXnZcSXI')

# Overlay our datapoints onto the map
gmap.heatmap(latitude_list, longitude_list)
# Generate the heatmap into an HTML file

gmap.draw("test_heatmap" + date +'at'+ hour +".html")
"""

class test:
    def __init__(self,date,hour,bool,max):
        self.date = date
        self.hour = hour
        self.oneDay = bool
        self.max = max
    def printText(self):
        print("abcde")
    def drawMap(self):

        url = 'https://owtjarn4j7.execute-api.us-east-1.amazonaws.com/prod/rides?date=' + str(self.date) +'&hour='+str(self.hour)

        data = requests.get(url).json()
        df = pd.DataFrame.from_dict(data)
        #df.head()

        north = 40.90493915804564;
        south = 40.48846518521376;
        east = -73.72326885045277;
        west = -74.27971341040893;
        N = 30;
        col =0;
        row =0;
        latUnit = (north-south)/N;
        lngUnit = (east-west)/N;
        center = [[(0.,0.) for x in range(N)] for y in range(N)];
        for x in range(N):
            for y in range(N):
                center[y][x]= (south + (y+0.5)*latUnit, west + (x+0.5)*lngUnit)




        if self.oneDay == False:
            latitude_list=[]
            longitude_list = []
            for i in range(df.shape[0]):
                x = df.iat[i,2]
                y = df.iat[i,3]
                count = df.iat[i,0]
                for j in range(math.floor(count)):
                    latitude_list.append(center[y][x][0])
                    longitude_list.append(center[y][x][1])

            localmax = 0.
            coor=(0,0) #x,y
            for i in range(df.shape[0]):
                if localmax < df.iat[i,0]:
                    localmax = df.iat[i,0]
                    x = df.iat[i,2]
                    y = df.iat[i,3]
                    coor = (x,y)


            gmap = gmplot.GoogleMapPlotter(40.6974881,-73.979681, 10, 'AIzaSyBITWvoHqr-SOsoWrC1of17do9eXnZcSXI')

            # Overlay our datapoints onto the map
            gmap.heatmap(latitude_list, longitude_list,threshold=10, radius=15)
            # Generate the heatmap into an HTML file
            print("coor"+str(coor[0])+","+str(coor[1]))

            gmap.marker(center[coor[1]][coor[0]][0], center[coor[1]][coor[0]][1], 'red',title = "I want to see the marker!")
            gmap.text(center[coor[1]][coor[0]][0], center[coor[1]][coor[0]][1],'black',text = "MAXVALUE")
            gmap.draw("test_heatmap" + self.date +'at'+ self.hour +".html")
            print('localmax value is:'+str(localmax))

        elif self.oneDay == True:
            latitude_list=[]
            longitude_list = []

            localmax =0.
            coor=(0,0) #x,y
            for i in range(df.shape[0]):
                self.max = max(df.iat[i,0],  self.max)
                if localmax < df.iat[i,0]:
                    localmax = df.iat[i,0]
                    x = df.iat[i,2]
                    y = df.iat[i,3]
                    coor = (x,y)

            for i in range(df.shape[0]):
                x = df.iat[i,2]
                y = df.iat[i,3]
                count = df.iat[i,0]
                count = count * localmax/self.max
                for j in range(math.floor(count)):
                    latitude_list.append(center[y][x][0])
                    longitude_list.append(center[y][x][1])

            gmap = gmplot.GoogleMapPlotter(40.6974881,-73.979681, 10, 'AIzaSyBITWvoHqr-SOsoWrC1of17do9eXnZcSXI')

            # Overlay our datapoints onto the map
            gmap.heatmap(latitude_list, longitude_list,threshold=10, radius=20)
            # Generate the heatmap into an HTML file
            gmap.marker(center[coor[1]][coor[0]][0], center[coor[1]][coor[0]][1], 'red',title = "I want to see the marker!")
            gmap.text(center[coor[1]][coor[0]][0], center[coor[1]][coor[0]][1],'black', text = "MAXVALUE")
            gmap.draw("test_heatmap" + self.date +'at'+ self.hour +".html")
            print('localmax value is:'+str(localmax))

    def getMax(self):
        return self.max;

