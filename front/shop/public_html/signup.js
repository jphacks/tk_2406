
config=Config()

function setMessage(str,color="red") {
    document.getElementById("message").innerHTML = "<div style='color:"+color+";'>" + str + "</div>"
}
function moveLogin() {
    document.getElementById("body").innerHTML=""
    document.getElementById("body").style="background-color: #000000;"
    setTimeout(function(){window.location.href = "/"}, 500)
}

function login() {
    document.cookie = "access_token=; path=/; max-age=86400;"
    document.cookie = "token_type=; path=/; max-age=86400;"
    const id = document.getElementById("user").value
    const pw = document.getElementById("pass").value
    const button = document.getElementById("login_btn")
    if (id === "" && pw === "") {
        setMessage("ユーザー名とパスワードを入力してください")
        return
    } else if (pw === "") {
        setMessage("パスワードを入力してください")
        return
    }

    button.disabled=true

    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 201) {
                const data = JSON.parse(xhr.responseText)
                document.cookie = `access_token=${data.access_token}; path=/; max-age=86400;`
                document.cookie = `token_type=${data.token_type}; path=/; max-age=86400;`
                window.location.href = "item.html"
            } else {
                setMessage('この店ネームは既に使用されているため登録できません。');
                button.disabled=false
            }
        }
    }

    xhr.onerror = () => {
        setMessage('サーバーに接続できません。ネットワーク環境をご確認ください。');
        button.disabled=false

    };

    xhr.open("POST", `${config.server_protocol}://${config.server_ip}:${config.server_port}/restaurant/signup`)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(`{\"r_name\":\"${id}\",\"password\":\"${pw}\"}`)

    document.getElementById("pass").value = ""
    setMessage("登録中...", "black")

    
}
