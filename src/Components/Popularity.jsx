import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";

const Pop =() => {
    const [data5, setData5] = useState(null);

    const fetchData = debounce(async () => {
        try {
            const res = await fetch("http://127.0.0.1:5000/?company=microsoft");
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

    const stateNum = data5 ? String(data5).split(',') : [];

    const result = `Positive = ${stateNum[0]}, Neutral = ${stateNum[1]}, Negative = ${stateNum[2]}`;
    return <div>{result}</div>
        
}

export default Pop;