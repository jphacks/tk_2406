import React from "react";
import "./FinalConfirm.css";

// eslint-disable-next-line react/prop-types
const FinalConfirm = ({ onClose, confirmOrder }) => {
  return (
    <div className="final-confirm-overlay">
      <div className="final-confirm-content">
        <button className="final-confirm-close-button" onClick={onClose}>
          ✕
        </button>
        <div className="final-confirm-body">飲むな！！😠😠😠</div>
        <button className="final-confirm-send" onClick={confirmOrder}>
          それでも注文
        </button>
      </div>
    </div>
  );
};

export default FinalConfirm;
