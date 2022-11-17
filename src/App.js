import React, { useState } from "react";
import './App.css';
import GenerateChartMUI from './Components/GenerateChartMUI.js';
import GenerateGraph from './Components/GenerateGraph.js';
import MultipleSelect, {getUpdatedNameVals} from './Components/MultipleSelect.js'
import { useGoogleLogin } from '@react-oauth/google';
import { GetAttributes, GetData } from './Scripts'
import { gapi } from 'gapi-script';
import { Grid } from '@mui/material';


var curIndex = -1;
var maxIndex = -1;
var rate = "Enrollment Rate";

var filterDict = {};
var filterMasterList = new Map();
var filterIdsToNames = {};

gapi.load('client:auth2', initClient);
function initClient() {
  gapi.client.init( {
    discoveryDocs: ["https://script.googleapis.com/$discovery/rest?version=v1"],
  });
}

function App() {
  const [attributes, setAttributes] = useState({});
  const [rateDropdown, setRateDropdown] = useState([]);

  const [chartList, setChartList] = useState([]);

  const [graphList, setGraphList] = useState([]);
  const [currChart, setCurrChart] = useState([]);
  const [dropdownList, setDropdownList] = useState([]);
  const [dropdownList2, setDropdownList2] = useState([]);
  const [dropdownList3, setDropdownList3] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [currFilters, setCurrFilters] = useState([]);


  const [tabIsActive, setTabIsActive] = useState(0);

  const onSuccess = tokenResponse => {
    console.log(tokenResponse);
    gapi.client.setToken({
      access_token: tokenResponse.access_token
    })
    GetAttributes(createMultipleSelect);
  }

  const login = useGoogleLogin({
    onSuccess: onSuccess,
    flow: "implicit",
    scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/script.scriptapp",
  });

  // TODO: refactor filterdict
  var filterCount = 0;
  const createMultipleSelect = (filters) => {

    // set attributes
    setAttributes(filters.data);

    var dropdownLabels = filters.data.attributes;
    
    

    // console.log("dropdownLabels: " + dropdownLabels);
    // console.log(attributes + " is attributes in createMultipleSelect");
    
    // Mapping filters to names 
    // Todo: check this for broken attributes asdf
    // Filter = string name, need to map to a separate map
    var newFilterDropdowns = Object.keys(dropdownLabels).map((filter) => {
      // map keys with filter
      // Stayed in Viterbi (key), filterDict (val) => Y:0, N:1
      var curFilterDict = {}

      var keys = Object.keys(dropdownLabels[filter]);
      var values = Object.values(dropdownLabels[filter]);
      for (var i = 0; i < keys.length; i++) {
        curFilterDict[keys[i]] = values[i];
        filterDict[keys[i]] = values[i]; //TODO remove
        filterIdsToNames[values[i]] = keys[i];
        // console.log(keys[i], values[i], " are keys and values");
      }
      filterMasterList.set(filter, curFilterDict);

      return <MultipleSelect givenNames={Object.keys(dropdownLabels[filter])} label={filter} />
    });    

    setDropdownList(dropdownList.concat(newFilterDropdowns));
    setRateDropdown(<select name="selectAllFilters" id="selectAllFilters">
    {Object.keys(filters.data.attributes).map((i) => {
                  return(<option value={i}>{i}</option>);
            })} </select>)
  };


  // Called on Generate Chart
  // function to return data from API call
  const getAPIData = () => {
    var vals = getUpdatedNameVals();
    var filterMap = new Map(JSON.parse(
      JSON.stringify(Array.from(vals))));

    console.log(filterMap, " is filterMap");

    setFilterList(filterList.concat(filterMap));
    setCurrFilters(filterMap);
    var valueArray = [];
      for (let [key, value] of filterMap) {
        for (var val in value) {
          console.log(value[val], " is value[val]", " and key is ", key, " and value is ", value);
          valueArray.push(filterMasterList.get(key)[value[val]]);
          console.log(filterMasterList.get(key), " is filterMasterList.get(key)");
          console.log(filterMasterList.get(key)[value[val]], "is value[val]");
          // valueArray.push(filterDict[value[val]]);
          console.log(filterDict[value[val]], "is filterDict value[val]");
        }

      }
      console.log(valueArray);

      var e = document.getElementById("selectAllFilters");
      var splitColValue = e.value;
      // console.log(splitColValue, "is splitColValue");
      
      GetData(JSON.stringify({
        filters: valueArray,
        splitColumn: splitColValue,
      }), onAddBtnClickGraph);
  }

  // Map ID's back to Names
  // build tab list
  const [tabList, setTabList] = useState([]);
  const onAddBtnClickGraph = (data) => {
    // process data into a list
    var dataRows = []
    for(const [key,value] of Object.entries(data.data)) {
      // change key into respective filter value
      var filterName = "";
      if(key === "total") {
        filterName = "Total";
      } else {
        // filterName = Object.keys(filterDict).find(filterKey => filterDict[filterKey] === parseInt(key));
        filterName = filterIdsToNames[key];
      }
      var dataRates = value.rates[rate];

      var dataRow = {
        name: filterName,
        total: value.count
      }
      for(let i = 0; i < dataRates.length; i++) {
        dataRow[attributes.rates[rate][i]] = dataRates[i];
      }
      dataRows.push(dataRow);

    }

    // console.log(data.data + " is data in onAddBtnClickGraph");

    curIndex++;
    maxIndex++;

    // setFilterList(filterList.concat(filterMap));
    // console.log(filterList[maxIndex] + " filterList");

    var e = document.getElementById("selectAllFilters");
    var splitColValue = e.value;

    var newChart = <GenerateChartMUI index={maxIndex} data={dataRows} rate={splitColValue} attributes={attributes.rates[rate]}/>;
    var newGraph = <GenerateGraph index={maxIndex} data={data.data} rate={rate} attributes={attributes.rates[rate]} filterDict={filterIdsToNames}/>;
    setChartList(chartList.concat(newChart));
    setGraphList(graphList.concat(newGraph));

    // get name of tab from fname input field
    var tabName = document.getElementsByClassName("fname")[0].value;
    // console.log(tabName + " tabName");

     // TODO: display error message on duplicate name asdf
     if (! tabList.includes(tabName)){
      if (tabName === "") {
        tabName = "Tab " + (maxIndex + 1);
      }
      setTabList(tabList.concat(tabName));
      setCurrChart(newChart);
      setTabIsActive(curIndex);
     }
     else{
      alert("Please select a new tab name.");
     }

  };

  // make a function for clicking tab event
  const onTabClick = (index) => {

    curIndex = index;
    setCurrChart(chartList[curIndex]);
    console.log("curIndex filter: " + curIndex, filterList[curIndex], filterList.length);
    setCurrFilters(filterList[curIndex]);
    setTabIsActive(curIndex);
  };

  // make function to delete a tab from the list
  const onDeleteTab = (index) => {
    // get the index of the tab
    if (index === 0 && chartList.length === 1) {
      // useEffect(() => {
        // set chart as empty list
        setChartList([]);
        // set graph as empty list
        setGraphList([]);
        // set tab as empty list
        setTabList([]);
        //set filters list
        setFilterList([]);
        // set current chart as empty list
        
        setCurrChart([]);
        // set current filters as empty list
        setCurrFilters([]);
        // set current index as -1
      // });

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
      
      if (index === curIndex && index === 0) {
        // curIndex++;
        curIndex = 0;
      } else {
        curIndex--;
      }
      maxIndex = chartList.length;

      setCurrChart(chartList[curIndex]);
      setCurrFilters(filterList[curIndex]);
    }

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
    }
    return htmlstr;
  };

  const filterListLen = Object.keys(dropdownList).length;


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
        <label for="selectAllFilters">Choose a filter to sort by: </label>
        {/* <select name="selectAllFilters" id="selectAllFilters">
          {Object.keys(attributes.attributes).map((i) => {
                        return(<option value="i">{i}</option>);
                  })}
        </select> */}
        {rateDropdown}
        <Grid container>
          <Grid item >
            {dropdownList.slice(0, filterListLen / 3)}
          </Grid>
          <Grid item >
            {dropdownList.slice(filterListLen / 3, 2 * filterListLen / 3)}
          </Grid>
          <Grid item >
            {dropdownList.slice(2 * (filterListLen / 3), filterListLen)}
          </Grid>
        </Grid>
       
      </div>
      <div className="Button-Background" >
        <label for="fname">Graph name:  </label>
        <input type="text" id="fname" class="fname"></input>
        {/* <button onClick={onAddBtnClickGraph} className="mainButton" type="button">Generate Data</button> */}
        <button onClick={getAPIData} className="mainButton" type="button">Generate Data</button>
      </div>
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


    <div style={{paddingBottom:'50px'}}>
      <h1>Filters</h1>
      <div dangerouslySetInnerHTML={{ __html: printFilterMap(currFilters)}} />
    </div>

    <div style={{paddingBottom:'50px'}}>
      <h1>Chart</h1>
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