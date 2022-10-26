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
  const [currChart, setCurrChart] = useState([]);
  // build tab list
  const [tabList, setTabList] = useState([]);
  // let TESTCHART = chartList[0];
  const onAddBtnClickGraph = event => {
    // if (curIndex < maxIndex) {
    //   curIndex = maxIndex;
    // }
    curIndex++;
    maxIndex++;

    // setChartList(chartList.concat(<DataTable />));
    var newChart = <GenerateChartMUI index={maxIndex }/>;
    var newGraph = <GenerateGraph index={maxIndex }/>;
    setChartList(chartList.concat(newChart));
    setGraphList(graphList.concat(newGraph));
    // console.log(newGraph + " new graph");
    
    setTabList(tabList.concat(<button className="tablinks" onclick="">Tab {maxIndex+1}</button>));
    // console.log(chartList + " is chartList");
    // console.log(maxIndex + " is maxIndex");
    setCurrChart(newChart);
    // console.log(currChart);
  };

  // make a function for clicking tab event
  const onTabClick = event => {
    // get the index of the tab
    var index = event.target.innerHTML.substring(4);
    // console.log(index + " is tab index");
    // set the index of the tab to be the current index
    curIndex = index - 1;
    setCurrChart(chartList[curIndex]);
   
    // set the graph list to be the graph list at the index
    // setGraphList(graphList[curIndex]);
    // set the chart list to be the chart list at the index
    // setChartList(chartList[curIndex]);

  };

  // make function to delete a tab from the list
  const onDeleteTab = (index) => {
    // get the index of the tab
    // var index = event.target.innerHTML.substring(4);
    console.log(index + " is delete tab index");
    if (index === 0 && chartList.length === 1) {
      // set chart as empty list
      setChartList([]);
      // set graph as empty list
      setGraphList([]);
      // set tab as empty list
      setTabList([]);
      // set current chart as empty list
      setCurrChart([]);
      // set current index as -1
      curIndex = -1;
      // set max index as -1
      maxIndex = -1;

    } else {
      // remove the tab from the tab list
      var toRemove = tabList[index];
      setTabList(tabList.filter(item => item !== toRemove));
      // tabList.splice(index, 1);
      // remove the chart from the chart list
      var toRemoveChart = chartList[index];
      setChartList(chartList.filter(item => item !== toRemoveChart));
      // remove the graph from the graph list
      var toRemoveGraph = graphList[index];
      setGraphList(graphList.filter(item => item !== toRemoveGraph));
      // graphList.splice(index, 1);
      
      if (index === curIndex) {
        curIndex++;
      } 

      // console.log(curIndex + " is curIndex");
      maxIndex = chartList.length;
      // console.log(maxIndex + " is maxIndex");
      // console.log(chartList[curIndex] + " is chartList[curIndex]");

      setCurrChart(chartList[curIndex]);
    }

  };

  // function tabSelector() {
  //   return curIndex;
  // }


  return (<div className="App">
    {/* <header className="App-header"> </header> */}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
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

    <div className="tab">
      {tabList && tabList.map((tab, index) => (
        <div>
          <button className="tablinks" onClick={onTabClick}>Tab {index+1}</button> 
          <button class="btn" onClick={() => onDeleteTab(index)}><i class="fa fa-trash"></i></button>
          </div>)
      )}
      {/* {tabList && tabList.map((tab, index) => (
        <i class="material-icons">delete</i>)
      )} */}
    </div>

    <div style={{paddingBottom:'300px'}}>
      <h1>Chart</h1>
      {/* {chartList[curIndex]} */}
      {/* {chartList[tabSelector()]} */}
      {currChart}
    </div>

    
    <div className="background">
      <h1>Graph</h1>
      {graphList[curIndex]}
    </div>
  </div>
  );
}


export default App;