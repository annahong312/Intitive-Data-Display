const getBodyData = ({ data, headers, separator }) => {
    console.log('in getBodyData: data', data, 'fields', headers, 'separator', separator);
  return data.map((row) => {
    console.log('in getBodyData: row', row);
    // loop through headers array to get the data for each column
    return headers.map((field) => {
        return row[field];
    }).join(separator);
  }).join("\n");
};

export default function ConvertToCSV (data, headers, separator = ",") {
  const body = getBodyData({ data, headers, separator }),
    header = headers.join(separator);

  return header + "\n" + body;
};