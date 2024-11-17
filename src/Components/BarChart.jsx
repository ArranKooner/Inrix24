import React, { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import debounce from "lodash.debounce";

// Registering necessary components from Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const HorizontalBarChart =() => {

    const [data1, setData1] = useState(null); // Fetch the data from the Flask server
    const [data2, setData2] = useState(null);

    const fetchData = debounce(async () => {
        try {
            const res = await fetch("http://127.0.0.1:5000/?company=microsoft");
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const result = await res.json();
            setData1(result.outputs[0]);
            setData2(result.outputs[1]);
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


    const states = data1 ? String(data1).split(',') : [];
    const stateNum = data2 ? String(data2).split(',') : [];

  // Data for the chart
    const chartdata = {
        labels: states, // Labels on the Y-axis
        datasets: [
            {
                label: 'Most Searched in States',
                data: stateNum, // Values for each bar
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
            <Bar data={chartdata} options={options} />
        </div>
    );
}
export default HorizontalBarChart