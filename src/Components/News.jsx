
import React, {useState, useEffect} from 'react' 
//import "./App.css";

function News(){

    const [data, setdata] = useState({
        name:"",
        age:0,
        date:"",
        programming: "",
    });
    useEffect(() => {
        fetch("https://127.0.0.1:5000/company=meta").then((res) =>
                res.json().then((data) => {
                    setdata({
                        name:data.Name, 
                        age:data.Age,
                        date: data.Date,
                        programming: data.programming,
                    });
                })
            );
        }, []);

        return(
            <div className= "News">
                <header className = "App-header">
                    <h3> React and Flask</h3>
                    <p>{data.name}</p>
                    <p>{data.age}</p>
                    <p>{data.date}</p>
                    <p>{data.programming}</p>
                </header>
            </div>
        );
}

export default News;