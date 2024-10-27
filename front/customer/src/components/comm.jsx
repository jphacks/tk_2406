// 通信系をひとまとめにする

import axios from "axios";
// 注文を送って、サーバから飲酒量状態(0,1,2)をもらい、sendOrderの戻り値とする。
const sendOrder = async (order) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/calculate-alcohol/",
      {
        items: order,
      }
    );
    console.log("通信！", response.data.intensity);
    return response.data.lev;
  } catch (error) {
    console.error("Error sending order:", error);
  }
};

// 注文確定する。
export const confirmOrder = async (order) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/calculate-alcohol/",
      {
        items: order,
      }
    );
    console.log("通信！", response.data.intensity);
    return response.data.lev;
  } catch (error) {
    console.error("Error sending order:", error);
  }
};

// ログインする
// pwはハッシュ化して送る
// 20コードならOKログイン成功
export const tryLogin = async (id, pw) => {
  try {
    axios
      .post(
        "http://10.10.2.47:8000/customer/login",
        new URLSearchParams({ username: id, password: pw }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        console.log(response);
        return response;
      });
  } catch (error) {
    console.log("Error sending order:", error);
  }
};
export default sendOrder;
