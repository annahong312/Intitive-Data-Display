import React, { useState } from "react";
import './App.css';
import GenerateChartMUI from './Components/GenerateChartMUI.js';
import GenerateGraph from './Components/GenerateGraph.js';
import MultipleSelectGender from './Components/MultipleSelectGender.js';
import MultipleSelectMajor from './Components/MultipleSelectMajor.js';
  
var curIndex = -1;
var maxIndex = -1;

// Why did we use 'extends component' in the first place? I changed it to functional component so my hooks work
function App() {

  const [chartList, setChartList] = useState([]);

  const [graphList, setGraphList] = useState([]);
  // build tab list
  const [tabList, setTabList] = useState([]);
  const onAddBtnClickGraph = event => {

    setGraphList(graphList.concat(<GenerateGraph index={curIndex + 1}/>));
    // setChartList(chartList.concat(<DataTable />));
    setChartList(chartList.concat(<GenerateChartMUI index={curIndex + 1}/>));
    curIndex++;
    maxIndex++;
    setTabList(tabList.concat(<button class="tablinks" onclick="">Tab {curIndex+1}</button>));
  };


  return (<div className="App">
    {/* <header className="App-header"> </header> */}
    <div className="background" >
      <button className="mainButton" type="button">Admin</button>
      <h1>Center for Engineering Diversity Data Display Tool</h1>


      <div className="Checkbox-Background">
        <p>Filter Options</p>
        <MultipleSelectGender />
        <MultipleSelectMajor />
      </div>
      <button onClick={onAddBtnClickGraph} className="mainButton" type="button">Generate Data</button>
    </div>

    <div class="tab">
      {tabList}
    </div>

    <div style={{paddingBottom:'300px'}}>
      <h1>Chart</h1>
      {/* <DataTable></DataTable> */}
      {chartList[curIndex]}
    </div>

    
    <div className="background">
      <h1>Graph</h1>
      {graphList[curIndex]}
    </div>
  </div>
  );
}


export default App;