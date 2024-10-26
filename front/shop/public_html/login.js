
config = Config()

//エラーメッセージ表示
function setMessage(str, color = "red") {
    document.getElementById("message").innerHTML = "<div style='color:" + color + ";'>" + str + "</div>"
}

//遅延つき画面遷移
function moveSignup() {
    document.getElementById("body").innerHTML = ""
    document.getElementById("body").style = "background-color: #000000;"
    setTimeout(function () { window.location.href = "signup.html" }, 500)
}

//ログイン
function login() {
    //cookie削除
    document.cookie = "access_token=; path=/; max-age=86400;"
    document.cookie = "token_type=; path=/; max-age=86400;"

    //入力値取得
    const id = document.getElementById("user").value
    const pw = document.getElementById("pass").value
    const button = document.getElementById("login_btn")

    //入力値チェック
    if (id === "" && pw === "") {
        setMessage("ユーザー名とパスワードを入力してください")
        return
    } else if (pw === "") {
        setMessage("パスワードを入力してください")
        return
    }

    //ローディング
    button.disabled = true

    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                //ログイン成功時
                const data = JSON.parse(xhr.responseText)
                document.cookie = `access_token=${data.access_token}; path=/; max-age=86400;`
                document.cookie = `token_type=${data.token_type}; path=/; max-age=86400;`
                window.location.href = "item.html"
            } else {
                //ログイン失敗時
                setMessage('ログインに失敗しました。店舗ネームまたはパスワードを確認してください。');
                button.disabled = false
            }
        }
    }

    xhr.onerror = () => {
        //通信失敗時
        alert(xhr.readyState)
        alert(xhr.status)
        setMessage('サーバーに接続できません。ネットワーク環境をご確認ください。');
        button.disabled = false

    };

    //POST送信
    xhr.open("POST", `${config.server_protocol}://${config.server_ip}:${config.server_port}/restaurant/login`)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
    xhr.send("username=" + id + "&password=" + pw)

    //表示
    document.getElementById("pass").value = ""
    setMessage("ログイン中...", "black")

}
