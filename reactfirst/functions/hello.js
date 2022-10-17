const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet('11pZ7sGTtq9n8xJgIBmlO8mVbDCSyI-oD2Y_3s9kIHFs');

exports.handler = async function (event, context) {
  try {
    console.time("Auth");
    console.log(process.env.GOOGLE_PRIVATE_KEY);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
    console.timeEnd("Auth");

    console.time("Load Sheets");
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0];
    console.timeEnd("Load Sheets");

    console.time("Load Cells");
    let rows = 1;
    let cols = sheet.columnCount;
    console.log("Cols: " + sheet.columnCount + " Rows: " + sheet.rowCount);

    await sheet.loadCells({ // GridRange object
      startRowIndex: 0, endRowIndex: rows, startColumnIndex:0, endColumnIndex: cols
    });
    console.timeEnd("Load Cells");
  
    console.time("Read Cells");
    let string = "";
    let num = 0;
    for(let i = 0; i < rows; i++) {
      string = "";
      for(let j = 0 ; j < cols; j++) {
        string += sheet.getCell(i,j).value + " ";
      }
      console.log(string);
    }
    console.timeEnd("Read Cells");



    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (e) {
    console.error(e); 
    return {
      statusCode: 200,
      body: JSON.stringify({ message: e, statusCode: 400 }),
    };
  }
};