import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";

const News = () => {
  // State to store the fetched data
  const [data, setData] = useState(null); // Fetch the data from the Flask server
  const [error, setError] = useState(null); // Add this state

  useEffect(() => {
    const fetchData = debounce(async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/?company=meta");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const result = await res.json();
        setData(result);
        console.log("data is : ", result);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err.message);
      }
    }, 300); // Debounce by 300ms
  
    fetchData();
  
    return () => fetchData.cancel(); // Cleanup on unmount
  }, []);
  return (
    <div>
      {data ? (
        <p>{data.response}</p>
      ) : (
        <p>Loading...</p> // Display loading while data is being fetched
      )}
    </div>
  );
};

export default News;
