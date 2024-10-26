import { useState } from "react";
import "./RestaurantOrder.css";
import ConsumptionView from "./ConsumptionView";
import Cart from "./Cart";
import CartButton from "./CartButton";

import menuCategories from "./data";

function RestaurantOrder() {
  const [selectedCategory, setSelectedCategory] = useState("donburi");
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
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
  const [allev, setallev] = useState(0);

  return (
    <div className="app-container">
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
          setAlcohoLev={setallev}
        />
      )}

      <div className="horizontal-container">
        <ConsumptionView alcLev={allev} setAlcoLev={setallev}/>
        <CartButton
          togglePopupCart={togglePopupCart}
          isPopupCart={isPopupCart}
          order_num={order.reduce((accumulator, orderItem) => {
            return accumulator + orderItem.quantity;
          }, 0)}
        />
      </div>

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
    </div>
  );
}

export default RestaurantOrder;
