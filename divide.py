#=======================#
#=* W209 FLASK SERVER *=#
#=======================#

# flask app server to run w209 final project

#+++++++++++++++++++++++++++++++++++++++++++++++++++#
#                                                   #
# code to run flask app from terminal:              #
#         'env FLASK_APP=flask-app.py flask run'    #
#                                                   #
#+++++++++++++++++++++++++++++++++++++++++++++++++++#

import os
import requests
import io
import json

import pandas as pd
import numpy as np

from overview import fetch_overview_data
from example_data import nominateExample, fakeDistirctDist

from flask import Flask, render_template


#// APP DEPENDENCIES //#

# nominate example date for main page
nominate_example = nominateExample()

# fake district distribution data
district_dist = fakeDistirctDist()

# fetch overview data
ovData = fetch_overview_data()



#// FLASK APP //#

app = Flask(__name__)
APP_FOLDER = os.path.dirname(os.path.realpath(__file__))

@app.route('/')
def index():
    return render_template('main.html')


#// PAGE PATHS

@app.route('/urban-rural-divide/')
def urbanRuralPath():
    return render_template('urban-rural.html')

@app.route('/member-drift/')
def memberPath():
    return render_template('member.html')

@app.route('/topic-divide/')
def topicPath():
    return render_template('topic.html')


#// DATA PATHS

@app.route('/getData')
def getData():
    # return data.to_json(orient="records")
    return district_dist

@app.route('/getNom')
def getNom():
    # return data.to_json(orient="records")
    return nominate_example

@app.route('/getOv')
def getOv():
    # return data.to_json(orient="records")
    return ovData


#===============* Saved Code *===============#

# @app.route('/about/')
# def aboutPath():
#     return render_template('about.html')


# calif_url = """
# https://github.com/JeffreyBLewis/congressional-district-boundaries/raw/master/California_108_to_112.geojson?print=pretty
# """
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

