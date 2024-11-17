import React from 'react'
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../Components/home.css'


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
        <img src="/L.png" alt="Logo" className="logo" />

        <p></p>
        
        <Textbox />
        <Textbox />
        <p></p>

        <button onClick={handleGoToPageOne}>Analyze!</button>

        <p></p>
        <div className="dropdown">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            {selectedPage ? `Go to ${selectedPage}` : 'Select a Page'} ▼
          </button>
        
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => handleDropdownChange({ target: { value: 'PageOne' } })}>Page One</li>
              <li onClick={() => handleDropdownChange({ target: { value: 'PageTwo' } })}>Page Two</li>
            </ul>
          )}
        </div>
    </div>
    );
}

function Textbox() {
  const [text, setText] = useState(''); // State to store the value of the input

  // Handle input change
  const handleChange = (event) => {
    setText(event.target.value); // Update the state with the value of the input field
  };

  return (
    <div>
      <label htmlFor="text-box">Enter text: </label>
      <input
        type="text"
        id="text-box"
        value={text}
        onChange={handleChange} // Update state on every change
        placeholder="Type something..."
        className="text-box"
      />
      <p>You typed: {text}</p> {/* Display the typed text */}
    </div>
  );
}

export default Home