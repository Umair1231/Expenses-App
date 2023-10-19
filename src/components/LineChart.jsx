import React from 'react';
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
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchLineChart } from '../Expenses/ExpensesSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Yearly Spread of Expenses',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']



export default function LineChart() {
  const user = useSelector(state => state.login.user)
  const dispatch = useDispatch()
  const lineData = useSelector(state => state.expenses.expensesTotal)
  const tableInfo = useSelector(state => state.expenses.tableInfo)




  const datasets = Object.keys(lineData).map((category) => {
    const data = labels.map((_, monthIndex) =>
      lineData[category][monthIndex] || 0
    );

    return {
      label: category,
      data,
      borderColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`,
      backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.5)`,
    };
  });

  const data = {
    labels,
    datasets,
  };


  useEffect(() => {
    dispatch(fetchLineChart(user))
    console.log(lineData)
  }, [tableInfo])
  return <Line options={options} data={data} />;
}
