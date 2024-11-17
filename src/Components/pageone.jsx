import React from 'react'
import PieChart from './PieChart'; 
import  HorizontalBarChart from './BarChart'; 
import TextInput from './TextInput';
import News from './News'; 
import Box3 from './BoxThree';
import Pop from './Popularity';
import PieTwo from './PieTwo';
import "./pageone.css";
import News2 from './News2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

export function PageOne(){
    return (
        <div className="grid-container">

        <div className="box box1">
            <h2>You vs. Competitors Search Trend</h2>
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

        <div className="box box3">
            <h2>Percentage of Positive/Neutral/Negative Social Media Coverage about Your Company</h2>
            <div className="chart">
                <PieTwo />
            </div>
        </div>

        <div className="box box4">
            <div>
                <h2>Specific Product/Feature Analyzer</h2>
                <TextInput />
                <h2>Social Media Vibe of the thing: </h2>
            </div>
        </div>
        <div className="box box5"><h2> Key takeaways from Social media and news coverage of your company</h2>
            <News />
        </div>
        
        <div className="box box6">
        <h2>Most Viral Posts about Company</h2>
            <News2 />
        </div>
    </div>
    )


}
export default PageOne
