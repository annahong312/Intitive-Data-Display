import React from "react";
import { Line } from "react-chartjs-2";
// import { Chart } from 'chart.js/auto'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const colorList = [
  "rgba(75,192,192,1)",
  "#ecf0f1",
  "#50AF95",
  "#f3ba2f",
  "#2a71d0",
  "#f55656",
  "#f79131",
  "#64ed5a",
  "#072591",
  "#076600",
  "#7e33ff",
];

function GetData(props) {
  let returnData = [];
  var index = 0;
  for (const [key, value] of Object.entries(props.data)) {
    var filterName;
    if (key === "total") {
      filterName = "Total";

      // Remove the first element of Total array to match chart
      if (value.rates[props.rate].length !== 0) {
        // value.rates[props.rate].shift();
      }
    } else {
      // filterName = Object.keys(props.filterDict).find(filterKey => props.filterDict[filterKey] === parseInt(key));
      filterName = props.filterDict[key];
    }

    returnData.push({
      label: filterName,
      data: value.rates[props.rate],
      backgroundColor: colorList[index % colorList.length],
      borderColor: "black",
      borderWidth: 1,
    });
    index = index + 1;

    console.log("making graph " + filterName + " " +  value.rates[props.rate]);

  }
  return returnData;
}

export default function GenerateGraph(props) {
  return (
    <div>
      {/* <button onClick={() => setData(data)}>Reset</button> */}
      <Line
        // data={data}
        data={{
          labels: props.attributes,
          datasets: GetData(props),
          options: {
            plugins: {
              title: {
                display: true,
                text: "Custom Chart Title",
                padding: {
                  top: 10,
                  bottom: 30,
                },
              },
            },
          },
        }}
        height={"80px"}
      />
    </div>
  );
}
