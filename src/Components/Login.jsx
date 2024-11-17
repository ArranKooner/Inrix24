import React, { useState } from 'react';
import './home.css'; // Custom CSS for styling the form
import { useNavigate } from 'react-router-dom';
import '../Components/Login.css'

function Login() {
  // State to hold the username and password input values
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

const navigate = useNavigate();

  // Handle input changes
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {

    e.preventDefault();

    // Simple validation (e.g., username and password are not empty)
    if (username === '' || password === '') {
      setError('Username and password cannot be empty.');
      return;
    }

    // Simulating a login process (in a real application, you would call an API here)
    if (username === 'user' && password === 'password') {
      setError('');
      alert('Login successful');
      // Redirect or update the app state after successful login
    } else {
      setError('Invalid credentials');
    }

    navigate('/pageone'); 
  };

  return (
    <div className="login-container">
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username"></label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Company"
          />
        </div>
        <p></p>
        

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button" >
          Analyze
        </button>
      </form>
    </div>
  );
}

export default Login;
