import React from 'react'
import PieChart from './PieChart'; 
import HorizontalBarChart from './BarChart'; 
import TextInput from './TextInput';
import News from './News'; 
import Box3 from './BoxThree';
import Pop from './Popularity';
import PieTwo from './PieTwo';
import Feature from './Feature';
import "./pageone.css";
import News2 from './News2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

export function PageOne(){
    return (
        <div className="grid-container">

        <div className="box box1">
            <h2>Competitor Trends</h2>
            <div className="chart">
                <PieChart />
            </div>
        </div>
        <div className="box box2">
            <h2>Trends by Location</h2>
            <div className="chart">
                <HorizontalBarChart />
            </div>
        </div>

        <div className="box box3">
            <h2>Social Media Sentiment</h2>
            <div className="chart">
                <PieTwo />
            </div>
        </div>

        <div className="box box4">
            <div>
                <h2>Feature Analysis</h2>
                <Feature />
            </div>
        </div>
        <div className="box box5">
            <h2>Social Media Insights</h2>
            <News />
        </div>
        
        <div className="box box6">
            <h2>Viral Posts</h2>
            <News2 />
        </div>
    </div>
    )
}

export default PageOne;
