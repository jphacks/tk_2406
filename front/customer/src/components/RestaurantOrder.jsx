import { useState } from "react";
import "./RestaurantOrder.css";
const menuCategories = {
  donburi: [
    {
      id: 1,
      name: "牛丼",
      price: 800,
      img: "/images/gyudon.webp",
    },
    {
      id: 2,
      name: "カツ丼",
      price: 1000,
      img: "/images/katsudon.webp",
    },
  ],
  chicken: [
    {
      id: 3,
      name: "唐揚げ",
      price: 500,
      img: "/images/karaage.webp",
    },
    {
      id: 4,
      name: "照り焼きチキン",
      price: 750,
      img: "/images/teriyaki.webp",
    },
  ],
  otsumami: [
    { id: 5, name: "枝豆", price: 800, img: "/images/edamame.webp" },
    {
      id: 6,
      name: "餃子",
      price: 780,
      img: "/images/gyoza.webp",
    },
  ],
  alcohol: [
    { id: 7, name: "日本酒", price: 1500, img: "/images/drink/Sake.webp" },
    { id: 8, name: "赤ワイン", price: 900, img: "/images/drink/redWine.webp" },
    {
      id: 9,
      name: "白ワイン",
      price: 900,
      img: "/images/drink/whiteWine.webp",
    },
  ],
  nonAlcohol: [
    { id: 10, name: "コーラ", price: 500, img: "/images/drink/cola.webp" },
    {
      id: 11,
      name: "オレンジジュース",
      price: 500,
      img: "/images/drink/orangeJuice.webp",
    },
  ],
};

function RestaurantOrder() {
  const [selectedCategory, setSelectedCategory] = useState("donburi");
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const currentMenuItems = menuCategories[selectedCategory];
  const confirmOrder = () => {
    setIsPopupVisible(true);
    setTimeout(() => {
      setIsPopupVisible(false);
      setOrder([]);
      setTotal(0);
    }, 2000); // ポップアップが2秒間表示される
  };
  const addToOrder = (item) => {
    const existingItem = order.find((orderItem) => orderItem.id === item.id);
    if (existingItem) {
      setOrder((prevOrder) =>
        prevOrder.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      );
      setTotal((prevTotal) => prevTotal + item.price);
    } else {
      setOrder((prevOrder) => [...prevOrder, { ...item, quantity: 1 }]);
      setTotal((prevTotal) => prevTotal + item.price);
    }
  };

  const increaseQuantity = (item) => {
    setOrder((prevOrder) =>
      prevOrder.map((orderItem) =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      )
    );
    setTotal((prevTotal) => prevTotal + item.price);
  };

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      setOrder((prevOrder) =>
        prevOrder.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity - 1 }
            : orderItem
        )
      );
      setTotal((prevTotal) => prevTotal - item.price);
    } else {
      removeFromOrder(item);
    }
  };

  const removeFromOrder = (item) => {
    setOrder((prevOrder) =>
      prevOrder.filter((orderItem) => orderItem.id !== item.id)
    );
    setTotal((prevTotal) => prevTotal - item.price * item.quantity);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Restaurant Order System</h1>

      {/* カテゴリ選択部分 */}
      <div className="category-buttons">
        <button onClick={() => setSelectedCategory("donburi")}>どんぶり</button>
        <button onClick={() => setSelectedCategory("chicken")}>鶏系</button>
        <button onClick={() => setSelectedCategory("otsumami")}>
          おつまみ
        </button>
        <button onClick={() => setSelectedCategory("alcohol")}>酒類</button>
        <button onClick={() => setSelectedCategory("nonAlcohol")}>
          ノンアル
        </button>
      </div>

      {/* メニュー表示部分 */}
      <div className="menu-grid">
        {currentMenuItems.map((item) => (
          <div className="menu-card" key={item.id}>
            <img src={item.img} alt={item.name} className="menu-img" />
            <div className="menu-details">
              <h3 className="menu-name">{item.name}</h3>
              <p className="menu-price">¥{item.price}</p>

              <button onClick={() => addToOrder(item)} className="add-button">
                追加
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* カレントオーダー表示部分 */}
      <div className="order-list">
        <h2>注文リスト</h2>
        {order.length > 0 ? (
          <div>
            {order.map((item, index) => (
              <div key={index} className="order-card">
                <img src={item.img} alt={item.name} className="order-img" />
                <div className="order-details">
                  <h3 className="order-name">{item.name}</h3>
                  <p className="order-price">¥{item.price}</p>
                  <div className="quantity-control">
                    <button
                      onClick={() => decreaseQuantity(item)}
                      className="quantity-button"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item)}
                      className="quantity-button"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromOrder(item)}
                  className="remove-button"
                >
                  削除
                </button>
              </div>
            ))}

            {/* 合計額を固定表示 */}
            <div className="fixed-footer">
              <h2>合計額: ¥{total}</h2>
              <button onClick={confirmOrder} className="confirm-button">
                注文確定
              </button>
            </div>
          </div>
        ) : (
          <p>注文する料理はまだありません</p>
        )}
      </div>
      {isPopupVisible && <div className="popup">Order has been sent!</div>}
    </div>
  );
}

export default RestaurantOrder;
