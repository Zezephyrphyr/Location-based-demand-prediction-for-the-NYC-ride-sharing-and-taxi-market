
# coding: utf-8

# In[ ]:


import pandas as pd


# In[46]:


df =pd.read_csv("taxi _zone_lookup.csv")
df


# In[4]:


import googlemaps


# In[5]:


gmaps_key = googlemaps.Client(key="AIzaSyBITWvoHqr-SOsoWrC1of17do9eXnZcSXI")


# In[8]:


df.head()


# In[9]:


df.iat[i,0]


# In[10]:


df.iat[0,0]


# In[11]:


df.iat[3,0]


# In[45]:


df.iat[0,1]


# In[15]:


gmaps_key = googlemaps.Client(key="{APIKEY}")


# In[16]:


geocode_result = gmaps_key.geocode(df.iat[0,2])


# In[19]:


lat


# In[49]:


#print(df)
df["LAT"] = None
df["LON"] = None
for i in range(0,len(df)):
    
    try:
        geocode_result = gmaps_key.geocode(df.iat[i,1]+" "+df.iat[i,2]+"new york")
        lat = geocode_result[0]["geometry"]["location"]["lat"]
        lon =geocode_result[0]["geometry"]["location"]["lng"]
        df.iat[i,df.columns.get_loc("LAT")] = lat
        df.iat[i,df.columns.get_loc("LON")] = lon
    except:
        lat = None
        lon = None
        


# In[50]:


df


# In[40]:


geocode_result = gmaps_key.geocode(df.iat[8,2]+"new york")


# In[36]:


df.iat[8,2]


# In[37]:


lat = geocode_result[0]["geometry"]["location"]["lat"]
lat


# In[38]:


geocode_result = gmaps_key.geocode(df.iat[8,2])
lat = geocode_result[0]["geometry"]["location"]["lat"]
lat


# In[43]:


df.to_csv(None)


# In[51]:


df.to_csv('output_new.csv', sep='\t', encoding='utf-8')


# In[ ]:




