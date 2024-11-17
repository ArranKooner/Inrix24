import React from 'react'
import PieChart from './PieChart'; 
import { HorizontalBarChart } from './BarChart'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

export function PageOne(){
    return (
        <div className="grid-container">
        <div className="box box1">
            <h2>Competitors Search Trend</h2>
            <div className="chart">
                <PieChart />
            </div>
        </div>
        <div className="box box2">
            <h2>Search trend by location</h2>
            <div className="chart">
                <HorizontalBarChart />
            </div>
        </div>
        <div className="box box3">Box 3</div>
        <div className="box box4">Box 4</div>
        <div className="box box5">Box 5</div>
        <div className="box box6">Box 6</div>
    </div>
    )
}
export default PageOne