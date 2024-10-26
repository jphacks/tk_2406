/* eslint-disable react/prop-types */
import "./Cart.css";
import { useState } from "react";

import FinalConfirm from "./FinalConfirm";
import axios from "axios";

function getAlcoholLevel(order) {
  if (order.length > 0) {
    console.log(order[0]);
    if (order[0].name === "白ワイン") {
      return 2;
    }
  }
  return Math.floor(Math.random() * 2);
}
function Cart({
  order,
  total,
  decreaseQuantity,
  increaseQuantity,
  removeFromOrder,
  setOrder,
  setTotal,
  onClose,
  setAlcohoLev
}) {
  const [isFinalConfirmPopup, setFinalConfirmPopup] = useState(false);

  const sendOrder = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/calculate-alcohol/",
        {
          items: order,
        }
      );
      console.log(response.data.intensity);
      //   setAlcoholIntensity(response.data.intensity);
    } catch (error) {
      console.error("Error sending order:", error);
    }
  };
  const confirmOrder = () => {
    sendOrder();
    console.log("注文しました");
    setTimeout(() => {
      setOrder([]);
      setTotal(0);
    }, 1000);
  };
  const checkOrder = () => {
    // 注文を送信する関数
    const alcoholLevel = getAlcoholLevel(order);
    setAlcohoLev(alcoholLevel);
    console.log("lev", alcoholLevel);

    if (alcoholLevel == 2) {
      console.log("final");
      setFinalConfirmPopup(true);
    } else {
      confirmOrder();
    }
  };

  return (
    <div className="cart-popup">
      {isFinalConfirmPopup && (
        <FinalConfirm
          onClose={() => {
            setFinalConfirmPopup(false);
          }}
          confirmOrder={confirmOrder}
        />
      )}
      {/* バツボタン */}
      <button className="cart-close-btn" onClick={() => onClose(false)}>
        ✕
      </button>

      {/* ヘッダー */}
      <div className="cart-header">
        <h2 className="cart-title">注文リスト</h2>
      </div>

      {/* 注文商品リスト */}
      <div className="cart-item-list">
        {order.length > 0 ? (
          order.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.img} alt={item.name} className="cart-item-img" />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">¥{item.price}</p>
              </div>
              <div className="cart-quantity-control">
                <button
                  onClick={() => decreaseQuantity(item)}
                  className="cart-quantity-btn"
                >
                  -
                </button>
                <span className="cart-quantity">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item)}
                  className="cart-quantity-btn"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromOrder(item)}
                className="cart-remove-btn"
              >
                削除
              </button>
            </div>
          ))
        ) : (
          <p className="cart-empty-msg">注文する料理はまだありません</p>
        )}
      </div>

      {/* フッター */}
      <div className="cart-footer">
        <h2 className="cart-total">合計額: ¥{total}</h2>
        <button onClick={checkOrder} className="cart-confirm-btn">
          注文確定
        </button>
      </div>
    </div>
  );
}

export default Cart;
