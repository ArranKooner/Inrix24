import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useUser } from './UserContext';

const Feature = () => {
  const { username } = useUser();
  const [data7, setData7] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = debounce(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/?company=microsoft`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const result = await res.json();
        setData7(result.outputs[7]);
      } catch (err) {
        setError(err.message);
      }
    }, 300);

    fetchData();
    return () => fetchData.cancel();
  }, [username]);

  return (
    <div style={{ overflowY: 'auto', maxHeight: '100%', padding: '10px' }}>
      {data7 ? (
        <p style={{ fontSize: '12px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{data7}</p>
      ) : (
        <p>Loading...</p>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Feature;
