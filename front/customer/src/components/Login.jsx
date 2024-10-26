import { useState } from "react";
import "./Login.css";
import axios from "axios";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post(
          "http://10.10.2.47:8000/customer/login",
          new URLSearchParams({ username: username, password: password }), // データをフォーム形式で送信
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
          }
        )
        .then((response) => {
          console.log(response);
        });
    } catch (error) {
      console.log("Error sending order:", error);
    }

    if (username && password) {
      onLogin();
    } else {
      alert("Please enter both username and password.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="login-input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <p></p>
        <button type="submit" className="login-button">
          Sign up
        </button>
      </form>
    </div>
  );
}

export default Login;
