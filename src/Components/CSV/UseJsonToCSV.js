import { ConvertToCsv, saveCsv } from "ConvertToCSV.js";

const useJsonToCsv = () => {
  const saveAsCsv = ({
    data,
    fields,
    fileformat = "csv",
    filename = "chart_data",
    separator = ","
  }) => {
    const dataFields = Object.keys(fields);
    const headers = Object.keys(fields).map((key) => fields[key]);

    saveCsv({
      data: ConvertToCsv({ data, fields: dataFields, headers, separator }),
      fileformat,
      filename,
    });
  };

  return { saveAsCsv };
};

export default useJsonToCsv;