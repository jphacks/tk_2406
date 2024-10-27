import { useState } from "react";
import "./Login.css";
import { tryLogin } from "./comm";

// eslint-disable-next-line react/prop-types
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "" && password === "") {
      onLogin(); // デバッグ用ログイン！
    }
    if (username && password && tryLogin(username, password)) {
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
