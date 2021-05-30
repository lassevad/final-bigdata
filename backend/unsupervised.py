import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import sklearn
from sklearn.cluster import KMeans
from sklearn.preprocessing import scale, MinMaxScaler
import seaborn as sns

df = pd.read_csv("cleanPGA.csv")
del df["Player Name"]


def unsupervise(X, Y, K):

    df1 = df[:-2000]
    global x
    X_ = df1.columns.get_loc(X)
    Y_ = df1.columns.get_loc(Y)
    x = df1.iloc[:, [X_, Y_]].values
    global kmeans
    kmeans = KMeans(n_clusters=K)
    global y_kmeans
    y_kmeans = kmeans.fit_predict(x)


def kplot():
    return sns.scatterplot(x[:, 0], x[:, 1], c=y_kmeans, palette='bright', hue=y_kmeans)


def pred(predInput):
    pred = kmeans.predict([predInput])
    print(pred)
    return pred
