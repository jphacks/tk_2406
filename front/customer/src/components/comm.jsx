// 通信系をひとまとめにする

import axios from "axios";

const ip = "10.10.2.47:8000";
const schema = "http://";

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
        `${schema}${ip}/customer/login`,
        new URLSearchParams({ username: id, password: pw }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      });
  } catch (error) {
    console.log("Error sending order:", error);
  }
  return false;
};
// is checked が送られる
// ログイン時に前回の飲み会を評価する
// jwt tokenと 前回の飲み会が良し悪し
export const getCustomerReview = async (order) => {
  try {
    const response = await axios.get(
      `${schema}${ip}/customer/evaluate`,
      new URLSearchParams({}),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      }
    );
    return response.data.lev;
  } catch (error) {
    console.error("Error sending order:", error);
  }
};
export default sendOrder;
