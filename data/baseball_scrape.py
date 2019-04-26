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
rankings_table_headers = rankings_table.find_elements(By.TAG_NAME, "thead")[0]
rankings_table_headers = rankings_table_headers.find_elements(By.TAG_NAME, "th")
rankings_table_html = driver.execute_script("return arguments[0].outerHTML;", rankings_table)
# print(rankings_table_html)

table_headers_length = len(rankings_table_headers)
table_headers = []
pitcher_start = 0

for i in range(table_headers_length):
    table_headers.append(rankings_table_headers[i].text)
    if rankings_table_headers[i].text == 'IP':
        pitcher_start = i
    
print(table_headers)


# In[13]:


def isfloat(value):
    try:
        float(value)
        return True
    except ValueError:
        return False


# In[15]:


rankings_table_tbody = rankings_table.find_elements(By.TAG_NAME, "tbody")
    
rankings_table_json = []

for i in range(len(rankings_table_tbody)):
# for i in range(20):
    print(i)
    rankings_table_tr = rankings_table_tbody[i].find_elements(By.TAG_NAME, "tr")
    for j in range(len(rankings_table_tr)):
        rankings_table_td = rankings_table_tr[j].find_elements(By.TAG_NAME, "td")
        rankings_table_td_length = int(len(rankings_table_td) / 2)
        rankings_table_object = {}
        
        for k in range(len(rankings_table_td)):
            pitcher = False
    
            if rankings_table_td[7].text == 'SP':
                pitcher = True
                rankings_table_object["playerType"] = "Pitcher"
                
            elif rankings_table_td[7].text == 'RP':
                pitcher = True
                rankings_table_object["playerType"] = "Pitcher"
                
            else:
                rankings_table_object["playerType"] = "Batter"
                
            if pitcher == True:
                if k < 8:
                    if (isfloat(rankings_table_td[k].text)):
                        rankings_table_object[table_headers[k]] = float(rankings_table_td[k].text)
                    elif rankings_table_td[k].text == " ":
                        rankings_table_object[table_headers[k]] = 0
                    else:
                        rankings_table_object[table_headers[k]] = rankings_table_td[k].text
                elif k >= (pitcher_start):
                    if (isfloat(rankings_table_td[k].text)):
                        rankings_table_object[table_headers[k]] = float(rankings_table_td[k].text)
                    elif rankings_table_td[k].text == " ":
                        rankings_table_object[table_headers[k]] = 0
                    else:
                        rankings_table_object[table_headers[k]] = rankings_table_td[k].text
                else:
                    k = pitcher_start
            else:
                if k < pitcher_start:
                    if (isfloat(rankings_table_td[k].text)):
                        rankings_table_object[table_headers[k]] = float(rankings_table_td[k].text)
                    elif rankings_table_td[k].text == " ":
                        rankings_table_object[table_headers[k]] = 0
                    else:
                        rankings_table_object[table_headers[k]] = rankings_table_td[k].text
    
        rankings_table_json.append(rankings_table_object)
        
with open('data.json', 'w') as outfile:
    json.dump(rankings_table_json, outfile)
print(rankings_table_json)


# In[ ]:




