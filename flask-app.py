import os
import requests
import io

import pandas as pd
import numpy as np

from flask import Flask, render_template


app = Flask(__name__)

APP_FOLDER = os.path.dirname(os.path.realpath(__file__))
# data = pd.read_csv(os.path.join(APP_FOLDER, "static/data.csv"))
# voteview_members = pd.read_csv(io.StringIO(s.decode('utf-8')))

cong_nom_mu = pd.read_csv('static/data/congq_nom_mu.csv')

calif_url = """
https://github.com/JeffreyBLewis/congressional-district-boundaries/raw/master/California_108_to_112.geojson?print=pretty
"""
r = requests.get(calif_url)

sf = None
jeff = None

for dist in r.json()['features']:
    d = dist['properties']['district']
    if d == '12':
        sf = dist
    elif d == '1':
        jeff = dist

dist_geoJSON = {
  "type": "FeatureCollection",
  "features": [sf, jeff]
  }

del r        

district_dist = np.arange(1,436)/435

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getDists')
def getDists():
    # return data.to_json(orient="records")
    return dist_geoJSON

