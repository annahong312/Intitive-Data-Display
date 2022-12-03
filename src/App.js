import { Grid } from '@mui/material';
import React, { useRef, useState } from "react";
import './App.css';
import ErrorMessage from './Components/ErrorMessage';
import GenerateChartMUI from './Components/GenerateChartMUI.js';
import GenerateGraph from './Components/GenerateGraph.js';
import Login from './Components/Login';
import MultipleSelect, { getUpdatedNameVals } from './Components/MultipleSelect.js';
import { GetAttributes, GetData } from './Scripts';

var curIndex = -1;
var maxIndex = -1;
var rate = "Enrollment Rate";
var storeRateOptions = [];
var splitColFromURL = "";

var paramsInURL = false;
var filterMasterList = new Map();
var filterMasterListIds = new Map();
var filterIdsToNames = {};
var extractedParams = [];
var attributeRates;

function App() {
  const [attributes, setAttributes] = useState({});
  const [splitColList, setSplitColList] = useState([]);
  const [splitDropdown, setSplitDropdown] = useState([]);
  const [rateOptions, setRateOptions] = useState([]);
  const [urlIds, setUrlIds] = useState([]);

  const [chartList, setChartList] = useState([]);
  const [graphList, setGraphList] = useState([]);
  const [currChart, setCurrChart] = useState([]);
  const [dropdownList, setDropdownList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [currFilters, setCurrFilters] = useState([]);
  const [tabIsActive, setTabIsActive] = useState(-1);
  const [tabList, setTabList] = useState([]);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const scrollTo = useRef(null);
  const executeScroll = () => scrollTo.current.scrollIntoView();

  const parseParams = (params) => {
    var allParams = params.split("&filter=");
    var rawParams = allParams[0].split(",");
    
    var splits = rawParams[0].replace("id=", "");
    rawParams[0] = splits;
    rawParams.forEach((item) => {
      if(item !== "") {
        extractedParams.push(parseInt(item));
      }
    });
    splitColFromURL = decodeURIComponent(allParams[1]);

    // take extractedParams and get names of filters based on ids
    var nameVals = new Map();
    for (var idx = 0; idx < extractedParams.length; idx++) {
      var name = filterIdsToNames[extractedParams[idx]];
      
      // get the name of the filter from the id
      var filter = null;
      for (let [key, value] of filterMasterListIds.entries()) {
        for (var i = 0; i < value.length; i++) {
          if (value[i] === extractedParams[idx]) {
            filter = key;
            break;
          }
        }
        if(filter !== null) {
          break;
        }
      }

      // add filter to nameVals with the name of the filter and the value of the filter
      if(nameVals.has(filter)) {
        var temp = nameVals.get(filter);
        temp.push(name);
        nameVals.set(filter, temp);
      } else {
        nameVals.set(filter, [name]);
      }
      
    }
    getAPIData(nameVals);

  };

  const onLogin = () => {
    GetAttributes(createMultipleSelect, popupError);
  }

  const popupError = (msg) => {
    setErrorMsg(msg);
    setError(true);
  }

  //build url for sharing
  const copyLink = () => {
    var url = "https://intuitive-data-display.netlify.app?";
    var curValArray = urlIds[curIndex];
    if(Object.keys(curValArray).length > 0) {
      url += "id=";
    }
    for(const [key] of Object.entries(curValArray)) {
      url += key;
      url += ",";
    }
    url += "&filter=" + encodeURIComponent(splitColList[curIndex]);
    return url;
  };

  const createMultipleSelect = (filters) => {

    // set attributes
    setAttributes(filters.data);
    attributeRates = filters.data;
    storeRateOptions = Object.keys(filters.data.rates);
    rate = storeRateOptions[0];

    var dropdownLabels = filters.data.attributes;
    
    // Mapping filters to names 
    var newFilterDropdowns = Object.keys(dropdownLabels).map((filter) => {

      var curFilterDict = {}
      var curFilterDictIds = []

      var keys = Object.keys(dropdownLabels[filter]);
      var values = Object.values(dropdownLabels[filter]);
      for (var i = 0; i < keys.length; i++) {
        curFilterDict[keys[i]] = values[i];
        curFilterDictIds.push(values[i]);
        filterIdsToNames[values[i]] = keys[i];
      }
      filterMasterList.set(filter, curFilterDict);
      filterMasterListIds.set(filter, curFilterDictIds);

      return <MultipleSelect givenNames={Object.keys(dropdownLabels[filter])} label={filter} />
    });

    setDropdownList(dropdownList.concat(newFilterDropdowns));
    setSplitDropdown(<select name="selectAllFilters" id="selectAllFilters">
    {Object.keys(filters.data.attributes).map((i) => {
                  return(<option value={i}>{i}</option>);
            })} </select>)
            
    var url = window.location.href;
    if (url.includes("?")){
      paramsInURL = true;
      var params = url.split("?");
      parseParams(params[1]); 
    }
  };

  // function to return data from API call
  const getAPIData = (curVals) => {
    var invertedVals;
    var selectedFilterMap;

    if(!paramsInURL){ // if no params in URL
      var vals = getUpdatedNameVals();
      selectedFilterMap = new Map(JSON.parse(
        JSON.stringify(Array.from(vals))));
      invertedVals = invertDropdownData(selectedFilterMap);
    }
    else {
      selectedFilterMap = invertDropdownData(curVals);
      invertedVals = curVals;
    }

    setFilterList(filterList.concat(selectedFilterMap));
    setCurrFilters(selectedFilterMap);
    setRateOptions(storeRateOptions);
    var valueIds = {}
    var valueArray = []
      for (let [key, value] of invertedVals) {
        for (var val in value) {
          valueArray.push(filterMasterList.get(key)[value[val]]);
          valueIds[filterMasterList.get(key)[value[val]]] = value[val];

        }

      }
      setUrlIds(urlIds.concat(valueIds));

      var e = document.getElementById("selectAllFilters");
      var splitColValue;
      if(e == null){
        splitColValue = splitColFromURL;
      } else {
        splitColValue = e.value;
        
      }
      
      GetData(JSON.stringify({
        filters: valueArray,
        splitColumn: splitColValue,
      }), onAddBtnClickGraph, popupError);
  }
  
  const onAddBtnClickGraph = (data) => {
    var dataRows = []
    for(const [key,value] of Object.entries(data.data)) {
      // change key into respective filter value
      var filterName = "";
      if(key === "total") {
        filterName = "Total";
      } else {
        filterName = filterIdsToNames[key];
      }
      var dataRates = value.rates[rate];

      var dataRow = {
        name: filterName,
        total: value.count
      }
      for(let i = 0; i < dataRates.length; i++) {
        if(attributes.length > 0) {
          dataRow[attributes.rates[rate][i]] = dataRates[i];
        }
        else {
          dataRow[attributeRates.rates[rate][i]] = dataRates[i];
        }
      }
      dataRows.push(dataRow);

    }
    curIndex++;
    maxIndex++;
    // get splitColValue
    var e = document.getElementById("selectAllFilters");
    var splitColValue = e.value;
    setSplitColList(splitColList.concat(splitColValue));

    var newChart = <GenerateChartMUI index={maxIndex} data={dataRows} rate={splitColValue} attributes={attributeRates.rates[rate]}/>;
    var newGraph = <GenerateGraph index={maxIndex} data={data.data} rate={rate} attributes={attributeRates.rates[rate]} filterDict={filterIdsToNames}/>;
    setChartList(chartList.concat(newChart));
    setGraphList(graphList.concat(newGraph));

    // get name of tab from fname input field
    var tabName = document.getElementsByClassName("fname")[0].value;

     // duplicate tab
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
     setTimeout(executeScroll, 1000);
  };

  const invertDropdownData = (filterMap) => {
    var newUsedNameVals = new Map(); //if filtermap under the gender key contains male, add female/non-binary to newFilterMap
    for (let [key, value] of filterMap) { //this should mimic mulitpleSelect return map of lists 
      var selectedItems = []; //
      for(var val in filterMasterList.get(key)) {
            // if val is in filterMasterList but not in filterMap, add to selectedItems 
        if (! (value.includes(val))){
          selectedItems.push(val);
        }
          
      }
      newUsedNameVals.set(key, selectedItems);
    }
    return newUsedNameVals;
  };

  // make a function for clicking tab event
  const onTabClick = (index) => {

    curIndex = index;
    setCurrChart(chartList[curIndex]);
    setCurrFilters(filterList[curIndex]);
    setTabIsActive(curIndex);
  };

  // make function to delete a tab from the list
  const onDeleteTab = (index) => {
    // get the index of the tab
    if (index === 0 && chartList.length === 1) {

      // set each created graph and its attributes as empty
      setChartList([]);
      setGraphList([]);
      setTabList([]);
      setFilterList([]);
      setCurrChart([]);
      setCurrFilters([]);
      setUrlIds([]);

      curIndex = -1;
      // set max index as -1
      maxIndex = -1;
      setTabIsActive(-1);
    } else {
      // remove the tab from the tab list
      var toRemove = tabList[index];
      setTabList(tabList.filter(item => item !== toRemove));
      // remove the chart from the chart list
      var toRemoveChart = chartList[index];
      var newChartList = chartList.filter(item => item !== toRemoveChart);
      setChartList(newChartList);
      // remove the graph from the graph list
      var toRemoveGraph = graphList[index];
      setGraphList(graphList.filter(item => item !== toRemoveGraph));  
      // set filter list
      var toRemoveFilter = filterList[index];
      var newFilterList = filterList.filter(item => item !== toRemoveFilter);
      setFilterList(newFilterList);     

      //Update split col list
      var toRemoveSplitCol = splitColList[index];
      var newSplitColList = splitColList.filter(item => item !== toRemoveSplitCol);
      setSplitColList(newSplitColList);   

      var toRemoveUrlIds = urlIds[index];
      var newUrlIds = urlIds.filter(item => item !== toRemoveUrlIds);
      setUrlIds(newUrlIds);
      
      if (index === curIndex && index === 0) {
        curIndex = 0;
      } else {
        curIndex--;
      }
      setCurrChart(newChartList[curIndex]);
      setCurrFilters(newFilterList[curIndex]);
    }
  };

  //get data when a new rate is selected
  const onRateChange = () => {
    rate = document.getElementById("rateDropdown").value;
    getAPIData();

  }

  // function for formatting print the filter map out nicely
  const printFilterMap = (filterMap) => {
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      
    <Login onLogin={onLogin}/>
    <ErrorMessage open={error} setOpen={setError} errorMsg={errorMsg}/>
      
    <div className="background" >
      <h1>Center for Engineering Diversity Data Display Tool</h1>

      <div className={paramsInURL ? 'hidden' : undefined}>
        <div className="Checkbox-Background">
          <h1>Filter Options</h1>
          <label for="selectAllFilters">Choose a filter to sort by: </label>
          {splitDropdown}
          <Grid 
            container 
            className="dropdown-container"
            alignItems="center"
            justifyContent="center"
          >
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
          <button onClick={getAPIData} className="mainButton" type="button">Generate Data</button>
        </div>
      </div>
    </div>
    
    <div>
      {tabList && tabList.map((tab, index) => (
        <span className={paramsInURL ? 'hidden' : undefined}>
          <button style={{marginRight: 2, backgroundColor: (tabIsActive===index) ? '#FFDD60' : ''}} className="tablinks" onClick={() => onTabClick(index)}>
            <span>{tab}</span> 
            <button style={{marginTop: 1, float: "right"}} className="btn" onClick={(e) => {e.stopPropagation(); onDeleteTab(index,e)}}><i className="fa fa-trash"></i></button>
          </button> 
        </span> ))}
    </div>

  {(tabIsActive < 0) ? (<div></div>) :
    (<div ref={scrollTo}>
    <div style={{paddingBottom:'50px'}}>
        <h1>Filters</h1>
        <div dangerouslySetInnerHTML={{ __html: printFilterMap(currFilters)}} />
      </div>

    <div>
      <button onClick={() => navigator.clipboard.writeText(copyLink())}>
        Copy Link to Clipboard
      </button>
      
    </div>
      <div style={{paddingBottom:'50px'}}>
        <h1>Chart</h1>
        <div className={paramsInURL ? 'hidden' : undefined}>
          <select name="rateDropdown" id="rateDropdown"  onChange={onRateChange}>
            {rateOptions.map(item => {
              if(item === rate) {
                return <option value={item} selected>{item}</option>;
              }
              else {
                return <option value={item}>{item}</option>;
              }
            })}
          </select>
        </div>
        {currChart}
      </div>
   
      <div className="background">
        <h1>Graph</h1>
        {graphList[curIndex]}
      </div>
    </div>)}
  </div>
  );
}

export default App;