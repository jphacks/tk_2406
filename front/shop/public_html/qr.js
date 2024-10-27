
config = Config()


var qrcode = new QRCode("qrcode",{width: 256, height: 256, correctLevel : QRCode.CorrectLevel.H});
const url = `${config.front_protocol}://${config.front_ip}/${12345}`

qrcode.makeCode(url);
document.getElementById("url").innerHTML = url
