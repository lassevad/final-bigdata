import React, { useState, useEffect, Component } from 'react';
import background from "./img/test.jpg";
import './App.css';
import GraphService from './Graph.js';
import GolferService from './Supervised.js'
import MapService from './Map.js';
import Box from '@material-ui/core/Box';
import { Button } from 'react-bootstrap';
import KmeansService from './Unsupervised.js';
const axios = require('axios');

function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${background})`}}>
      <header className="App-header">
        <h1>
          Golfalicious
        </h1>
        <Box class="flexbox-container">
          <GraphService/>
          <MapService/>
        </Box>
        <Box class="flexbox-container">
          <GolferService/>
          <KmeansService/>
        </Box>
      </header>
    </div>
  );

}
export default App;
