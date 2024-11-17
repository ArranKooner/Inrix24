import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Components/home.css';
import Login from './Login';

export function Home() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState('');

  const handleGoToPageOne = () => {
    navigate('/PageOne'); // Navigate to PageOne
  };

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedPage(selectedValue);

    if (selectedValue === 'PageOne') {
      navigate('/PageOne');
    } else if (selectedValue === 'PageTwo') {
      navigate('/PageTwo');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="home-container">
      {/* Animated Bubble Logo */}
      <div className="bubble-logo">
        <span>S</span>
        <span>C</span>
        <span>O</span>
        <span>P</span>
        <span>E</span>
      </div>

      {/* Static Tagline */}
      <div className="typing">
        "Where customer opinions meet business strategy."
      </div>

      {/* Login Form */}
      <Login />
    </div>
  );
}

export default Home;
