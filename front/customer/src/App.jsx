import { useState } from "react";
import Login from "./components/Login";

import "./App.css";

// メインアプリケーションのインポート（既存のメニュー画面や注文画面）
import RestaurantOrder from "./components/RestaurantOrder"; // メインの注文画面コンポーネント

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="app-container">
      {isLoggedIn ? (
        <div>
          <RestaurantOrder />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
