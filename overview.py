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


def filter_party(vvy,party_list):
    """Filters the data by party"""
    
    vvyp = vvy[vvy['party_code'].isin(party_list)]
    
    return vvyp


def select_cols(vvyp,cols):
    """Selects the desired columns"""
    vvypf = vvyp.loc[:,cols]
    
    return vvypf


def fetch_overview_data(p = 0.25):
    """
    Fetches, filters, and cleans Voteview 
    NOMINATE data and returns as JSON string
    
    Args
     - p: sample proportion
    """
    
    vv = voteviewData()
    vvy = add_year(vv)
    vvyp = filter_party(vvy,PARTY_LIST)
    vvypf = select_cols(vvyp,COLS)
    
    # group by year to sample
    vv_session_grp = vvypf.groupby('year')
    
    dfs = []
    for g in vv_session_grp.groups.keys():
        df = vv_session_grp.get_group(g)
        samp_size = int(np.round(df.shape[0]*p))
        samp_df = df.sample(samp_size)
        dfs.append(samp_df)

    vvyps = pd.concat(dfs, axis=0, ignore_index = True)
    vvyps_json = vvyps.to_json(orient = 'records')
    
    return vvyps_json




















