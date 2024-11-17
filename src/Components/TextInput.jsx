import React, { useState } from 'react';

function TextInput() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    alert(`You submitted: ${inputValue}`);
  };

  return (
    <div style={gridContainerStyle}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter text"
        style={textInputStyle}
      />
      <button onClick={handleSubmit} style={buttonStyle}>
        Submit
      </button>
    </div>
  );
}

// Inline styles for simplicity
const gridContainerStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto', // Text input takes remaining space, button takes auto size
  gap: '10px', // Space between input and button
  alignItems: 'center', // Align items vertically in the center
  width: '100%', // Full-width container
  maxWidth: '400px', // Optional: Limit container width
  margin: '20px auto', // Center the container horizontally
};

const textInputStyle = {
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  backgroundColor: '#FFFFFF',
  color: '#000000',
  borderRadius: '4px',
  flex: '1',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#9fc5e8',
  color: '#fff',
  cursor: 'pointer',
};

export default TextInput;
