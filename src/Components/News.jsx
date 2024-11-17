import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useUser } from './UserContext';

const News = () => {
  const { username } = useUser();
  const [data6, setData6] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = debounce(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/?company=microsoft`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const result = await res.json();
        setData6(result.outputs[5]);
      } catch (err) {
        setError(err.message);
      }
    }, 300);

    fetchData();
    return () => fetchData.cancel();
  }, [username]);

  return (
    <div>
      {data6 ? <p style={{fontSize: '13px'}}>{data6}</p> : <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default News;
