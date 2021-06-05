import pandas as pd
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
import matplotlib as plt

df = pd.read_csv("cleanPGA.csv")
del df["Points"]
del df["Money"]
del df["Player Name"]


def supervise(col, b):
    bins = b
    global group_names
    group_names = []
    for i in range(len(bins)-1):
        a = str(bins[i])
        b = str(bins[i+1])
        group_names.append(a + ' to ' + b)
    print(group_names)
    df[col] = pd.cut(df[col], bins=bins, labels=group_names)
    label_tops = LabelEncoder()
    df[col] = label_tops.fit_transform(df[col])
    X = df.drop(col, axis=1)
    y = df[col]

    # Split into test and training sets
    global y_test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42)

    global sc
    sc = StandardScaler()
    X_train = sc.fit_transform(X_train)
    X_test = sc.transform(X_test)

    global rfc
    rfc = RandomForestClassifier(n_estimators=200)
    rfc.fit(X_train, y_train)
    global pred_rfc
    pred_rfc = rfc.predict(X_test)

    print(classification_report(y_test, pred_rfc))


def report():
    return classification_report(y_test, pred_rfc)


def accuracy():
    return accuracy_score(y_test, pred_rfc)


def precision():
    return precision_score(y_test, pred_rfc, average='micro')


def recall():
    return recall_score(y_test, pred_rfc, average='micro')


def f1():
    return f1_score(y_test, pred_rfc, average='micro')


def supplot(col):
    ax = sns.countplot(df[col])
    ax.set_xticklabels(group_names)
    return ax


def new(vals):
    Xnew = [vals]
    Xnew = sc.transform(Xnew)
    ynew = rfc.predict(Xnew)
    print("ynew = " + str(ynew))
    return ynew


def gn():
    print(group_names)
    return group_names
