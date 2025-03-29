import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Auth.css"

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    axios.post("http://localhost:5000/login", { username, password })
      .then(response => {
        if (response.data.user_id) {
          localStorage.setItem("user_id", response.data.user_id); // Store user_id
          window.location.href = "/profile"; // Redirect to Profile page
        } else {
          alert("Invalid credentials");
        }
      })
      .catch(error => {
        console.error("Login Error:", error);
      });
  };
  return (
    <div>
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p>
          New User? <Link to="/register">Register</Link>
        </p>
      </div>

    </div>
    </div>
      );
}

      export default Login;

