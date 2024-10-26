import { useState } from "react";
import "./RestaurantOrder.css";
import ConsumptionView from "./ConsumptionView";
import Cart from "./Cart";
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
  const [isPopupCart, togglePopupCart] = useState(false);

  const currentMenuItems = menuCategories[selectedCategory];

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
    if (item.quantity > 0) {
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
      <ConsumptionView alcoholStatusLevel={1} />
      <div>
        <button onClick={() => togglePopupCart(!isPopupCart)}> helaooo </button>
        {order.reduce((accumulator, orderItem) => {
          return accumulator + orderItem.quantity;
        }, 0)}
      </div>

      {isPopupCart && (
        <Cart
          order={order}
          total={total}
          decreaseQuantity={decreaseQuantity}
          increaseQuantity={increaseQuantity}
          removeFromOrder={removeFromOrder}
          setOrder={setOrder}
          setTotal={setTotal}
          onClose={togglePopupCart}
        />
      )}

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

      {isPopupVisible && <div className="popup">Order has been sent!</div>}
    </div>
  );
}

export default RestaurantOrder;
