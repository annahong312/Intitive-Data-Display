import React from "react";
import { Line } from 'react-chartjs-2';
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
} from 'chart.js';
import { UserData } from '../Data'
import { UserData2 } from '../Data2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GenerateGraph(index) {

  // Data For Graph
  const dataFromFile = parseInt(index.index) % 2 > 0 ? UserData2 : UserData;
  // console.log(index.index + " is index");
  // print data from file user gain values

  // console.log(dataFromFile[0][2] + " is dataFromFile");

  // const [data, setData] = useState({
  //   labels: dataFromFile.map((data) => data.year),
  //   datasets: [
  //     {
  //       label: "Users Gained",
  //       data: dataFromFile.map((data) => data.userGain),
  //       backgroundColor: [
  //         "rgba(75,192,192,1)",
  //         "#ecf0f1",
  //         "#50AF95",
  //         "#f3ba2f",
  //         "#2a71d0",
  //       ],
  //       borderColor: "black",
  //       borderWidth: 2,
  //     },
  //   ],
  //   options: {
  //     plugins: {
  //         title: {
  //             display: true,
  //             text: 'Custom Chart Title',
  //             padding: {
  //                 top: 10,
  //                 bottom: 30
  //             }
  //         }
  //     }
  // }
  // });

  // print usergain from data hook object
  // console.log(data.datasets[0].data + " is user gain");
  // console.log(dataFromFile.map((data) => data.userGain));
  // console.log(data.userGain + " is userData");
  return (
    <div>
      {/* <button onClick={() => setData(data)}>Reset</button> */}
      <Line
        // data={data}
        data={{
          labels: dataFromFile.map((data) => data.year),
          datasets: [
            {
              label: "Users Gained",
              data: dataFromFile.map((data) => data.userGain),
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
              borderColor: "black",
              borderWidth: 2,
            },
          ],
          options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Custom Chart Title',
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            }
        }
      }}
        height={"80px"}
      // width={"30%"}
      // options={{ maintainAspectRatio: false }}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>

  );

}