import './App.css';
import React, { Component } from "react";
import MultipleSelectChip from './Components/MultipleSelectChip.js';

class App extends Component {

  render() {

    var content = (
      <div className="App">
        {/* <header className="App-header"> </header> */}
        <div className="background">
          <button type="button">Admin</button>
          <h1>Center for Engineering Diversity Data Display Tool</h1>

          <p>Filter Options</p>
          <div className="Checkbox-Background">
            <MultipleSelectChip/>
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
    return content;


  }
}


export default App;
