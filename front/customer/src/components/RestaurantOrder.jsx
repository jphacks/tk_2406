import { useState } from "react";
import "./RestaurantOrder.css";

// カテゴリごとのメニュー項目
const menuCategories = {
  donburi: [
    {
      id: 1,
      name: "Gyudon (Beef Bowl)",
      price: 7.99,
      img: "/images/gyudon.webp",
    },
    {
      id: 2,
      name: "Katsudon (Pork Cutlet Bowl)",
      price: 8.99,
      img: "/images/katsudon.webp",
    },
  ],
  chicken: [
    {
      id: 3,
      name: "Chicken Karaage",
      price: 6.99,
      img: "/images/karaage.webp",
    },
    {
      id: 4,
      name: "Teriyaki Chicken",
      price: 9.99,
      img: "/images/teriyaki.webp",
    },
  ],
  otsumami: [
    { id: 5, name: "Edamame", price: 4.99, img: "/images/edamame.webp" },
    {
      id: 6,
      name: "Gyoza (Dumplings)",
      price: 5.99,
      img: "/images/gyoza.webp",
    },
  ],
  alcohol: [
    { id: 7, name: "Sake", price: 12.99, img: "/images/drink/Sake.webp" },
    { id: 8, name: "Red Wine", price: 9.99, img: "/images/drink/redWine.webp" },
    {
      id: 9,
      name: "White Wine",
      price: 9.99,
      img: "/images/drink/whiteWine.webp",
    },
  ],
  nonAlcohol: [
    { id: 10, name: "コーラ", price: 4.99, img: "/images/drink/cola.webp" },
    {
      id: 11,
      name: "オレンジジュース",
      price: 3.99,
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
        <button onClick={() => setSelectedCategory("donburi")}>Donburi</button>
        <button onClick={() => setSelectedCategory("chicken")}>
          Chicken Dishes
        </button>
        <button onClick={() => setSelectedCategory("otsumami")}>
          Otsumami
        </button>
        <button onClick={() => setSelectedCategory("alcohol")}>Alcohol</button>
        <button onClick={() => setSelectedCategory("nonAlcohol")}>
          Non Alcohol
        </button>
      </div>

      {/* メニュー表示部分 */}
      <div className="menu-grid">
        {currentMenuItems.map((item) => (
          <div className="menu-card" key={item.id}>
            <img src={item.img} alt={item.name} className="menu-img" />
            <div className="menu-details">
              <h3 className="menu-name">{item.name}</h3>
              <p className="menu-price">${item.price.toFixed(2)}</p>
              <button onClick={() => addToOrder(item)} className="add-button">
                Add to Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* カレントオーダー表示部分 */}
      <div className="order-list">
        <h2>Current Order</h2>
        {order.length > 0 ? (
          <div>
            {order.map((item, index) => (
              <div key={index} className="order-card">
                <img src={item.img} alt={item.name} className="order-img" />
                <div className="order-details">
                  <h3 className="order-name">{item.name}</h3>
                  <p className="order-price">${item.price.toFixed(2)}</p>
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
                  Remove
                </button>
              </div>
            ))}
            <h2>Total: ${total.toFixed(2)}</h2>
            <button onClick={confirmOrder} className="confirm-button">
              Confirm Order
            </button>
          </div>
        ) : (
          <p>No items in the order</p>
        )}
      </div>
      {isPopupVisible && <div className="popup">Order has been sent!</div>}
    </div>
  );
}

export default RestaurantOrder;
