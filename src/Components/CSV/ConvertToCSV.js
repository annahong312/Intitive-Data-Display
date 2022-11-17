const getBodyData = ({ data, headers, separator }) => {
    console.log('in getBodyData: data', data, 'fields', headers, 'separator', separator);
  return data.map((row) => {
    console.log('in getBodyData: row', row);
    // loop through headers array

    return headers.map((field) => {
    //   if (row.hasOwnProperty(field)) {
        // console.log(row[field], " is row field", "field is ", field);
        return row[field];
    //   }
    //   return null;
    }).join(separator);
  }).join("\n");
};

export default function ConvertToCSV (data, headers, separator = ",") {
    // console.log('in ConvertCSV data', data, 'headers', headers, 'separator', separator); 
  const body = getBodyData({ data, headers, separator }),
    header = headers.join(separator);
    // console.log('in ConvertCSV body', body, 'header', header);

  return header + "\n" + body;
};