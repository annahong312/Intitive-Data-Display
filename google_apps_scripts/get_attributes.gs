var userUrl = "https://docs.google.com/spreadsheets/d/1rBMlVwd2_UQkwwLUkCluNQekxjznJgS8U0Y7IXEaWq0/edit#gid=0"
var sheet;

var appData = {};

function API_GetAttributes() {
  if(!ValidateUser_()) {
    return JSON.stringify({
      status: "Failure",
      error: "Unable to open spreadsheet"
    })
  }

  GetAttributes_(sheet);
  return JSON.stringify({
    status: "Success",
    data: appData
  });
}

function ValidateUser_() {
  try {
    sheet = SpreadsheetApp.openByUrl(userUrl);
    return true;
  }
  catch(error) {
    Logger.log("Unable to open spreadsheet " + error);
    return false;
  }
}

function GetAttributes_() {
  //Parse Attribute Data
  var attributeData = sheet.getSheetByName("Attributes").getDataRange().getValues();
  GetAttributeData_(attributeData);
  
  //Parse Rate Data
  var rateData = sheet.getSheetByName("Rates").getDataRange().getValues();
  GetRateData_(rateData);

  Logger.log(JSON.stringify(appData));
}

function GetAttributeData_(attributeData) {
  appData["attributes"] = {};
  for(let i = 0; i < attributeData.length; i += 2) {
    let attributeName = attributeData[i][0];
    let attributeCount = attributeData[i+1][0];
    appData["attributes"][attributeName] = {};
    for(let j = 1; j < attributeCount+1; j++) {
      let name = attributeData[i][j];
      let id = attributeData[i+1][j];
      appData["attributes"][attributeName][name] = id;
    }
  }
}

function GetRateData_(rateData) {
  appData["rates"] = {};
  for(let i = 0; i < rateData.length; i++) {
    let rateName = rateData[i][0];
    let rateValues = [];
    for(let j = 1; j < rateData[i].length; j++) {
      rateValues.push(rateData[i][j]);
    }
    appData["rates"][rateName] = rateValues;
  }
}








