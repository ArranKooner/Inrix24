import React from 'react'
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../Components/home.css'
import Login from './Login'


export function Home() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState('');

    const handleGoToPageOne = () => {
      navigate('/PageOne');  // Navigate to PageOne
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
    <div>
        <img src="/Probe.png" alt="Real" className="logo" />
        <p></p>
        <div class="typing">"Where customer opinions meet business strategy."</div>
        <p></p>
        <Login />
        <p></p>

    </div>
    );
}

export default Home