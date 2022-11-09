import React, { useState } from "react";
import { useEffect } from "react";
import './App.css';
import GenerateChartMUI from './Components/GenerateChartMUI.js';
import GenerateGraph from './Components/GenerateGraph.js';
// import getUpdatedNameVals from "./Components/MultipleSelect";
import MultipleSelect, {getUpdatedNameVals} from './Components/MultipleSelect.js'
import { useGoogleLogin } from '@react-oauth/google';
import { GetAttributes, GetData } from './Scripts'
import { gapi } from 'gapi-script';

  
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

gapi.load('client:auth2', initClient);
function initClient() {
  gapi.client.init( {
    discoveryDocs: ["https://script.googleapis.com/$discovery/rest?version=v1"],
  });
}

function App() {
  const [filters2, setFilters] = useState({});
  const [data, setData] = useState({});

  const [chartList, setChartList] = useState([]);

  const [graphList, setGraphList] = useState([]);
  const [currChart, setCurrChart] = useState([]);
  const [dropdownList, setDropdownList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [currFilters, setCurrFilters] = useState([]);


  const [tabIsActive, setTabIsActive] = useState(0);

  const onResponse = () => {

    createMultipleSelect();
  }

  const onSuccess = tokenResponse => {
    console.log(tokenResponse);
    gapi.client.setToken({
      access_token: tokenResponse.access_token
    })
    // GetAttributes(setFilters);
    GetAttributes(createMultipleSelect);
    GetData(JSON.stringify({
      filters: "1",
      splitColumn: "Ethnicity"
    }), setData);
  }

  const login = useGoogleLogin({
    onSuccess: onSuccess,
    onResponse: onResponse,
    flow: "implicit",
    scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/script.scriptapp",
  });

  const createMultipleSelect = (filters) => {
    // setDropdownList([]);
    var newFilterDropdowns = [];
    // for (var i = 0; i < dropdownLabels.length; i++) {
    //   console.log("dropdownLabels[i]: " + dropdownLabels[i]);
    //   var curLabel = dropdownLabels[i];
    //   newFilterDropdowns.push(<MultipleSelect givenNames={namesGender} label={curLabel}/>);
    //   // setFilterList(filterList => [filterList.concat(<MultipleSelect givenNames={namesGender} label={curLabel} />)]);
    // }

    // console.log("filters2: " + filters2.length);


    // console.log(filters2, data);
    // var dropdownLabels = JSON.parse(filters2.data.attributes);
    
    var dropdownLabels = filters.data.attributes;

    console.log("dropdownLabels: " + dropdownLabels);
    
    // var newFilterDropdowns = [];
    // for (var i = 0; i < dropdownLabels.keys; i++) {
    //   console.log("dropdownLabels[i]: " + dropdownLabels.get(i));
    // }
    var newFilterDropdowns = Object.keys(dropdownLabels).map((filter) => {
      console.log(filter);
      return <MultipleSelect givenNames={Object.keys(dropdownLabels[filter])} label={filter} />
      // <MultipleSelect givenNames={filter.options} label={filter.name} />
    });

    // var newFilterDropdowns = [<MultipleSelect  givenNames={namesGender} label="Gender" />, <MultipleSelect  givenNames={namesMajors} label="Major" />];
    // console.log(newFilterDropdowns);
    setDropdownList(dropdownList.concat(newFilterDropdowns));
  };

  useEffect(() => { 
    // call apis to get filter options labels
    if (!dataCalled) {
      // createMultipleSelect();
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

    // console.log("filters2: " + JSON.stringify(filters2.data.attributes));
    // get current filters selected
    // var filters = dropdownList.map((filter) => {
    //   return filter.props.givenNames;
    // });
    // console.log(filters + " filters");

    // TODO: we will need to check for duplicate names 
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
    // console.log(chartList.length + " chartList length");
    // get name of tab from fname input field
    var tabName = document.getElementsByClassName("fname")[0].value;
    // console.log(tabName + " tabName");
    if (tabName === "") {
      // console.log("tabName is empty");
      tabName = "Tab " + (maxIndex + 1);
    }
    
    // setTabList(tabList.concat(<button className="tablinks" onclick="">{tabName}</button>));
    setTabList(tabList.concat(tabName));
    setCurrChart(newChart);
    setTabIsActive(curIndex);
    setCurrFilters(filterMap);

    // // Update the current tab name
    // setCurrTabName("Tab " + (curIndex + 1));

  };

  // make a function for clicking tab event
  const onTabClick = (index) => {

    curIndex = index;
    setCurrChart(chartList[curIndex]);
    console.log("curIndex filter: " + curIndex, filterList[curIndex], filterList.length);
    setCurrFilters(filterList[curIndex]);
    setTabIsActive(curIndex);

    // Update the current tab name
    // setCurrTabName("Tab " + index);
  };

  // make function to delete a tab from the list
  const onDeleteTab = (index) => {
    // get the index of the tab
    // var index = event.target.innerHTML.substring(4);
    // console.log(index + " is delete tab index");
    if (index === 0 && chartList.length === 1) {
      console.log(index + " inside if for delete tab");
      // set chart as empty list
      setChartList([]);
      // set graph as empty list
      setGraphList([]);
      // set tab as empty list
      setTabList([]);
      //set filters list
      setFilterList([]);
      // set current chart as empty list
      setCurrChart();
      // set current filters as empty list
      setCurrFilters();
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
      
      if (index === curIndex && index !== 0) {
        // curIndex++;
        curIndex = 0;
      } 
      maxIndex = chartList.length;

      setCurrChart(chartList[curIndex]);
      setCurrFilters(filterList[curIndex]);
    }

    // Update the current tab name
    // setCurrTabName("Tab " + curIndex);

  };

  // function for formatting print the filter map out nicely
  const printFilterMap = (filterMap) => {
    // console.log("printing filter map", filterMap, curIndex);
    var htmlstr = "";
    if (filterMap === undefined) {
      return htmlstr;
    }
    for (var [key, value] of filterMap) {
      // generate html of key and value for each filter
      htmlstr += "<p><b>" + key + ": </b>" + value + "</p><br>";
      
      // htmlstr += key + ": " + value + "\n\n";
    }
    return htmlstr;
  };


  return (<div className="App">
    {/* <header className="App-header"> </header> */}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <button onClick={() => login()}>
        Sign in with Google{' '}
      </button>
    <div className="background" >
      {/* <button className="mainButton" type="button">Admin</button> */}
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
      <label for="fname">Graph name:</label>
      <input type="text" id="fname" class="fname"> 
      </input>
      <button onClick={onAddBtnClickGraph} className="mainButton" type="button">Generate Data</button>
    </div>


    {/* Map out tabs: if the current tab is being mapped, change the highlight*/}
    <div>
      {tabList && tabList.map((tab, index) => (
        <span>
          <button style={{marginRight: 2, backgroundColor: (tabIsActive===index) ? '#FFDD60' : ''}} className="tablinks" onClick={() => onTabClick(index)}>
            <span>{tab}</span> 
            <button style={{marginTop: 1, float: "right"}} className="btn" onClick={() => onDeleteTab(index)}><i className="fa fa-trash"></i></button>
          </button> 
        </span> ))}
    </div>


    <div style={{paddingBottom:'100px'}}>
      <h1>Filters</h1>
      {/* print filters with printFilterMap */}
      {/* currFilters && printFilterMap(currFilters) */}
      <div dangerouslySetInnerHTML={{ __html: printFilterMap(currFilters)}} />
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