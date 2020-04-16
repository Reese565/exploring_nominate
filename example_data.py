#==================#
#=* EXAMPLE DATA *=#
#==================#

# creates examly ple data for scrollies

import pandas as pd
import numpy as np

def nominateExample():
    """Creates YEA/NEA for NOMINARE explanation"""

    l = pd.DataFrame({'vote':["YEA","YEA","NAY","NAY","YEA","NAY"],'pos':-1, 'nom':-.35})
    m = pd.DataFrame({'vote':["NAY","YEA","YEA","NAY","YEA","NAY"],'pos':0, 'nom':0.1})
    c = pd.DataFrame({'vote':["NAY","NAY","YEA","YEA","YEA","NAY"],'pos':1, 'nom':0.45})
    nominate_example = pd.concat([l,m,c], axis = 0).to_json(orient='records')
    
    return nominate_example


def fakeDistirctDist():
    """Creates fake district level NOMINATE data."""
    
    indx = np.arange(0,435)
    district_dist = pd.DataFrame({'index':indx, 'q':indx/435,'row':indx%29,'col':indx//29}).to_json(orient='records')
    
    return district_dist