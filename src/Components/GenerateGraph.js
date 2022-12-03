import React from "react";
import { Line } from "react-chartjs-2";
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
    } else {
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

  }
  return returnData;
}

export default function GenerateGraph(props) {
  return (
    <div>
      <Line
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
        height={"150px"}
      />
    </div>
  );
}
