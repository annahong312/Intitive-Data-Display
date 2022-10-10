import React, { useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as Chart } from 'chart.js/auto'
import { UserData } from '../Data'

export default function GenerateChart() {

  // Data For Chart
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
  });

  return (
    <Bar data={userData}/>
  );

}