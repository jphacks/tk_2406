
config = Config()

function setMessage(str, color = "red") {
    document.getElementById("message").innerHTML = "<div style='color:" + color + ";'>" + str + "</div>"
}

function moveSignup() {
    document.getElementById("body").innerHTML = ""
    document.getElementById("body").style = "background-color: #000000;"
    setTimeout(function () { window.location.href = "signup.html" }, 500)
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

    button.disabled = true

    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const data = JSON.parse(xhr.responseText)
                document.cookie = `access_token=${data.access_token}; path=/; max-age=86400;`
                document.cookie = `token_type=${data.token_type}; path=/; max-age=86400;`
                window.location.href = "item.html"
            } else {
                setMessage('ログインに失敗しました。店舗ネームまたはパスワードを確認してください。');
                button.disabled = false
            }
        }
    }

    xhr.onerror = () => {
        alert(xhr.readyState)
        alert(xhr.status)
        setMessage('サーバーに接続できません。ネットワーク環境をご確認ください。');
        button.disabled = false

    };

    xhr.open("POST", `${config.server_protocol}://${config.server_ip}:${config.server_port}/restaurant/login`)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
    xhr.send("username=" + id + "&password=" + pw)

    document.getElementById("pass").value = ""
    setMessage("ログイン中...", "black")

}
