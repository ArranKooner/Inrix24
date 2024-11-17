import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useUser } from './UserContext';

const News = () => {
  const { username } = useUser();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = debounce(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/?company=${username}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const result = await res.json();

        setData(result.outputs[2]);
        console.log("data is : ", result);

      } catch (err) {
        setError(err.message);
      }
    }, 300);

    fetchData();
    return () => fetchData.cancel();
  }, [username]);

  return (
    <div>
      {data ? <p style={{fontSize: '9px'}}>{data}</p> : <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default News;
