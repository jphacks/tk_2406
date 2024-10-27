config = Config()

let tags=[]
let tag_sel=-1
let foods=[]
let food_sel=-1
let addbtn_edit = false



//cookie取得
let cookie_dict = {}
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
const ele_tags = document.getElementById("tags")
const ele_addbtn = document.getElementById("add_btn")

//仮
for(let i=0;i<100;i++){
    foods.push({f_name:i+"ねnameあああああああああああああああああああああああああああああああああああああああああああああああああああああ"+(i+1),price:100*(i+1)})
}
setFood()
tags=["A","BB","CCC","DDDD","BB","CCC","DDDD","BB","CCC","DDDD","BB","CCC","DDDD"]
setTags()

getAllTags()
getAllItems()

function del(id){
    const res=window.confirm(""+id+": 削除しますか?")
    alert(res)
}


function edit(id){
    if(food_sel>=0) document.getElementById("food"+food_sel).style.backgroundColor=""
    food_sel=Number(id)
    ele_addbtn.innerHTML = "更新"
    addbtn_edit = true
    document.getElementById("food"+food_sel).style.backgroundColor="#ff0000"
}

function setTags(){

    let html = ""

    let i=0
    for (const tag of tags) {
        let background=""
        if(i==tag_sel){
            background="background-color:#ff0000;"
        }

        html += `
        <div class="box4" id="tag${i}" style="left:0;position:relative;${background}" onclick="clickTag('${i}')">

        <div style="
        font-size: 2.7vh;
        margin-top:1vw;
        margin-left:0;
        padding-top:1vh;
        position: absolute;
        width: 20vw;
        height: 8vh;
        overflow-wrap: break-word;
        overflow: hidden;
        ">
        ${tag}
        </div>

        </div>
        `

        i++
    }

    ele_tags.innerHTML = html



}

function getAllTags(){

}

function setFood() {
    let html = ""

    let i=0
    for (const food of foods) {
        let background=""

        if(i==food_sel){
            background="background-color:#ff0000;"
        }

        let pos="49.5%"
        if(i%2==0){
            html+=`<div style="position: relative">`
            pos="0%"
        }

        const top=""+(Math.floor(i/2)*14)+"vh"

        html += `
        <div class="box2" id="food${i}" style="left:${pos};top:${top};position:absolute;${background}">

        <div style="
        left: 0.5vh;
        top: 0.5vh;
        position: absolute;
        ">
        <img src="img/food.png" style="width: 12vh; height: 12vh;">
        </div>

        <div style="
        right: 0.5vh;
        top: 2vh;
        position: absolute;
        ">
        <img src="img/del.png" style="width: 4vh; height: 4vh;" onclick="del(${i})" class="imgbtn">
        </div>

        <div style="
        right: 5vh;
        top: 2vh;
        position: absolute;
        ">
        <img src="img/edit.png" style="width: 4vh; height: 4vh;" onclick="edit(${i})" class="imgbtn">
        </div>

        <div style="
        font-size: 2.7vh;
        margin-top:0;
        margin-left:15vh;
        padding-top:1vh;
        position: absolute;
        width: calc(100% - 13vh - 12vh);
        height: 10vh;
        overflow-wrap: break-word;
        overflow: hidden;
        ">
        ${food.f_name}
        </div>

        <div style="
        font-size: 3vh;
        position: absolute;
        bottom: 2vh;
        right: 1vh;
        ">
        ￥${food.price}
        </div>

        </div>
        `

        if(i%2==1){
            html+="</div>"
        }
        i++
    }
    if(i%2==1){
        html+="</div>"
    }
    const top2=""+(Math.floor(1+(i-1)/2)*14)+"vh"

    html+=`<div style='height: 5vh;top:${top2};position:absolute;'>　</div>`



    ele_foods.innerHTML = html
}
function getAllItems(tag) {
    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const data = JSON.parse(xhr.responseText)
                console.log(data)
            } else {
                alert(""+xhr.status+"\n"+xhr.responseText)
            }
        }
    }

    xhr.onerror = () => {
        ele_foods.innerHTML = "<div style='color:red;font-size: 5vh;'>サーバーに接続できません。ネットワーク環境をご確認ください。</div>"
    }

    xhr.open("GET", `${config.server_protocol}://${config.server_ip}:${config.server_port}/restaurant/dish`)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("access_token", cookie_dict["access_token"])
    xhr.setRequestHeader("token_type", cookie_dict["token_type"])
    xhr.send()
}

function clickTag(tag) {
    if(tag_sel>=0) document.getElementById("tag"+tag_sel).style.backgroundColor=""
    tag_sel=Number(tag)
    food_sel=-1
    document.getElementById("tag"+tag_sel).style.backgroundColor="#ff0000"
    setFood()
}

function newItem() {
    if(food_sel>=0) document.getElementById("food"+food_sel).style.backgroundColor=""
    addbtn_edit = false
    ele_addbtn.innerHTML = "新規追加"
}

function qr() {
    window.location.href = "qr.html"
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
