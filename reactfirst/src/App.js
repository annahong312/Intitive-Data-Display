import './App.css';
import React, { Component } from "react";
import { MultipleSelectChip } from './Components/multiSelectGender.js';

// import * as React from 'react';
var expanded = false;

// function App() {
class App extends Component {

  showCheckboxes = () => {
    var checkboxes = document.getElementById("checkboxes");
    console.log("here")
    if (!expanded) {
      checkboxes.style.display = "block";
      expanded = true;
    } else {
      checkboxes.style.display = "none";
      expanded = false;
    }
  }
  state = {
    value: [],
  };

  onChange = (event) => {
    this.setState({
      value: [...event.target.value],
    });
  };


  // return (
  render() {
    return (
      <div className="App">

        {/* <header className="App-header"> </header> */}
        <div className="background">
          <button type="button">Admin</button>
          <h1>Center for Engineering Diversity Data Display Tool</h1>

          <p>Filter Options</p>
          {MultipleSelectChip()}
          <div className="Checkbox-Background">


           
          </div>
          <button type="button">Generate Data</button>
        </div>


        <div className="background">
          <h1>HELLO</h1>
        </div>
        <div className="background">
          <h1>HELLO 2</h1>
        </div>
      </div>
    );


  }
  // );
}


export default App;
