/* eslint-disable react/prop-types */
import { useState } from "react";
import "./Cart.css";
import axios from "axios";


function Cart({
  order,
  total,
  decreaseQuantity,
  increaseQuantity,
  removeFromOrder,
  setOrder,
  setTotal
}) {
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
    // 注文を送信する関数
    sendOrder();
    // setIsPopupVisible(true);
    setTimeout(() => {
    //   setIsPopupVisible(false);
      setOrder([]);
      setTotal(0);
    }, 2000); // ポップアップが2秒間表示される
  };
  return (
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
              </div>
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
  );
}

export default Cart;
