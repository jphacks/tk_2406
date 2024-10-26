config = Config()

//cookie取得
let cookie_dict = {}
console.log(document.cookie)
const cookies = document.cookie;
const array = cookies.split('; ');
array.forEach(function (value) {
    const content = value.split('=');
    cookie_dict[content[0]] = content[1];
})

if (cookie_dict["access_token"] === undefined || cookie_dict["token_type"] === undefined) {
    window.location.href = "/"
}

console.log(cookie_dict)
const ele_reload = document.getElementById("reload")
const ele_foods = document.getElementById("foods")


dummy=[]
for(let i=0;i<100;i++){
    dummy.push({f_name:"ねname"+(i+1),price:100*(i+1)})
}
setFood(dummy)

function reload() {
    getAllItems()
}


function setFood(data) {
    let html = ""

    let i=0
    for (const food of data) {

        html += `
        <div class="box2" id="food${i}">
        <div style="font-size: 4vh;padding-top:5vh;margin-top:0;padding-left:15vh;">
        <span>${food.f_name}</span>
        </div>

        <span style="text-align: right;">
        <span>
        ${food.price}
        </span>
        </span>

        </div>
        `
        i++
    }

    ele_foods.innerHTML = html
}
function getAllItems() {
    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const data = JSON.parse(xhr.responseText)
                console.log(data)
            } else {
                alert(xhr.responseText)
            }
        }
    }

    xhr.onerror = () => {

    }

    xhr.open("GET", config.server_ip + ":" + config.server_port + "/restaurant/dish")
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("access_token", cookie_dict["access_token"])
    xhr.setRequestHeader("token_type", cookie_dict["token_type"])
    xhr.send()
}

function add() {
    window.location.href = "add.html"
}

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
                alert(xhr.responseText)
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

    xhr.open("POST", `http://${config.server_ip}:${config.server_port}/restaurant/login`)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
    xhr.send("username=" + id + "&password=" + pw)

    document.getElementById("pass").value = ""
    setMessage("ログイン中...", "black")

}
