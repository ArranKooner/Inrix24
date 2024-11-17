import React, { useState } from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import '../Components/Login.css'

function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { username, setUsername } = useUser();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password cannot be empty.');
      return;
    }
    if (password === 'password') {
      setError('');
      alert('Login successful');
      navigate('/pageone');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Company"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
        </div>
        <p></p>
        

        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">
          Analyze
        </button>
      </form>
    </div>
  );
}

export default Login;
