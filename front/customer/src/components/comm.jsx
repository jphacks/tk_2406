// 通信系をひとまとめにする

import axios from "axios";
const API_URL = "http://10.10.2.47:8000";

// POST customer/order/{r_id}'
// 説明: 料理の注文
// リクエスト:
// ヘッダ: JWTトークン
// ボディ: { "c_id", [{ "f_id" },]}
// レスポンス:
// ステータスコード: 200 OK
export async function postCustomerOrder(order) {}

// Question これの使い道は？
// 'POST customer/status/{r_id}'
// 説明: 注文した場合の客の状態の変化
// リクエスト:
// ヘッダ: JWTトークン
// ボディ: { "status"}
// レスポンス:
// ステータスコード: 200 OK
export async function postCustomerStatus() {}

// 'GET customer/status'
// 説明: 現在の客の状態
// リクエスト:
// ヘッダ: JWTトークン
// レスポンス:
// ステータスコード: 200 OK
// ボディ: { "status" }
export async function getCustomerStatus() {
  return "status";
}

// GET customer/evaluate'
// 説明: 前回の店が評価済かの確認
// リクエスト:
// ヘッダ: JWTトークン
// ボディ: { "is_evaluated" }
// レスポンス:
// ステータスコード: 200 OK

export async function getCustomerEvaluate() {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await axios.get(API_URL + "/customer/evaluate", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error in getCustomerEvaluate:", error);
    throw error;
  }
  return "status";
}

// 'POST customer/evaluate'
// 説明: 前回の店の評価
// リクエスト:
// ヘッダ: JWTトークン
// ボディ: { "is_good" }
// レスポンス:
// ステータスコード: 200 OK
export async function postCustomerEvaluate(evaldd) {
  return "status";
}

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
    console.log("trying login");
    await axios.post(
      `${API_URL}/customer/login`,
      new URLSearchParams({
        grant_type: "password",
        username: id,
        password: pw,
        scope: "",
        client_id: "string",
        client_secret: "string",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
      }
    );

((response) => {
        console.log("response here");
        if (response.status === 200) {
          const { access_token } = response.data;
          localStorage.setItem("jwtToken", access_token);
          return true;
        } else {
          console.log("fjlajfla");
          localStorage.setItem("jwtToken", "jdfoiweroiojfioaji");
          return false;
        }
      });
  } catch (error) {
    console.log("Error Catch");

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
