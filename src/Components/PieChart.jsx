import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const PieChart = () => {
  // Data for the pie chart
    const data = {
        labels: ['You', 'Comp1', 'Comp2'],
        datasets: [
            {
                data: [12, 19, 8],
                backgroundColor: ['#ADD8E6', '#B0E0E6', '#8FD9FB'],
                hoverOffset: 4,
            },
        ],
    };

  // Options to customize the chart
    const options = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 18, // Increase label font size
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                    return `${tooltipItem.label}: ${tooltipItem.raw}%`; // Adjust tooltip label
                    },
                },
                },
        },
        indexAxis: 'y', // This makes the chart horizontal
        responsive: true, // Ensures the chart is responsive to container size
        maintainAspectRatio: false, // Allows chart to scale based on container size
        scales: {
            x: {
                beginAtZero: true, // Ensures the x-axis starts at 0
            },
        },
    };
    return (
        <div style={{ position: 'relative', width: '100%', height: '90%' }}>
            <Pie data={data} options={options} />
        </div>
    );
}
export default PieChart;
