/* eslint-disable react/prop-types */
import "./Cart.css";
import { useState } from "react";

import FinalConfirm from "./FinalConfirm";
import sendOrder from "./comm";

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
  setAlcohoLev,
}) {
  const [isFinalConfirmPopup, setFinalConfirmPopup] = useState(false);


  const confirmOrder = () => {
    sendOrder(order);
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
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const handleOrderClick = () => {
    checkOrder();
    setIsOrderComplete(true);
    setTimeout(() => {
      setIsOrderComplete(false);
      onClose();
    }, 2000); // 購入完了アニメーション
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
        <button onClick={handleOrderClick} className="cart-confirm-btn">
          注文確定
        </button>
        {isOrderComplete && (
          <div className="order-complete">
            <div className="checkmark-animation">
              <svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="checkmark-check"
                  fill="none"
                  d="M14 27l7 7 16-16"
                />
              </svg>
            </div>
            <p className="complete-message">注文完了しました！</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
