import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";

const Box3 =() => {

    const [data1, setData1] = useState(null); // Fetch the data from the Flask server

    const fetchData = debounce(async () => {
        try {
            const res = await fetch("http://127.0.0.1:5000/?company=microsoft");
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const result = await res.json();
            setData1(result.outputs[2]);
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

    return <div>{data1 ? <p style={{fontSize: '9px'}}>{data1}</p> : <p style={{fontSize: '12px'}}>Loading...</p>}</div>;
}

export default Box3;