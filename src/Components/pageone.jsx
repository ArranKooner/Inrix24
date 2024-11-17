import React from 'react'
import PieChart from './PieChart'; 
import { HorizontalBarChart } from './BarChart'; 
import TextInput from './TextInput';
import News from './News'; 
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

            <div className="section">
                <h3>News Articles on Google</h3>
                <p>Positive: x% | Neutral: x% | Negative: x%</p>
            </div>

            <div className="section">
                <h3>Posts on Reddit</h3>
                <p>Positive: x% | Neutral: x% | Negative: x%</p>
            </div>

            <div className="section">
                <h3>Posts on Twitter</h3>
                <p>Positive: x% | Neutral: x% | Negative: x%</p>
            </div>
        </div>

        <div className="box box4">
            <div>
                <h2>Specific Product/Feature Analyzer</h2>
                <TextInput />
                <h2>Social Media Vibe of the thing: </h2>
            </div>
        </div>
        <div className="box box5"><h2> Key takeaways from Social media and news coverage of your comapny</h2>
            <News />
        </div>
        
        <div className="box box6">
        <h2>Most Viral Posts about Company</h2>
            <div className="section">
                <h3>Twitter:</h3>
                "blah blah etc. "
            </div>

            <div className="section">
                <h3>Reddit:</h3>
                blah blah blah etc.
            </div>
        </div>
    </div>
    )


}
export default PageOne