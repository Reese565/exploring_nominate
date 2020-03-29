import os
import requests
import io
import json

import pandas as pd
import numpy as np

from flask import Flask, render_template

# code to run flask app from terminal: env FLASK_APP=flask-app.py flask run

app = Flask(__name__)

APP_FOLDER = os.path.dirname(os.path.realpath(__file__))

# data = pd.read_csv(os.path.join(APP_FOLDER, "static/data.csv"))
# voteview_members = pd.read_csv(io.StringIO(s.decode('utf-8')))

cong_nom_mu = pd.read_csv('static/data/congq_nom_mu.csv')

calif_url = """
https://github.com/JeffreyBLewis/congressional-district-boundaries/raw/master/California_108_to_112.geojson?print=pretty
"""
# r = requests.get(calif_url)

# sf = None
# jeff = None

# for dist in r.json()['features']:
#     d = dist['properties']['district']
#     if d == '12':
#         sf = dist
#     elif d == '1':
#         jeff = dist

# dist_geoJSON = {
#   "type": "FeatureCollection",
#   "features": [sf, jeff]
#   }

# del r        

indx = np.arange(0,435)
district_dist = pd.DataFrame({'index':indx, 'q':indx/435,'row':indx%29,'col':indx//29}).to_json(orient='records')

nom = pd.Series(np.arange(-1, 1, .01)).to_json()

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/urban-rural-divide/')
def urbanRuralPath():
    return render_template('urban-rural.html')

@app.route('/member-drift/')
def memberPath():
    return render_template('member.html')

@app.route('/topic-divide/')
def topicPath():
    return render_template('topic.html')

# @app.route('/about/')
# def aboutPath():
#     return render_template('about.html')

@app.route('/getData')
def getData():
    # return data.to_json(orient="records")
    return district_dist

@app.route('/getNom')
def getNom():
    # return data.to_json(orient="records")
    return nom

