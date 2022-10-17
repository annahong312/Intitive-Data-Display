import React, { useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto'
import { UserData } from '../Data'

export default function GenerateGraph() {

  // Data For Graph
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained",
        data: UserData.map((data) => data.userGain),
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
  });

  return (
    <div>
      <button onClick={() => setUserData(userData)}>Reset</button>
      <Line
        data={userData}
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