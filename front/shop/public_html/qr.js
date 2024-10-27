
config = Config()



//cookie取得
let cookie_dict = {}
const cookies = document.cookie;
const array = cookies.split('; ');
array.forEach(function (value) {
    const content = value.split('=');
    let nval = content[1]
    if (nval == "bearer") nval = "Bearer";
    cookie_dict[content[0]] = nval;
})

if (cookie_dict["access_token"] === undefined || cookie_dict["token_type"] === undefined) {
    alert("セッションが期限切れです。(1)")
    window.location.href = "/"
}




const xhr = new XMLHttpRequest()
xhr.onload = function () {
    if (xhr.readyState == 4) {
        if (xhr.status == 201) {
            const data = JSON.parse(xhr.responseText)
            console.log(data)
            var qrcode = new QRCode("qrcode", { width: 256, height: 256, correctLevel: QRCode.CorrectLevel.H });
            const url = `${config.front_protocol}://${config.front_ip}/?r_id=${data.r_id}&check=${data.check}`

            qrcode.makeCode(url);
            //document.getElementById("url").innerHTML = url

        } else {
            alert("セッションが期限切れです。(0-" + xhr.status + ")")
        }
    }
}

xhr.onerror = () => {
    alert("通信に失敗しました。")
}

xhr.open("GET", `${config.server_protocol}://${config.server_ip}:${config.server_port}/restaurant/url`)
xhr.setRequestHeader("Content-Type", "application/json")
const auth = (cookie_dict["token_type"] + " " + cookie_dict["access_token"])
xhr.setRequestHeader("Authorization", auth)
xhr.send()



