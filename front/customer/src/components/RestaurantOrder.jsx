import { useState } from "react";
import styles from "./RestaurantOrder.module.css";
import ConsumptionView from "./ConsumptionView";
import Cart from "./Cart";
import CartButton from "./CartButton";
import menuCategories from "./data";

function RestaurantOrder() {
  const [selectedCategory, setSelectedCategory] = useState("donburi");
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
  const [isPopupCart, togglePopupCart] = useState(false);
  const [allev, setallev] = useState(0);

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
    <div className={styles.appContainer}>
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

      <div className={styles.horizontalContainer}>
        <ConsumptionView alcLev={allev} setAlcoLev={setallev} />
        {/* ロゴ表示 */}
        <img src="images/logo.png" alt="logo" className={styles.logo} />
        <div className={styles.cartContainer}>
          <div className={styles.cartContainer}>
            <div className={styles.orderConfirmText}>注文確定はこちら</div>
            <CartButton
              togglePopupCart={togglePopupCart}
              isPopupCart={isPopupCart}
              order_num={order.reduce((accumulator, orderItem) => {
                return accumulator + orderItem.quantity;
              }, 0)}
            />
            <div className={styles.orderTotal}>
              {order.reduce((accumulator, orderItem) => {
                return accumulator + orderItem.price * orderItem.quantity;
              }, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* カテゴリ選択部分 */}
      <div className={styles.categoryButtons}>
        <button
          className={styles.categoryButton}
          onClick={() => setSelectedCategory("donburi")}
        >
          どんぶり
        </button>
        <button
          className={styles.categoryButton}
          onClick={() => setSelectedCategory("chicken")}
        >
          鶏系
        </button>
        <button
          className={styles.categoryButton}
          onClick={() => setSelectedCategory("otsumami")}
        >
          おつまみ
        </button>
        <button
          className={styles.categoryButton}
          onClick={() => setSelectedCategory("alcohol")}
        >
          酒類
        </button>
        <button
          className={styles.categoryButton}
          onClick={() => setSelectedCategory("nonAlcohol")}
        >
          ノンアル
        </button>
      </div>

      {/* メニュー表示部分 */}
      <div className={styles.menuGrid}>
        {currentMenuItems.map((item) => (
          <div className={styles.menuCard} key={item.id}>
            <img src={item.img} alt={item.name} className={styles.menuImg} />
            <div className={styles.menuDetails}>
              <h3 className={styles.menuName}>{item.name}</h3>
              <p className={styles.menuPrice}>¥{item.price}</p>

              <button
                onClick={() => addToOrder(item)}
                className={styles.addButton}
              >
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
