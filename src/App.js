import React, { useState, useRef } from "react";
import './App.css';
import GenerateChartMUI from './Components/GenerateChartMUI.js';
import GenerateGraph from './Components/GenerateGraph.js';
import MultipleSelect, {getUpdatedNameVals} from './Components/MultipleSelect.js'
import { GetAttributes, GetData } from './Scripts'
import Login from './Components/Login';
import ErrorMessage from './Components/ErrorMessage'
import { Grid } from '@mui/material';

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

  const [chartList, setChartList] = useState([]);

  const [graphList, setGraphList] = useState([]);
  const [currChart, setCurrChart] = useState([]);
  const [dropdownList, setDropdownList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [currFilters, setCurrFilters] = useState([]);
  const [tabIsActive, setTabIsActive] = useState(-1);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [urlIds, setUrlIds] = useState([]);
    // Map ID's back to Names
  // build tab list
  const [tabList, setTabList] = useState([]);

  const scrollTo = useRef(null);
  const executeScroll = () => scrollTo.current.scrollIntoView();


  const parseParams = (params) => {
    console.log(params);
    var allParams = params.split("&filter=");
    console.log(allParams, " is all params");
    var rawParams = allParams[0].split(",");
    console.log(rawParams);
    // var extractedParams = {};
    // var count = 0;
    var splits = rawParams[0].replace("id=", "");
    rawParams[0] = splits;
    console.log(rawParams);
    rawParams.forEach((item) => {
      if(item !== "") {
        extractedParams.push(parseInt(item));
      }
    });
    console.log(extractedParams);
    console.log(allParams[1] + " is allParams1 ");
    splitColFromURL = decodeURIComponent(allParams[1]);
    console.log(splitColFromURL + " is splitColFromURL");
    //start
    console.log(extractedParams);
    console.log(JSON.stringify(filterIdsToNames));
    console.log(filterMasterListIds);

    // take extractedParams and get names of filters based on ids
    var nameVals = new Map();
    for (var idx = 0; idx < extractedParams.length; idx++) {
      console.log(extractedParams[idx]);
      var name = filterIdsToNames[extractedParams[idx]];
      // var testName = filterIdsToNames[]
      console.log(name + " is cur name");
      // get the name of the filter from the id
      var filter = null;
      // for(var [key, value] of filterMasterListIds) {
      //  console.log(key + " is key testing");
      // }
      for (let [key, value] of filterMasterListIds.entries()) {
        console.log(key + " is key " + value + " is value for masterListIds");
        for (var i = 0; i < value.length; i++) {
          console.log(value[i] + " is value at i");
          if (value[i] === extractedParams[idx]) {
            filter = key;
            console.log(filter + " " + name + " is found for id " + extractedParams[idx]);
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

      console.log(name + " " + filter);
      
    }
    console.log(nameVals);

    getAPIData(nameVals);
    //end

  };

  const onLogin = () => {
    GetAttributes(createMultipleSelect, popupError);
  }

  const popupError = (msg) => {
    setErrorMsg(msg);
    setError(true);
  }

  const copyLink = () => {
    var url = "https://intuitive-data-display.netlify.app?";
    var curValArray = urlIds[curIndex];
    console.log(curValArray);
    console.log("end val arr");
    if(Object.keys(curValArray).length > 0) {
      console.log(Object.keys(curValArray).length + " is length");
      url += "id=";
    }
    for(const [key] of Object.entries(curValArray)) {
      url += key;
      url += ",";
    }
    url += "&filter=" + encodeURIComponent(splitColList[curIndex]);
    console.log(url);
    return url;
  };

  // TODO: refactor filterdict
  const createMultipleSelect = (filters) => {

    // set attributes
    console.log(filters);
    setAttributes(filters.data);
    attributeRates = filters.data;
    console.log(filters.data);
    console.log("end filter attributes");
    storeRateOptions = Object.keys(filters.data.rates);
    rate = storeRateOptions[0];

    var dropdownLabels = filters.data.attributes;
    
    

    // console.log("dropdownLabels: " + dropdownLabels);
    // console.log(attributes + " is attributes in createMultipleSelect");
    
    // Mapping filters to names 
    // Filter = string name, need to map to a separate map
    var newFilterDropdowns = Object.keys(dropdownLabels).map((filter) => {

      var curFilterDict = {}
      var curFilterDictIds = []

      var keys = Object.keys(dropdownLabels[filter]);
      var values = Object.values(dropdownLabels[filter]);
      for (var i = 0; i < keys.length; i++) {
        curFilterDict[keys[i]] = values[i];
        curFilterDictIds.push(values[i]);
        // filterDict[keys[i]] = values[i]; //TODO remove
        filterIdsToNames[values[i]] = keys[i];
        // console.log(keys[i], values[i], " are keys and values of filterIds");
      }
      filterMasterList.set(filter, curFilterDict);
      filterMasterListIds.set(filter, curFilterDictIds);

      // displayParamsFromURL();

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


  // Called on Generate Chart
  // function to return data from API call
  const getAPIData = (curVals) => {
    var invertedVals;
    var selectedFilterMap;

    console.log(selectedFilterMap);
    if(!paramsInURL){ 
      console.log("curVals is null");
      var vals = getUpdatedNameVals();
      selectedFilterMap = new Map(JSON.parse(
        JSON.stringify(Array.from(vals))));
        console.log(selectedFilterMap);
      invertedVals = invertDropdownData(selectedFilterMap);
      console.log(invertedVals);
    }
    else {
      selectedFilterMap = invertDropdownData(curVals);
      invertedVals = curVals;
    }

    var filterMap = new Map(JSON.parse(
      JSON.stringify(Array.from(invertedVals))));

    console.log(filterMap, " is filterMap");

    setFilterList(filterList.concat(selectedFilterMap));
    setCurrFilters(selectedFilterMap);
    // console.log(storeRateOptions, " is storeRateOptions");
    setRateOptions(storeRateOptions);
    var valueIds = {}
    var valueArray = []
      for (let [key, value] of selectedFilterMap) {
        // console.log(key + " is key " + value + " is value");
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
      // console.log(dataRates, " is dataRates");
      console.log(data)

      var dataRow = {
        name: filterName,
        total: value.count
      }
      for(let i = 0; i < dataRates.length; i++) {
        // console.log(dataRates[i], " is dataRates[i] " + rate + " is rate");
        if(attributes.length > 0) {
          // console.log("not null for attributes");
          dataRow[attributes.rates[rate][i]] = dataRates[i];
        }
        else {
          // console.log(attributeRates);
          // console.log(attributeRates.rates[rate][i]);
          dataRow[attributeRates.rates[rate][i]] = dataRates[i];
        }
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
    setSplitColList(splitColList.concat(splitColValue));

    var newChart = <GenerateChartMUI index={maxIndex} data={dataRows} rate={splitColValue} attributes={attributeRates.rates[rate]}/>;
    var newGraph = <GenerateGraph index={maxIndex} data={data.data} rate={rate} attributes={attributeRates.rates[rate]} filterDict={filterIdsToNames}/>;
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
     setTimeout(executeScroll, 1000);
  };

  const invertDropdownData = (filterMap) => {
    var newUsedNameVals = new Map(); //if filtermap under the gender key contains male, add female/non-binary to newFilterMap
    for (let [key, value] of filterMap) { //this should mimic mulitpleSelect return map of lists 
      var selectedItems = []; //
      for(var val in filterMasterList.get(key)) {
            // if val is in filterMasterList but not in filterMap/,newUsedNameVals 
            //add it to newFilterMap
        if (! (value.includes(val))){
          selectedItems.push(val);
        }
          
      }
      newUsedNameVals.set(key, selectedItems);
      // console.log(newUsedNameVals);
      // console.log("end newUsedNameVals");
    }
    return newUsedNameVals;
  };

  // make a function for clicking tab event
  const onTabClick = (index) => {

    curIndex = index;
    setCurrChart(chartList[curIndex]);
    // console.log("curIndex filter: " + curIndex, filterList[curIndex], filterList.length);
    setCurrFilters(filterList[curIndex]);
    setTabIsActive(curIndex);
  };

  // make function to delete a tab from the list
  const onDeleteTab = (index) => {
    // get the index of the tab
    if (index === 0 && chartList.length === 1) {

      // set chart as empty list
      setChartList([]);
      // set graph as empty list
      setGraphList([]);
      // set tab as empty list
      setTabList([]);
      //set filters list
      setFilterList([]);
      // set current chart as empty list
      // setRateOptions([]);
      
      setCurrChart([]);
      // set current filters as empty list
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
      // tabList.splice(index, 1);
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

      var toRemoveUrlIds = urlIds[index];
      var newUrlIds = urlIds.filter(item => item !== toRemoveUrlIds);
      setUrlIds(newUrlIds);
      
      if (index === curIndex && index === 0) {
        // curIndex++;
        curIndex = 0;
      } else {
        curIndex--;
      }
      setCurrChart(newChartList[curIndex]);
      setCurrFilters(newFilterList[curIndex]);
    }
  };

  const onRateChange = () => {
    // rate = e.target.value;
    rate = document.getElementById("rateDropdown").value;
    // console.log("rate", rate);
    getAPIData();

  }

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
      
    <Login onLogin={onLogin}/>
    <ErrorMessage open={error} setOpen={setError} errorMsg={errorMsg}/>
      
    <div className="background" >
      <h1>Center for Engineering Diversity Data Display Tool</h1>

      <div className={paramsInURL ? 'hidden' : undefined}>
        <div className="Checkbox-Background">
          <h1>Filter Options</h1>
          <label for="selectAllFilters">Choose a filter to sort by: </label>
          {/* <select name="selectAllFilters" id="selectAllFilters">
            {Object.keys(attributes.attributes).map((i) => {
                          return(<option value="i">{i}</option>);
                    })}
          </select> */}
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
          {/* <button onClick={onAddBtnClickGraph} className="mainButton" type="button">Generate Data</button> */}
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