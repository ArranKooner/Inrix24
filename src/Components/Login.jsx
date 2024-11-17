import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import "./Login.css";

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isExiting, setIsExiting] = useState(false); // Animation trigger
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const navigate = useNavigate();
  const { username, setUsername } = useUser();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "") {
      setError("Company cannot be empty.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://127.0.0.1:5000?company=${username}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from backend");
      }

      const result = await response.json();
      console.log("Backend response:", result);

      setIsExiting(true); // Trigger slide-right animation
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/pageone");
      }, 500);
    } catch (err) {
      console.error("Error communicating with the backend:", err);
      setError("Failed to connect to the backend. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`login-container ${isExiting ? "slide-right" : ""}`}>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Company"
            disabled={isSubmitting} // Disable input while submitting
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            disabled={isSubmitting} // Disable input while submitting
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button
          type="submit"
          className="login-button"
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? "Submitting..." : "Analyze"}
        </button>
      </form>
    </div>
  );
}

export default Login;
