import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import expensesCategories from '../../backend/models/expensesCategories';
import { fetchPieChart } from '../Expenses/ExpensesSlice';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: expensesCategories,
  datasets: [
    {
      label: '% of Total Expense This Month',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};


export const options = {
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Yearly Spread of Expenses',
    },
  }

export default function PieChart() {
  const user = useSelector(state => state.login.user)
  const dispatch = useDispatch()
  const pieData = useSelector(state => state.expenses.categoryData)
  const tableInfo = useSelector(state => state.expenses.tableInfo)

  const data = {
    labels: pieData.map((item) => item.category), // Extract categories
    datasets: [
      {
        label: '% of Total Expense This Month',
        data: pieData.map((item) => item.percentage), // Extract totals
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  useEffect(() => {
    dispatch(fetchPieChart(user))
  }, [tableInfo])

  return <Pie data={data} options = {options}/>;
}