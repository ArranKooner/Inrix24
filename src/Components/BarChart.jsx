import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Registering necessary components from Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export function HorizontalBarChart() {
  // Data for the chart
    const data = {
        labels: ['State1', 'State2', 'State3', 'State4', 'State5', 'State6', 'State7', 'State8'], // Labels on the Y-axis
        datasets: [
            {
                label: 'Most Searched in States',
                data: [12, 19, 3, 5, 12, 5, 5, 5], // Values for each bar
                backgroundColor: ['#ADD8E6', '#ADD8E6', '#ADD8E6', '#ADD8E6', '#ADD8E6', '#ea9999', '#ea9999', '#ea9999'], // Bar colors
                borderColor: ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black'], // Bar border colors
                borderWidth: 1,
            },
            ],
    };

  // Chart options
    const options = {
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
        <div style={{ width: '100%', height: '90%'  }}>
            <Bar data={data} options={options} />
        </div>
    );
}