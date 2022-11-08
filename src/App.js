import React, { useState } from "react";
import { useEffect } from "react";
import './App.css';
import GenerateChartMUI from './Components/GenerateChartMUI.js';
import GenerateGraph from './Components/GenerateGraph.js';
// import getUpdatedNameVals from "./Components/MultipleSelect";
import MultipleSelect, {getUpdatedNameVals} from './Components/MultipleSelect.js'
  
var curIndex = -1;
var maxIndex = -1;
var dataCalled = false;

const namesGender = [
  'Male',
  'Female',
  'Non-binary',
];

const namesMajors = [
  'CSCI',
  'BME',
  'CSBA',
  'ME',
  'CECS',
  'CE',
  'EE',
];

// const dropdownLabels = ["Gender", "Major"];

function App() {

  const [chartList, setChartList] = useState([]);

  const [graphList, setGraphList] = useState([]);
  const [currChart, setCurrChart] = useState([]);
  const [dropdownList, setDropdownList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [currFilters, setCurrFilters] = useState([]);
  const [currTabName, setCurrTabName] = useState("");


  const [tabIsActive, setTabIsActive] = useState(0);

  const createMultipleSelect = () => {
    // setDropdownList([]);
    // var newFilterDropdowns = [];
    // for (var i = 0; i < dropdownLabels.length; i++) {
    //   console.log("dropdownLabels[i]: " + dropdownLabels[i]);
    //   var curLabel = dropdownLabels[i];
    //   newFilterDropdowns.push(<MultipleSelect givenNames={namesGender} label={curLabel}/>);
    //   // setFilterList(filterList => [filterList.concat(<MultipleSelect givenNames={namesGender} label={curLabel} />)]);
    // }

    var newFilterDropdown = [<MultipleSelect  givenNames={namesGender} label="Gender" />, <MultipleSelect  givenNames={namesMajors} label="Major" />];
    // console.log(newFilterDropdown);
    setDropdownList(dropdownList.concat(newFilterDropdown));
  };

  useEffect(() => { 
    // call apis to get filter options labels
    if (!dataCalled) {
      createMultipleSelect();
      dataCalled = true;

      // var filters = filterList.map((filter) => {
      //   return filter.props.givenNames;
      // });
      // console.log(filters);

      // var firstFilter = filterList[0];
      // console.log(firstFilter);
  
    }
  });

  // build tab list
  const [tabList, setTabList] = useState([]);
  // let TESTCHART = chartList[0];
  const onAddBtnClickGraph = event => {
    
    // get current filters selected
    // var filters = dropdownList.map((filter) => {
    //   return filter.props.givenNames;
    // });
    // console.log(filters + " filters");

    var vals = getUpdatedNameVals();
    var filterMap = new Map(JSON.parse(
      JSON.stringify(Array.from(vals))));
    console.log(filterMap.get("Gender") + " vals at gender");
    console.log(filterMap.get("Major") + " vals at major");

    


    curIndex++;
    maxIndex++;

    setFilterList(filterList.concat(filterMap));
    console.log(filterList[maxIndex] + " filterList");
    // console.log(filterList.length + " filterList length");
    var newChart = <GenerateChartMUI index={maxIndex }/>;
    var newGraph = <GenerateGraph index={maxIndex }/>;
    setChartList(chartList.concat(newChart));
    setGraphList(graphList.concat(newGraph));
    // print length of chartList
    console.log(chartList.length + " chartList length");
    
    setTabList(tabList.concat(<button className="tablinks" onclick="">Tab {maxIndex+1}</button>));
    setCurrChart(newChart);
    setTabIsActive(curIndex);
    setCurrFilters(filterMap);

    // Update the current tab name
    setCurrTabName("Tab " + (curIndex + 1));

  };

  // make a function for clicking tab event
  const onTabClick = event => {
    // get the index of the tab
    var index = event.target.innerHTML.substring(4);

    // set the index of the tab to be the current index
    curIndex = index - 1;
    console.log(filterList[curIndex] + " filterList on tab switch");
    setCurrChart(chartList[curIndex]);
    setCurrFilters(filterList[curIndex]);
    setTabIsActive(curIndex);

    // Update the current tab name
    setCurrTabName("Tab " + index);
  };

  // make function to delete a tab from the list
  const onDeleteTab = (index) => {
    // get the index of the tab
    // var index = event.target.innerHTML.substring(4);
    // console.log(index + " is delete tab index");
    if (index === 0 && chartList.length === 1) {
      // set chart as empty list
      setChartList([]);
      // set graph as empty list
      setGraphList([]);
      // set tab as empty list
      setTabList([]);
      // set current chart as empty list
      setCurrChart([]);
      // set current filters as empty list
      setCurrFilters([]);
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
      
      // set filter list
      var toRemoveFilter = filterList[index];
      setFilterList(filterList.filter(item => item !== toRemoveFilter));     
      
      if (index === curIndex) {
        curIndex++;
      } 
      maxIndex = chartList.length;

      setCurrChart(chartList[curIndex]);
      setCurrFilters(filterList[curIndex]);
      console.log(filterList[curIndex] + " filterList on delete tab");
    }

    // Update the current tab name
    setCurrTabName("Tab " + curIndex);

  };

  // function for formatting print the filter map out nicely
  const printFilterMap = (filterMap) => {
    var str = "";
    for (var [key, value] of filterMap) {
      str += key + ": " + value + "\n";
    }
    return str;
  };


  return (<div className="App">
    {/* <header className="App-header"> </header> */}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
    <div className="background" >
      <button className="mainButton" type="button">Admin</button>
      <h1>Center for Engineering Diversity Data Display Tool</h1>

      <div className="Checkbox-Background">
        <p>Filter Options</p>
        {/* <MultipleSelectGender /> */}
        {/* <MultipleSelectMajor /> */}
        {/* Todo: Use a loop to walk through and generate each filter */}
        {/* <MultipleSelect  givenNames={namesGender} label="Gender" /> */}
        {/* <MultipleSelect  givenNames={namesMajors} label="Major" /> */}
        {dropdownList}
      </div>
      <button onClick={onAddBtnClickGraph} className="mainButton" type="button">Generate Data</button>
    </div>


    {/* Map out tabs: if the current tab is being mapped, change the highlight*/}
    <div>
      {tabList && tabList.map((tab, index) => (
        <span  style={{paddingRight: 10 }}>
          <button style={{marginRight: 2, backgroundColor: (tabIsActive===index) ? 'white' : ''}} className="tablinks" onClick={onTabClick}>Tab {index+1}</button> 
          <button style={{marginTop: 1 }} className="btn" onClick={() => onDeleteTab(index)}><i className="fa fa-trash"></i></button>
        </span> ))}
    </div>
    <h3>{currTabName}</h3>

    <div style={{paddingBottom:'100px'}}>
      <h1>Filters</h1>
      {/* print filters with printFilterMap */}
      {currFilters && printFilterMap(currFilters)}
      {/* {currFilters} */}
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