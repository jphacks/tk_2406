import { useState } from "react";
import Login from "./components/Login";

import "./App.css";
import menuCategories from "./components/data";

// メインアプリケーションのインポート（既存のメニュー画面や注文画面）
import RestaurantOrder from "./components/RestaurantOrder"; // メインの注文画面コンポーネント

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [dishData, setDishData] = useState({ menuCategories });

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="app-container">
      {isLoggedIn ? (
        <div>
          <RestaurantOrder dishData={dishData} />
        </div>
      ) : (
        <Login onLogin={handleLogin} setDishData={setDishData} />
      )}
    </div>
  );
}

export default App;
