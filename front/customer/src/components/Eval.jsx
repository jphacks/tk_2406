import React from "react";
import styles from "./Eval.module.css";

const Eval = ({ onLogin }) => {
  const handleGoodClick = () => {
    onLogin();
  };

  const handleBadClick = () => {
    onLogin();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>前回の飲み会を評価してください</h1>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.buttonGood}`}
          onClick={handleGoodClick}
        >
          良い
        </button>
        <button
          className={`${styles.button} ${styles.buttonBad}`}
          onClick={handleBadClick}
        >
          悪い
        </button>
      </div>
    </div>
  );
};

export default Eval;
