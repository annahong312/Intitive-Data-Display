let filterOptions = [0];
let filterColumnName = "";

var attributeCols = {};
var rateCols = {};
var filterColumnIndex = -1;

function API_GetData(event) {
  try {
    Logger.log(event);
    let parameters = JSON.parse(event);

    filterOptions = parameters["filters"].map(Number);
    filterColumnName = parameters["splitColumn"];
  }
  catch(e) {
    return JSON.stringify({
      status: "Failure",
      error: "Unable to read parameters"
    })
  }

  return GetData();
}

function GetData() {
  if(!ValidateUser_()) {
    return JSON.stringify({
      status: "Failure",
      error: "Unable to open spreadsheet"
    })
  }

  GetAttributes_();

  var data = sheet.getSheetByName("Data").getDataRange().getValues();
  
  ProcessHeader_(data[0]);
  
  Logger.log(attributeCols);
  Logger.log(rateCols);
  Logger.log(filterColumnIndex);

  let returnData = {
    status: "Success",
    data: { }
  }
  //Process Rows
  for(let i = 1; i < data.length; i++) {
    if(!IncludeRow_(data[i])) {
      continue;
    }
    let rowData = ProcessRowData_(data[i]);
    if(filterColumnIndex != -1) {
      let filterId = data[i][filterColumnIndex];
      if(!(filterId in returnData.data)) {
        returnData.data[filterId] = rowData;
      }
      else {
        AddData_(returnData.data[filterId], rowData);
      }
    }
    if(!("total" in returnData.data)) {
      returnData.data.total = { 
        rates: {},
        count: 0 
      };
      for (const [key, value] of Object.entries(rowData.rates)) {
        returnData.data.total.rates[key] = Array(value.length).fill(0);
      }
    }
    AddData_(returnData.data.total, rowData);
  }
  Logger.log(JSON.stringify(returnData));
  return JSON.stringify(returnData);
}

function ProcessHeader_(data) {
  for(var i = 1; i < data.length; i++) {
    //Is a attribute
    let entry = data[i];
    if(entry in appData.attributes) {
      attributeCols[i] = entry;
      if(filterColumnName === entry) {
        filterColumnIndex = i;
      }
    }
    //Is a rate
    else {
      for (const [key, value] of Object.entries(appData.rates)) {
        if(value.includes(entry)) {
          rateCols[i] = key;
          break;
        }
      }
    }
  }
}

function IncludeRow_(data) {
  for(let j = 0; j < data.length; j++) {
    if(j in attributeCols && filterOptions.includes(data[j])) {
      return false;
    }
  }
  return true;
}

function ProcessRowData_(data) {
  let rowData = {
    rates: {},
    count: data[0]
  }
  for(let j = 1; j < data.length; j++) {
    if(j in rateCols) {
      let rateName = rateCols[j];
      if(!(rateName in rowData.rates)) {
        rowData.rates[rateName] = [];
      }
      rowData.rates[rateCols[j]].push(data[j]);
    }
  }
  return rowData;
}

function AddData_(source, newItem) {
  source.count += newItem.count;
  for (const [key, value] of Object.entries(source.rates)) {
    for(let i = 0; i < value.length; i++) {
      value[i] += newItem.rates[key][i];
    }
  }
}








