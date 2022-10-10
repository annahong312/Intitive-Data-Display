import './App.css';
import React, { Component } from "react";
import MultipleSelectGender from './Components/MultipleSelectGender.js';
import MultipleSelectMajor from './Components/MultipleSelectMajor.js';
import GenerateChart from './Components/GenerateChart.js';
import AddGraphButton from './Components/AddGraphButton';

import {useState} from "react"

class App extends Component {

render() {

  var content = (
    <div className="App">
      {/* <header className="App-header"> </header> */}
      <div className="background">
        <button className="mainButton" type="button">Admin</button>
        <h1>Center for Engineering Diversity Data Display Tool</h1>


        <div className="Checkbox-Background">
          <p>Filter Options</p>
          <MultipleSelectGender />
          <MultipleSelectMajor />
        </div>
        <AddGraphButton />
      </div>


      <div className="background">
        <h1>Chart</h1>
        <GenerateChart />
      </div>
      <div className="background">
        <h1>Graph</h1>
      </div>
    </div>
  );
  return content;


}
}


export default App;
