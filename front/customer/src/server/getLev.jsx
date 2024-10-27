export default function getAlcoholLevel(order) {
  if (order.length > 0) {
    if (order[0].name === "白ワイン") {
      return 2;
    }
    if (order[0].name === "赤ワイン") {
      return 1;
    }
    if (order[0].name === "緑茶") {
      return 0;
    }
  }
  return 0;
}
