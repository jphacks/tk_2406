import css from "./CartButton.module.css";

// eslint-disable-next-line react/prop-types
const CartButton = ({ togglePopupCart, isPopupCart, order_num }) => {
  return (
    <button
      onClick={() => togglePopupCart(!isPopupCart)}
      className={css.button}
    >
      {" "}
      <img
        src="images/cart.png"
        alt="shoppingCart"
        className={css.imgButton}
      />{" "}
      <div className={css.badge}> {order_num}</div>
    </button>
  );
};

export default CartButton;
