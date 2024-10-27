import { useState } from "react";
import styles from "./Login.module.css";
import { tryLogin } from "./comm";
import Eval from "./Eval";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shouldEval, setShouldEval] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "" && password === "") {
      onLogin(); // デバッグ用ログイン！
      return;
    }
    if (username === "re" && password === "") {
      setShouldEval(true);
      //   onLogin(); // デバッグ用 評価画面へ！
      return;
    }
    if (username === "u1" && password === "00") {
        setShouldEval(true);
        //   onLogin(); // デバッグ用 評価画面へ！
        return;
      }
    // customer/
    if (username && password) {
      console.log("通信開始", username, password);
      const loginSuccess = await tryLogin(username, password);
      console.log("tryLogin終了",loginSuccess);
      if (loginSuccess) {
        onLogin();
      } else {
        setError("Invalid username or password.");
      }
    } else {
      setError("Please enter both username and password.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      {shouldEval && <Eval onLogin={onLogin} />}
      {!shouldEval && (
        <>
          <h2 className={styles.loginTitle}>Login</h2>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.loginInputGroup}>
              <label htmlFor="username" className={styles.loginLabel}>
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.loginInput}
              />
            </div>
            <div className={styles.loginInputGroup}>
              <label htmlFor="password" className={styles.loginLabel}>
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.loginInput}
              />
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
          <p className={styles.signUpPrompt}>
            新規登録がお済みでないなら{" "}
            <a href="/signup" className={styles.signUpLink}>
              Sign Up
            </a>
          </p>{" "}
        </>
      )}
    </div>
  );
}

export default Login;
