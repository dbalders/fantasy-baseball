#!/usr/bin/env python
# coding: utf-8

# In[1]:


from bs4 import BeautifulSoup
import urllib.request
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import pandas as pd
import re
import os
import json


# In[2]:


page_url = "https://baseballmonster.com"
page = urllib.request.urlopen(page_url)
soup = BeautifulSoup(page, 'html.parser')


# In[3]:


# Firefox session
# Firefox session
driver = webdriver.Firefox()
driver.get(page_url)
driver.implicitly_wait(100)


# In[4]:


#Click settings
button = driver.find_elements_by_class_name("nav-item")[1]
button.click()


# In[5]:


button = driver.find_element(By.LINK_TEXT, "League Settings")
button.click()


# In[6]:


batter_table = driver.find_elements_by_class_name("table")[1]
pitcher_table = driver.find_elements_by_class_name("table")[2]

batter_rows = batter_table.find_elements(By.TAG_NAME, "tr")
pitcher_rows = pitcher_table.find_elements(By.TAG_NAME, "tr")

batter_rows = len(batter_rows)
pitcher_rows = len(pitcher_rows)


# In[7]:


batter_header_list = ["Games", "At Bats", "On-Base Percentage (OBP)", "Slugging Percentage (SLG)", "On-Base + Slugging (OPS)", "Hits", "Singles", "Doubles", "Triples", "Extra Base Hits", "Walks", "Strikeouts"]
pitcher_header_list = ["Games", "Innings Pitched", "Opponent Batting Avg (approx.)", "Quality Starts", "Complete Games", "Shutouts", "Holds", "Saves plus Holds", "Earned Runs", "Strikeouts/9", "Outs"]


# In[8]:


for i in range(batter_rows):
    radiotr = batter_table.find_elements(By.TAG_NAME, "tr")[i]
    if i > 0:
        for j in range(len(batter_header_list)):
            title = radiotr.find_elements(By.TAG_NAME, "td")[0].text
            if batter_header_list[j] == title:
                radio = radiotr.find_elements(By.TAG_NAME, "td")[2]
                radio.click()
        


# In[9]:


for i in range(pitcher_rows):
    radiotr = pitcher_table.find_elements(By.TAG_NAME, "tr")[i]
    if i > 0:
        for j in range(len(pitcher_header_list)):
            title = radiotr.find_elements(By.TAG_NAME, "td")[0].text
            if pitcher_header_list[j] == title:
                radio = radiotr.find_elements(By.TAG_NAME, "td")[2]
                radio.click()


# In[10]:


save_btn = driver.find_element_by_id("ContentPlaceHolder1_SaveSettingsButton")
save_btn.click()


# In[11]:


#Click settings
button = driver.find_elements_by_class_name("nav-item")[0]
button.click()
button = driver.find_element(By.LINK_TEXT, "Player Rankings")
button.click()


# In[12]:


rankings_table = driver.find_elements_by_class_name("table")[0]
rankings_table_html = driver.execute_script("return arguments[0].outerHTML;", rankings_table)


# In[13]:


def isfloat(value):
    try:
        float(value)
        return True
    except ValueError:
        return False


# In[ ]:





# In[14]:


soup = BeautifulSoup(rankings_table_html)
table_header = soup.find_all("thead")
table_headers = table_header[0].find_all("th")
table_body = soup.find_all("tbody")

table_headers_array = []
pitcher_start = 0

for i in range(len(table_headers)):
    table_headers_array.append(table_headers[i].string.strip())
    if table_headers[i].string.strip() == 'IP':
        pitcher_start = i


# In[15]:


table_body = soup.find_all("tbody")
rankings_table_json = []

for i in range(len(table_body)):
    table_rows = table_body[i].find_all("tr")
    for j in range(len(table_rows)):
        rankings_table_td = table_rows[j].find_all("td")
        rankings_table_object = {}
        for k in range(len(rankings_table_td)):
            pitcher = False
    
            if rankings_table_td[7].string.strip() == 'SP':
                pitcher = True
                rankings_table_object["playerType"] = "Pitcher"
                
            elif rankings_table_td[7].string.strip() == 'RP':
                pitcher = True
                rankings_table_object["playerType"] = "Pitcher"
                
            else:
                rankings_table_object["playerType"] = "Batter"

            if pitcher == True:
                if k < 8:
                    if (isfloat(rankings_table_td[k].string.strip())):
                        rankings_table_object[table_headers_array[k]] = float(rankings_table_td[k].string.strip())
                    elif rankings_table_td[k].string.strip() == " ":
                        rankings_table_object[table_headers_array[k]] = 0
                    else:
                        rankings_table_object[table_headers_array[k]] = rankings_table_td[k].string.strip()
                elif k >= (pitcher_start):
                    if (isfloat(rankings_table_td[k].string.strip())):
                        rankings_table_object[table_headers_array[k]] = float(rankings_table_td[k].string.strip())
                    elif rankings_table_td[k].string.strip() == " ":
                        rankings_table_object[table_headers_array[k]] = 0
                    else:
                        rankings_table_object[table_headers_array[k]] = rankings_table_td[k].string.strip()
                else:
                    k = pitcher_start
            else:
                if k < pitcher_start:
                    if (isfloat(rankings_table_td[k].string.strip())):
                        rankings_table_object[table_headers_array[k]] = float(rankings_table_td[k].string.strip())
                    elif rankings_table_td[k].string.strip() == " ":
                        rankings_table_object[table_headers_array[k]] = 0
                    else:
                        rankings_table_object[table_headers_array[k]] = rankings_table_td[k].string.strip()
    
        rankings_table_json.append(rankings_table_object)
        
with open('data.json', 'w') as outfile:
    json.dump(rankings_table_json, outfile)


# In[ ]:




