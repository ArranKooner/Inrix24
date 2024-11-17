import React, { useState, useEffect } from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import debounce from "lodash.debounce";

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const PieTwo = () => {
  // Data for the pie chart

    const [data5, setData5] = useState(null); // Fetch the data from the Flask server

    const fetchData = debounce(async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/?company=microsoft`);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const result = await res.json();
            setData5(result.outputs[4]);
            //console.log("data is : ", result);
        } catch (err) {
            setError(err.message);
            console.error("Fetch error:", err.message);
        }
    }, 300);

    useEffect(() => {
        fetchData();

    return () => fetchData.cancel(); // Cleanup on unmount
    }, []);

    const states = data5 ? String(data5).split(',') : [];

    const chartdata = {
        labels: ['Positive', 'Nuetral', 'Negative'],
        datasets: [
            {
                data: states,
                backgroundColor: ['#B0E0E6', '#D3D3D3', '#ea9999'],
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
            <Pie data={chartdata} options={options} />
        </div>
    );
}
export default PieTwo;