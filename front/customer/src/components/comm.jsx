// 通信系をひとまとめにする

import axios from "axios";

const sendOrder = async (order) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/calculate-alcohol/",
      {
        items: order,
      }
    );
    console.log("通信！", response.data.intensity);
    //   setAlcoholIntensity(response.data.intensity);
  } catch (error) {
    console.error("Error sending order:", error);
  }
};

export default sendOrder;
