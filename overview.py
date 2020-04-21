#===========================#
#=====* Overview Data *=====#
#===========================#

# fetches and filters Voteview NOMINATE data
# converts to JSON document and returns it

import os
import requests
import io
import json

import pandas as pd
import numpy as np

DATA_PATH = './data/'
VOTEVIEW_URL = "https://voteview.com/static/data/out/members/HSall_members.csv"
PARTY_LIST = [100,200] # 100 = Democrat, 200 = Republican
COLS = ['year','congress','party_code','chamber','icpsr','nominate_dim1']
CHAMBERS = ['House','Senate']
YEAR = 1950
    
    

def voteviewData():
    
    ## import ideology data from voteview
    url = VOTEVIEW_URL
    s = requests.get(url).content

    # create StringIO (string input/output) to act as "file" for pandas
    sio = io.StringIO(s.decode('utf-8'))

    # load into pandas dataframe
    vv = pd.read_csv(sio)
    
    return vv


def add_year(vv):
    """
    Adds the year corresponding to each congressional
    session to the voteview datafram (vv)
    """
    
    #import congress-year crosswalk
    data_path = os.path.join(DATA_PATH, 'congress_year.csv')
    cog_year = pd.read_csv(data_path)
    
    # merge
    vvy = vv.merge(cog_year, how = 'inner', on = 'congress')
    
    return vvy


def filter_party(vv,party_list):
    """Filters the data by party"""
    
    vvp = vv[vv['party_code'].isin(party_list)]
    
    return vvp

def filter_chamber(vv,chambers):
    """Filters the data by party"""
    
    vvp = vv[vv['chamber'].isin(chambers)]
    
    return vvp


def filter_state(vv, state = None):
    """Filters by year"""
    if state!=None:
        vvy = vv[vv['state_abbrev'] == state]
        return vvy
    else:
        return vv

def filter_cols(vv,cols):
    """Selects the desired columns"""
    vvf = vv.loc[:,cols]
    
    return vvf

def filter_year(vv, year):
    """Filters by year"""
    
    vvy = vv[vv['year'] >= year]
    
    return vvy

def drop_missing(vv,col):
    """Selects the desired columns"""
    vvf = vv[~vv[col].isnull()]
    
    return vvf

def add_party_mean(vv):
    """Adds the party mean nominate score for each year to the datafram"""
    
    party_mu = vv.groupby(['year','party_code'], as_index = False).agg({'nominate_dim1':np.mean})
    party_mu.rename({'nominate_dim1':'party_mu'}, axis = 1, inplace = True)

    vvm = vv.merge(party_mu, how = 'inner', on = ['year','party_code'])
    
    return vvm


def fetch_overview_data(state = None,p = 0.25):
    """
    Fetches, filters, and cleans Voteview 
    NOMINATE data and returns as JSON string
    
    Args
     - p: sample proportion
    """

    if state != None:
        p = 1.0
    
    vv = voteviewData()
    vv = add_year(vv)
    vv = filter_party(vv,PARTY_LIST)
    vv = filter_chamber(vv,CHAMBERS)
    vv = filter_state(vv, state)
    vv = filter_cols(vv,COLS)
    vv = filter_year(vv, YEAR)
    vv = drop_missing(vv,'nominate_dim1')
    vv = add_party_mean(vv)
    
    
    # group by year to sample
    vv_session_grp = vv.groupby('year')
    
    dfs = []
    for g in vv_session_grp.groups.keys():
        df = vv_session_grp.get_group(g)
        samp_size = int(np.round(df.shape[0]*p))
        samp_df = df.sample(samp_size)
        dfs.append(samp_df)

    vvs = pd.concat(dfs, axis=0, ignore_index = True)
    vvs_json = vvs.to_json(orient = 'records')
    
    return vvs_json































