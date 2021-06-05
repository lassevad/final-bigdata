import React from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const API_ROUTE = "http://localhost:5000"

class GolferService extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            supColumns: null,
            supColItems: null,
            selectedSupCol: null,
            binInput: null,
            disp_image: null,
            report: null,
            precision: null,
            recall: null,
            f1: null,
            accuracy: null,
            newInput: null,
            selectedSupColName: null,
            ynew: null
        }
        this.getSupColumns = this.getSupColumns.bind(this)
        this.getAccuracy = this.getAccuracy.bind(this)
        this.getYnew= this.getYnew.bind(this)
        this.setBin = this.setBin.bind(this)
        this.setNew = this.setNew.bind(this)
        this.setSupColumn = this.setSupColumn.bind(this)
        this.sendNewInfo = this.sendNewInfo.bind(this)
        this.uploadSupCol = this.uploadSupCol.bind(this)
        this.uploadBins = this.uploadBins.bind(this)
        this.uploadNew = this.uploadNew.bind(this)
        this.changeDispImage = this.changeDispImage.bind(this)
        this.generateGraph = this.generateGraph.bind(this)
        this.fillSupColumns = this.fillSupColumns.bind(this)
        this.sendGraphInfo = this.sendGraphInfo.bind(this)
    }

    setSupColumn(e) {
        console.log(e.target.value)
        this.setState({
            selectedSupCol: e.target.value,
            selectedSupColName: this.state.supColumns[e.target.value]
        })
    }

    setBin(e) {  
        this.setState({
            binInput: e.target.value
        });  
        console.log(this.state.binInput)  
    }

    setNew(e) {  
        this.setState({
            newInput: e.target.value
        });  
        console.log(this.state.newInput)  
    }

    getSupColumns() {
        return axios.get(API_ROUTE + "/supcolumns")
            .then(response => {
                console.log(response.data)
                this.setState({
                    supColumns: response.data
                })
            })
    }

    getAccuracy() {
        return axios.get(API_ROUTE + "/accuracy")
            .then(response => {
                console.log(response.data)
                this.setState({
                    accuracy: response.data
                })
            })
    }

    getPrecision() {
        return axios.get(API_ROUTE + "/precision")
            .then(response => {
                console.log(response.data)
                this.setState({
                    precision: response.data
                })
            })
    }

    getRecall() {
        return axios.get(API_ROUTE + "/recall")
            .then(response => {
                console.log(response.data)
                this.setState({
                    recall: response.data
                })
            })
    }

    getF1() {
        return axios.get(API_ROUTE + "/f1")
            .then(response => {
                console.log(response.data)
                this.setState({
                    f1: response.data
                })
            })
    }

    getYnew() {
        return axios.get(API_ROUTE + "/ynew")
            .then(response => {
                console.log(response.data)
                this.setState({
                    ynew: response.data
                })
            })
    }

    fillSupColumns() {
        let cols = this.state.supColumns;
        let menuItems = cols.map((index, value) =>
            <MenuItem value={value} key={index}>{index}</MenuItem>
        );
        this.setState({
            supColItems: menuItems
        })
    }

    uploadSupCol() {
        return axios.post(API_ROUTE + '/uploadSupCol', {
            data: {
                col: this.state.selectedSupCol
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    uploadBins() {
        return axios.post(API_ROUTE + '/uploadSupBins', {
            data: {
                bins: this.state.binInput
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    uploadNew() {
        return axios.post(API_ROUTE + '/uploadNew', {
            data: {
                new: this.state.newInput
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    changeDispImage(newImage) {
        this.setState({
            disp_image: newImage
        });
    }

    generateGraph() {
        return axios.get(API_ROUTE + "/generateSupGraph", { responseType: 'arraybuffer' })
            .then(response => {
                console.log(response)
                var blob = new Blob(
                    [response.data],
                    { type: response.headers['content-type'] }
                )

                var image = URL.createObjectURL(blob)
                console.log(image)

                this.changeDispImage(image)
                console.log(this.state.disp_image)
                return image
            });
    }

    async sendGraphInfo() {
        await this.uploadSupCol()
        await this.uploadBins()
        await this.generateGraph()
        this.getAccuracy()
    } 

    async sendNewInfo(){
        await this.uploadNew()
        this.getYnew()
    }

    async componentDidMount() {
        await this.getSupColumns()
        this.fillSupColumns()
    }

    render() {
        return (
            <div class="graph" className="supBack">
                <h4>
                    Supervised ML!
                </h4>
                <InputLabel>Attribute to predict</InputLabel>
                <Select
                    onChange={this.setSupColumn}>
                    {this.state.supColItems}
                </Select>
                <InputLabel>Bins</InputLabel>
                <TextField id="standard-basic" value={this.state.binInput} onChange={this.setBin}/>

                <div class="file-field input-field">
                    <Box display="flex" alignSelf="flex-end" justifyContent="center" className="upl">
                        <a class="waves-effect waves-light btn" onClick={this.sendGraphInfo}>Classify</a>
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <img src={this.state.disp_image} onChange={this.changeDispImage} id="graph-upload" className="ImageSize" />
                    </Box>
                </div>
                <div>
                    <Box component="div" display="inline" className="Acc">Accuracy: {this.state.accuracy}</Box>
                </div>
                <h5>
                    Test with your own statistics!
                </h5>
                <TextField id="standard-basic" value={this.state.newInput} onChange={this.setNew} className="new"/>
                <div class="file-field input-field" >
                    <Box display="flex" alignSelf="flex-end" justifyContent="center" className="upl">
                        <a class="waves-effect waves-light btn" onClick={this.sendNewInfo} >Check {this.state.selectedSupColName} based on given statistics</a>
                    </Box>
                </div>
                <div>
                    <Box component="div" display="inline">Your {this.state.selectedSupColName} is in the following bin: {this.state.ynew}</Box>
                </div>
            </div>
        );
    }




}


export default GolferService;