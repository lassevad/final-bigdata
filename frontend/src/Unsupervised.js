import React from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const API_ROUTE = "http://localhost:5000"

class KmeansService extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            disp_image: null,
            kInput: null,
            supColumns: null,
            supColItems: null,
            selectedXCol: null,
            selectedYCol: null,
            predInput: null,
            predOutput: null
        }
        this.setK = this.setK.bind(this)
        this.setPred = this.setPred.bind(this)
        this.setXColumn = this.setXColumn.bind(this)
        this.setYColumn = this.setYColumn.bind(this)
        this.getSupColumns = this.getSupColumns.bind(this)
        this.fillSupColumns = this.fillSupColumns.bind(this)
        this.generateGraph = this.generateGraph.bind(this)
        this.changeDispImage = this.changeDispImage.bind(this)
        this.sendKmeansInfo = this.sendKmeansInfo.bind(this)
        this.getPred = this.getPred.bind(this)
        this.sendPredInfo = this.sendPredInfo.bind(this)

    }

    setK(e) {  
        this.setState({
            kInput: e.target.value
        });  
        console.log(this.state.kInput)  
    }

    setPred(e) {  
        this.setState({
            predInput: e.target.value
        });  
        console.log(this.state.predInput)  
    }

    setXColumn(e) {
        console.log(e.target.value)
        this.setState({
            selectedXCol: e.target.value,
        })
    }

    setYColumn(e) {
        console.log(e.target.value)
        this.setState({
            selectedYCol: e.target.value,
        })
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

    getPred() {
        return axios.get(API_ROUTE + "/pred")
            .then(response => {
                console.log(response.data)
                this.setState({
                    predOutput: response.data
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


    generateGraph() {
        return axios.get(API_ROUTE + "/generateKmeansGraph", { responseType: 'arraybuffer' })
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

    changeDispImage(newImage) {
        this.setState({
            disp_image: newImage
        });
    }

    uploadXCol(){
        return axios.post(API_ROUTE + '/uploadXCol', {
            data: {
                X: this.state.selectedXCol
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

    uploadYCol(){
        return axios.post(API_ROUTE + '/uploadYCol', {
            data: {
                Y: this.state.selectedYCol
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

    uploadK(){
        return axios.post(API_ROUTE + '/uploadK', {
            data: {
                K: this.state.kInput
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

    uploadPred(){
        return axios.post(API_ROUTE + '/uploadPred', {
            data: {
                pred: this.state.predInput
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

    async sendKmeansInfo() {
        await this.uploadXCol()
        await this.uploadYCol()
        await this.uploadK()
        await this.generateGraph()
    } 

    async sendPredInfo(){
        await this.uploadPred()
        this.getPred()
    }



    async componentDidMount() {
        await this.getSupColumns()
        await this.fillSupColumns()
    }

    render() {
        return (
            <div class="graph">
                <h4>
                    Do unsupervised ML (Kmeans)!
                </h4>
                <InputLabel>X Column</InputLabel>
                <Select
                    onChange={this.setXColumn}>
                    {this.state.supColItems}
                </Select>
                <InputLabel>Y Column</InputLabel>
                <Select
                    onChange={this.setYColumn}>
                    {this.state.supColItems}
                </Select>
                <InputLabel>K: Number of clusters</InputLabel>
                <TextField id="standard-basic" value={this.state.kInput} onChange={this.setK} className="k"/>

                <div class="file-field input-field">
                    <Box display="flex" alignSelf="flex-end" justifyContent="center" className="upl">
                        <a class="waves-effect waves-light btn" onClick={this.sendKmeansInfo}>Do K-means</a>
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <img src={this.state.disp_image} onChange={this.changeDispImage} id="graph-upload" className="ImageSize" />
                    </Box>
                </div>
                <h5>
                    Which cluster are you in?
                </h5>
                <InputLabel>Input your own column values:</InputLabel>
                <TextField id="standard-basic" value={this.state.predInput} onChange={this.setPred} className="predk"/>
                <Box display="flex" alignSelf="flex-end" justifyContent="center" className="upl">
                        <a class="waves-effect waves-light btn" onClick={this.sendPredInfo}>Predict cluster</a>
                    </Box>
                <h6>
                    You are in cluster number: {this.state.predOutput}
                </h6>
            </div>
        );
    }




}


export default KmeansService;