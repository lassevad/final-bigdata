import subprocess
from flask import Flask, request, send_file
from flask_cors import CORS, cross_origin
from flask import jsonify
import os
import json
import matplotlib
import pandas as pd
import os.path
from framework import *
from supervised import *
from unsupervised import *
import geoplot as gplt
import geopandas as gpd


import seaborn as sns
import matplotlib.pyplot as plt
from matplotlib import pyplot
matplotlib.use('Agg')

df = pd.read_csv("dataset.csv")

#gdf = gpd.read_file("geodataset.csv", GEOM_POSSIBLE_NAMES="geometry", KEEP_GEOM_COLUMNS="NO")

#gdf.crs = 'epsg:4326'

#from shapely import wkt

#df1['geometry'] = df1['geometry'].apply(wkt.loads)
#gdf = gpd.GeoDataFrame(df1, crs='epsg:4326')
# print(gdf.head())

with open('strategies.json') as f:
    strategies = json.load(f)

with open('maps.json') as f:
    maps = json.load(f)

with open('cmaps.json') as f:
    cmaps = json.load(f)

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/uploadStrategy', methods=['POST'])
@cross_origin()
def upload_strategy():
    global strategy
    strategy_id = int(request.json["data"]["strategy"]) - 1
    print("strategy = " + strategies["strategies"][strategy_id]["value"])
    strategy = strategies["strategies"][strategy_id]["value"]
    return "Strategy recieved"


@app.route('/uploadMap', methods=['POST'])
@cross_origin()
def upload_map():
    global _map
    print(request.json)
    map_id = int(request.json["data"]["map"]) - 1
    print("map = " + maps["maps"][map_id]["value"])
    _map = maps["maps"][map_id]["value"]
    return "map recieved"


@app.route('/uploadColorMap', methods=['POST'])
@cross_origin()
def upload_cmap():
    global cmap
    cmap_id = int(request.json["data"]["cmap"]) - 1
    print("cmap = " + cmaps["cmaps"][cmap_id]["value"])
    cmap = cmaps["cmaps"][cmap_id]["value"]
    return "cmap recieved"


@app.route('/uploadCol1', methods=['POST'])
@cross_origin()
def upload_col1():
    global col1
    print(columns)
    col1 = columns[int(request.json["data"]["col1"])]
    print("col1 = " + col1)
    return "col1 recieved"


@app.route('/uploadCol2', methods=['POST'])
@cross_origin()
def upload_col2():
    global col2
    print(columns)
    col2 = columns[int(request.json["data"]["col2"])]
    print("col2 = " + col2)
    return "col2 recieved"


@app.route('/uploadHue', methods=['POST'])
@cross_origin()
def upload_hue():
    global hue
    print(columns)

    hue = columns[int(request.json["data"]["hue"])]

    print("hue: " + hue)
    return "hue recieved"


@app.route('/uploadGeoHue', methods=['POST'])
@cross_origin()
def upload_geohue():
    global geohue
    print(geocolumns)

    geohue = geocolumns[int(request.json["data"]["geohue"])]

    print("geohue: " + geohue)
    return "geohue recieved"


@app.route('/uploadXCol', methods=['POST'])
@cross_origin()
def upload_Xcol():
    global Xcol
    print("Xcol = " + str(request.json["data"]["X"]))
    Xcol = supcolumns[int(request.json["data"]["X"])]
    print("Xcol = " + Xcol)
    return "Xcol recieved"


@app.route('/uploadYCol', methods=['POST'])
@cross_origin()
def upload_Ycol():
    global Ycol
    print("Ycol = " + str(request.json["data"]["Y"]))
    Ycol = supcolumns[int(request.json["data"]["Y"])]
    print("Ycol = " + Ycol)
    return "Ycol recieved"


@app.route('/uploadK', methods=['POST'])
@cross_origin()
def upload_k():
    global K
    print(request.json["data"]["K"])
    K_asString = request.json["data"]["K"]
    K = int(K_asString)
    print("K = " + str(K))
    return "K recieved"


@ app.route('/generateKmeansGraph', methods=['GET'])
def generate_K_graph():
    unsupervise(Xcol, Ycol, K)

    fig = kplot()
    filename = "k.png"
    try:
        os.remove(filename)
    except OSError:
        pass

    fig.figure.savefig("k.png")

    return send_file('k.png', mimetype='image/gif')


@app.route('/', methods=['GET'])
def home():
    return "Service connected"


@ app.route('/csv', methods=['POST'])
@ cross_origin()
def upload_csv():
    global df
    global columns
    print(request.data)
    with open("dataset.csv", "wb") as file:
        file.write(request.data)
        file.close
    df = pd.read_csv("dataset.csv")
    columns = list(df.columns)
    print(columns)
    return "csv recieved"


@ app.route('/geocsv', methods=['POST'])
@ cross_origin()
def upload_geocsv():
    global gdf
    global geocolumns
    print(request.data)
    with open("geodataset.csv", "wb") as file:
        file.write(request.data)
        file.close
    gdf = gpd.read_file(
        "geodataset.csv", GEOM_POSSIBLE_NAMES="geometry", KEEP_GEOM_COLUMNS="NO")
    df_ = pd.read_csv("geodataset.csv")
    geocolumns = list(df_.columns)
    print(geocolumns)
    return "geocsv recieved"

# SUPERVISED


@app.route('/uploadSupCol', methods=['POST'])
@cross_origin()
def upload_supcol():
    global supcol
    print("Supcol = " + str(request.json["data"]["col"]))
    supcol = supcolumns[int(request.json["data"]["col"])]
    print("supcol = " + supcol)
    return "supcol recieved"


@app.route('/uploadSupBins', methods=['POST'])
@cross_origin()
def upload_supbins():
    global supbins
    print(request.json["data"]["bins"])
    supbins_asString = request.json["data"]["bins"]
    li = list(supbins_asString.split(" "))

    for i in range(0, len(li)):
        li[i] = float(li[i])

    print(li)
    supbins = li
    print("supbins = " + str(supbins))
    return "supbins recieved"


@app.route('/uploadPred', methods=['POST'])
@cross_origin()
def upload_pred():
    global predInput
    print(request.json["data"]["pred"])
    pred_asString = request.json["data"]["pred"]
    li = list(pred_asString.split(" "))

    for i in range(0, len(li)):
        li[i] = float(li[i])

    print(li)
    predInput = li
    global predOutput
    predOutput = pred(predInput).tolist()
    print("pred = " + str(predInput))
    return "pred recieved"


@app.route('/uploadNew', methods=['POST'])
@cross_origin()
def upload_new():
    global newInput
    newInput_asString = request.json["data"]["new"]
    li = list(newInput_asString.split(" "))

    for i in range(0, len(li)):
        li[i] = float(li[i])

    newInput = li
    global ynew
    ynew = new(newInput).tolist()

    print("newValues = " + str(li))
    return "newvals recieved"


def upload_supcolumns():
    global supdf
    global supcolumns
    supdf = pd.read_csv("cleanPGA.csv")
    del supdf["Player Name"]
    supcolumns = list(supdf.columns)
    print(supcolumns)
    return "supcsv"


@ app.route('/generateSupGraph', methods=['GET'])
def generate_sup_graph():
    print(supbins)
    supervise(supcol, supbins)
    global report
    global accuracy
    global precision
    global recall
    global f1
    report = report()
    accuracy = accuracy()
    precision = precision()
    recall = recall()
    f1 = f1()
    fig = supplot(supcol)
    filename = "sup.png"
    try:
        os.remove(filename)
    except OSError:
        pass

    fig.figure.savefig("sup.png")

    return send_file('sup.png', mimetype='image/gif')

# S


@ app.route('/generateGraph', methods=['GET'])
def generate_graph():
    print(eval(strategy))
    con = Context(eval(strategy), df)

    fig = con.plot(col1, col2, hue)

    filename = "graph.png"
    try:
        os.remove(filename)
    except OSError:
        pass

    fig.figure.savefig("graph.png")

    return send_file('graph.png', mimetype='image/gif')


@ app.route('/generateMap', methods=['GET'])
def generate_map():
    print(eval(_map))
    geocon = MapContext(eval(_map), gdf)

    geofig = geocon.geoPlot(geohue, cmap)

    filename = "map.png"
    try:
        os.remove(filename)
    except OSError:
        pass

    geofig.figure.savefig("map.png")

    return send_file('map.png', mimetype='image/gif')


@ app.route('/strategies', methods=['GET'])
def api_all_1():
    return jsonify(strategies)


@ app.route('/maps', methods=['GET'])
def get_maps():
    return jsonify(maps)


@ app.route('/columns', methods=['GET'])
def api_all_2():
    upload_supcolumns()
    return jsonify(columns)


@ app.route('/supcolumns', methods=['GET'])
def get_supcolumns():
    upload_supcolumns()
    return jsonify(supcolumns)


@ app.route('/report', methods=['GET'])
def get_report():
    return jsonify(report)


@ app.route('/accuracy', methods=['GET'])
def get_accuracy():
    return jsonify(accuracy)


@ app.route('/f1', methods=['GET'])
def get_f1():
    return jsonify(f1)


@ app.route('/recall', methods=['GET'])
def get_recall():
    return jsonify(recall)


@ app.route('/precision', methods=['GET'])
def get_precision():
    return jsonify(precision)


@ app.route('/ynew', methods=['GET'])
def get_ynew():
    return jsonify(ynew)


@ app.route('/pred', methods=['GET'])
def get_pred():
    return jsonify(predOutput)


@ app.route('/geocolumns', methods=['GET'])
def get_geocolumns():
    return jsonify(geocolumns)


@ app.route('/colormaps', methods=['GET'])
def get_cmaps():
    return jsonify(cmaps)


app.run()
