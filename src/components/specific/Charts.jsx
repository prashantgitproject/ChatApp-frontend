import React from 'react'
import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
    plugins,
    scales,
  } from "chart.js";
  
import { Doughnut, Line } from 'react-chartjs-2'
import { orange, orangeLight, purple, purpleLight } from '../../constants/color';
import { getLast7Days } from '../../libs/features';

ChartJS.register(
    Tooltip,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Filler,
    ArcElement,
    Legend
  );

  const labels = getLast7Days();

  const lineChartOptions = {
    Response: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    scales: {
        x: {
            grid: { display: false },
        },
        y: {
            beginAtZero: true,
            grid: { display: false },
        }
    },
  
  }


const LineChart = ({value = []}) => {

    const data = {
        labels,
        datasets: [
          {
            label: 'First dataset',
            data: value,
            fill: true,
            backgroundColor: purpleLight,
            borderColor: purple,
          },
        ],
      };

  return (
    <Line data={data} options={lineChartOptions}/>
  )
}

const DoughnutChartOptions = {
  Response: true,
  plugins: {
      legend: {
          display: false,
      },
  },
  cutout: 120,

}

const DoughnutChart = ({value =[], labels=[]}) => {

  const data = {
    labels,
    datasets: [
      {
        data: value,
        fill: true,
        backgroundColor: [purpleLight, orangeLight],
        hoverBackgroundColor: [purple, orange],
        borderColor: [purple, orange],
        offset: 40,
      },
    ],
  };

  return (
    <Doughnut data={data} options={DoughnutChartOptions} className='z-10'/>
  )
}

export  {LineChart, DoughnutChart}