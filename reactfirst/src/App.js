import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import * as ReactDOM from "react-dom";
import { MultiSelect } from "@progress/kendo-react-dropdowns";

var 
expanded = false;

const sports = [
  "Baseball",
  "Basketball",
  "Cricket",
  "Field Hockey",
  "Football",
  "Table Tennis",
  "Tennis",
  "Volleyball",
];

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
        <header className="App-header">
          <div className="background">
          <button type="button">Admin</button>
            <h1>Center for Engineering Diversity Data Display Tool</h1>

            <p>Filter Options</p>
            <div className="Checkbox-Background">
              {/* https://stackoverflow.com/questions/17714705/how-to-use-checkbox-inside-select-option */}
              {/* <form padding="100px">
                <div class="multiselect">
                  <div class="selectBox" onClick={this.showCheckboxes}>
                    <select>
                      <option>Select an option</option>
                    </select>
                    <div class="overSelect"></div>
                  </div>
                  <div id="checkboxes">
                    <label htmlFor="one">
                      <input type="checkbox" id="woman" />woman</label>
                    <label htmlFor="two">
                      <input type="checkbox" id="nonbinary" />non binary</label>
                    <label htmlFor="three">
                      <input type="checkbox" id="man" />men...</label>
                  </div>
                </div>
              </form> */}
              <div>
                <div>Favorite sports:</div>
                <MultiSelect
                  data={sports}
                  onChange={this.onChange}
                  value={this.state.value}
                />
              </div>
            
            
            <label for="major">Choose a major:</label>
            <select id="major">
              <option value="a">a</option>
              <option value="b">b</option>
              <option value="c">c</option>
            </select>
            </div>
            <button type="button">Generate Data</button>
          </div>

          
          {/* <div> */}

          {/* </div> */}


          <div className="background">
            <h1>HELLO</h1>
          </div>
          <div className="background">
            <h1>HELLO 2</h1>
          </div>
        </header>
      </div>
    );

    
    }
  // );
}


export default App;
