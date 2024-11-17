import React from 'react'
import { useNavigate } from 'react-router-dom';
export function Home() {
    const navigate = useNavigate();

    const handleGoToPageOne = () => {
      navigate('/PageOne');  // Navigate to PageOne
    };
    const handleGoToPageTwo = () => {
      navigate('/PageTwo');  // Navigate to PageTwo
    };


    return (
    <div>
        <h1>Home Page</h1>
        <button onClick={handleGoToPageOne}>Go to Page One</button>
        <button onClick={handleGoToPageTwo}>Go to Page Two</button>
        </div>
    );
}
export default Home