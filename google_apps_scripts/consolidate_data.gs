var filters = {};
var filterIndices = [];
var filterToId = {};
var filterOrderingToIndex = {};
var rates = {};
var rateIndexToName = {};
var rateIndices = [];
var aggregateData = {};

var inputUrl = "https://docs.google.com/spreadsheets/d/11pZ7sGTtq9n8xJgIBmlO8mVbDCSyI-oD2Y_3s9kIHFs/edit#gid=0";
var outputUrl = "https://docs.google.com/spreadsheets/d/1rBMlVwd2_UQkwwLUkCluNQekxjznJgS8U0Y7IXEaWq0/edit#gid=0"
var useNumbers = true;

function ClearSheet() {
  var adminSheet = SpreadsheetApp.openByUrl(inputUrl);
  clearSheets_(adminSheet);
}

function clearSheets_(sheet) {
  if(sheet.getSheetByName("Attributes")) {
    sheet.deleteSheet(sheet.getSheetByName("Attributes"));
  }
  if(sheet.getSheetByName("Rates")) {
    sheet.deleteSheet(sheet.getSheetByName("Rates"));
  }
  if(sheet.getSheetByName("Data")) {
    sheet.deleteSheet(sheet.getSheetByName("Data"));
  }
}

function range_(size, startAt) {
    return [...Array(size).keys()].map(i => i + startAt);
}

function MoveToUserSharedDrive() {
  var adminSheet = SpreadsheetApp.openByUrl(inputUrl);
  var userSheet = SpreadsheetApp.openByUrl(outputUrl);
  clearSheets_(userSheet);
  adminSheet.getSheetByName("Attributes").copyTo(userSheet).setName("Attributes").hideSheet();
  adminSheet.getSheetByName("Rates").copyTo(userSheet).setName("Rates").hideSheet();
  adminSheet.getSheetByName("Data").copyTo(userSheet).setName("Data").hideSheet();
  clearSheets_(adminSheet);
}

function AggregateData() {
  var sheet = SpreadsheetApp.openByUrl(inputUrl);
  var data = sheet.getDataRange().getValues();
  var inputSheet;
  try {
    inputSheet = SpreadsheetApp.openByUrl(data[0][1]);
  }
  catch(error) {
    Logger.log("Unable to open Spreadsheet " + error);
    return;
  }


  var data = inputSheet.getDataRange().getValues();
  Logger.log(data.length);
  
  clearSheets_(sheet);

  //Get filters
  processHeader_(data);

  //Process Rows
  for(var i = 2; i < data.length; i++) {
    processRow_(data[i]);
  }
  generateFilterIds_();

  Logger.log("Filters: " + JSON.stringify(filters));
  Logger.log("Rates: " + JSON.stringify(rates));
  Logger.log("Data: " + JSON.stringify(aggregateData));
  Logger.log("Filter Mapping: " + JSON.stringify(filterToId));
  OutputData_(sheet);
  SpreadsheetApp.flush();
}

function processHeader_(data) {
  let count = 0;
  for (var i = 0; i < data[0].length; i++) {
    if(data[0][i] == "Ignore") {
      continue;
    }
    else if (data[0][i] == "Attribute") {
      filters[i] = {
        name: data[1][i],
        index: i,
        values: [],
      };
      filterIndices.push(i);
      filterOrderingToIndex[count++] = i;
    }
    else {
      let rateName = data[0][i];
      if(rateName in rates) {
        rates[rateName].names.push(data[1][i]);
        rates[rateName].indices.push(i);
      }
      else {
        rates[rateName] = {
          names: [data[1][i]],
          indices: [i]
        };
      }
      rateIndexToName[i] = rateName;
      rateIndices.push(i);
    }
  }
}

function generateFilterIds_() {
  let count = 0;
  for (const [key, value] of Object.entries(filters)) {
    filterToId[key] = {};
    for (const attributeOption of value.values) {
      //Generate filter to ID data
      filterToId[key][attributeOption] = count;
      count++;
    }
  }
}

function processRow_(data) {
  let dataInfo = GetRowInfo_(data);
  //Add to data
  let hashKey = dataInfo.rowFilters.toString();
  if(hashKey in aggregateData) {
    CombineData_(aggregateData[hashKey]["data"], dataInfo.rowData);
    aggregateData[hashKey].count++;
  }
  else {
    aggregateData[hashKey] = {
      filters: dataInfo.rowFilters,
      data: dataInfo.rowData,
      count: 1
    }
  }
}

function GetRowInfo_(data) {
  let rowFilters = [];
  let rowData = {};
  for(var i = 0; i < data.length; i++) {
    //If a filter col
    if(filterIndices.includes(i)) {
      //Check if value is already stored
      if(!filters[i].values.includes(data[i])) {
        filters[i].values.push(data[i]);
      }
      rowFilters.push(data[i]);
    }
    //If an attribute row
    if(rateIndices.includes(i)) {
      //TODO Check data type
      if(!(rateIndexToName[i] in rowData)) {
        rowData[rateIndexToName[i]] = [];
      }
      rowData[rateIndexToName[i]].push(data[i]);
    }
  }
  return {
    rowFilters: rowFilters,
    rowData: rowData
  }
}

function CombineData_(dataSet, newRow) {
  for (const [key, value] of Object.entries(dataSet)) {
    for(let i = 0; i < value.length; i++) {
      value[i] += newRow[key][i];
    }
  }
}

function OutputData_(sheet) {
  //Attributes
  var attributeSheet = sheet.insertSheet("Attributes");
  let i = 1;
  let count = 0;
  for (const [key, value] of Object.entries(filters)) {
    let filterCount = value.values.length;
    attributeSheet.getRange(i, 1).setValue(value.name);
    attributeSheet.getRange(i + 1, 1).setValue(value.values.length);
    let col = 2;
    for(const attributeOption of value.values) {
      attributeSheet.getRange(i, col).setValue(attributeOption);
      attributeSheet.getRange(i + 1, col).setValue(filterToId[value.index][attributeOption]);
      col++;
    }
    count += filterCount;
    i+=2;
  }

  //Rates
  var rateSheet = sheet.insertSheet("Rates")
  i = 1;
  for (const [key, value] of Object.entries(rates)) {
    rateSheet.getRange(i, 1).setValue(key);
    rateSheet.getRange(i, 2, 1, value.names.length).setValues([value.names]);
    i++;
  }
  
  //Data
  var dataSheet = sheet.insertSheet("Data");
  //Header Row
  dataSheet.getRange(1,1).setValue("Count");
  i = 2;
  for (const [key, value] of Object.entries(filters)) {
    dataSheet.getRange(1,i).setValue(value.name);
    i++;
  }
  for (const [key, value] of Object.entries(rates)) {
    for(const name of value.names) {
      dataSheet.getRange(1,i).setValue(name);
      i++;
    }
  }
  //Data
  i = 2;
  for (const [key, value] of Object.entries(aggregateData)) {
    dataSheet.getRange(i,1).setValue(value.count);
    let col = 0;
    if(!useNumbers) {
      col += value.filters.length;
      dataSheet.getRange(i, 2, 1, col+1).setValues([value.filters]);
    }
    else {
      for(const attributeValue of value.filters) {
        col++;
        dataSheet.getRange(i, col+1).setValue(filterToId[filterOrderingToIndex[col - 1]][attributeValue]);
      }
    }
    col++;
    for(const [key1, value1] of Object.entries(value.data)) {
      dataSheet.getRange(i, col+1, 1, value1.length).setValues([value1]);
      col += value1.length;
    }
    i++;
  }
}




