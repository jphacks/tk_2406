config = Config()

let tags = []
let tag_sel = -1
let foods = []
let food_sel = -1
let addbtn_edit = false



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

console.log(cookie_dict)
const ele_reload = document.getElementById("reload")
const ele_foods = document.getElementById("foods")
const ele_tags = document.getElementById("tags")
const ele_addbtn = document.getElementById("add_btn")
const ele_chk = document.getElementById("item_chk")
const ele_deg = document.getElementById("div_deg")
const ele_vol = document.getElementById("div_vol")

getAllTags()


ele_chk.addEventListener("change", (event) => {
    ele_deg.style.display = ele_chk.checked ? "block" : "none"
    ele_vol.style.display = ele_chk.checked ? "block" : "none"
})

function del(id) {
    const res = window.confirm("削除しますか?")

    if (res) {
        const xhr = new XMLHttpRequest()

        xhr.onload = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 202) {
                    const data = JSON.parse(xhr.responseText)
                    getAllTags()
                } else {
                    alert("セッションが期限切れです。(6-" + xhr.status + ")")
                    window.location.href = "/"
                }
            }

        }


        xhr.onerror = () => {
            alert("通信に失敗しました。")
            window.location.href = "/"
        }

        xhr.open("DELETE", `${config.server_protocol}://${config.server_ip}:${config.server_port}/restaurant/dish/${foods[id].f_id}`)
        xhr.setRequestHeader("Content-Type", "application/json")
        const auth = (cookie_dict["token_type"] + " " + cookie_dict["access_token"])
        xhr.setRequestHeader("Authorization", auth)
        xhr.send()
    }
}

function toEdit() {
    ele_addbtn.innerHTML = "更新"
    addbtn_edit = true
    const rem_ele = document.getElementById("food" + food_sel)
    if (rem_ele !== null) rem_ele.style.backgroundColor = "#ff0000"
    document.getElementById("div_tag").style.display = "none"
}
function toAdd() {
    ele_addbtn.innerHTML = "新規追加"
    addbtn_edit = false

    for(let i = 0; i < foods.length; i++) {
        const rem_ele = document.getElementById("food" + i)
        if (rem_ele !== null) rem_ele.style.backgroundColor = ""
    }
    document.getElementById("div_tag").style.display = "block"

    document.getElementById("item_name_input").value = ""
    document.getElementById("item_tag").options[0].selected = true
    document.getElementById("item_value").value = ""
    document.getElementById("item_chk").checked = false
    document.getElementById("item_deg").value = ""
    document.getElementById("item_vol").value = ""
    ele_deg.style.display = ele_chk.checked ? "block" : "none"
    ele_vol.style.display = ele_chk.checked ? "block" : "none"
}


function edit(id) {
    if (food_sel >= 0) document.getElementById("food" + food_sel).style.backgroundColor = ""
    food_sel = Number(id)

    document.getElementById("item_name_input").value = foods[food_sel].f_name
    document.getElementById("item_tag").options[0].selected = true
    document.getElementById("item_value").value = foods[food_sel].price
    document.getElementById("item_chk").checked = foods[food_sel].is_alcohol
    document.getElementById("item_deg").value = foods[food_sel].degree
    document.getElementById("item_vol").value = foods[food_sel].f_quantity
    ele_deg.style.display = ele_chk.checked ? "block" : "none"
    ele_vol.style.display = ele_chk.checked ? "block" : "none"

    toEdit()
}


function clickTag(tag) {
    toAdd()

    if (tag_sel >= 0) document.getElementById("tag" + tag_sel).style.backgroundColor = ""
    tag_sel = Number(tag)
    food_sel = -1
    document.getElementById("tag" + tag_sel).style.backgroundColor = "#00ee00"
    getAllItems(tags[tag].t_id)

}


function qr() {
    window.open("qr.html")
}

function newItem() {
    if (document.getElementById("item_name_input").value !== "") {
        if (addbtn_edit) {
            //編集
            data = {}
            data["f_name"] = document.getElementById("item_name_input").value
            data["t_id"] = document.getElementById("item_tag").value
            data["price"] = Math.round(Number(document.getElementById("item_value").value))
            data["is_alcohol"] = ele_chk.checked
            if (ele_chk.checked) {
                data["degree"] = Number(document.getElementById("item_deg").value)
                data["f_quantity"] = Math.round(Number(document.getElementById("item_vol").value))
            }
            const js_data = JSON.stringify(data)
            updateItem(js_data)
        } else {
            //追加
            data = {}
            data["f_name"] = document.getElementById("item_name_input").value
            data["t_id"] = document.getElementById("item_tag").value
            data["price"] = Math.round(Number(document.getElementById("item_value").value))
            data["is_alcohol"] = ele_chk.checked
            if (ele_chk.checked) {
                data["degree"] = Number(document.getElementById("item_deg").value)
                data["f_quantity"] = Math.round(Number(document.getElementById("item_vol").value))
            }
            const js_data = JSON.stringify(data)
            toAdd()
            addItem(js_data)
        }
    }

    toAdd()
}



function addItem(json_data) {

    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 201) {
                const data = JSON.parse(xhr.responseText)

                document.getElementById("item_name_input").value = ""
                //document.getElementById("item_tag").options[0].selected = true
                document.getElementById("item_value").value = ""
                document.getElementById("item_chk").checked = false
                document.getElementById("item_deg").value = ""
                document.getElementById("item_vol").value = ""
                ele_deg.style.display = ele_chk.checked ? "block" : "none"
                ele_vol.style.display = ele_chk.checked ? "block" : "none"

                getAllTags()
            } else {
                alert("セッションが期限切れです。(5-" + xhr.status + ")")
                window.location.href = "/"
            }
        }

    }


    xhr.onerror = () => {
        alert("通信に失敗しました。")
        window.location.href = "/"
    }

    xhr.open("POST", `${config.server_protocol}://${config.server_ip}:${config.server_port}/restaurant/dish`)
    xhr.setRequestHeader("Content-Type", "application/json")
    const auth = (cookie_dict["token_type"] + " " + cookie_dict["access_token"])
    xhr.setRequestHeader("Authorization", auth)
    xhr.send(json_data)
}

function updateItem(json_data) {

    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 202) {
                const data = JSON.parse(xhr.responseText)

                document.getElementById("item_name_input").value = ""
                //document.getElementById("item_tag").options[0].selected = true
                document.getElementById("item_value").value = ""
                document.getElementById("item_chk").checked = false
                document.getElementById("item_deg").value = ""
                document.getElementById("item_vol").value = ""
                ele_deg.style.display = ele_chk.checked ? "block" : "none"
                ele_vol.style.display = ele_chk.checked ? "block" : "none"

                getAllTags()
                toAdd()

            } else {
                alert("セッションが期限切れです。(7-" + xhr.status + ")")
                window.location.href = "/"
            }
        }

    }


    xhr.onerror = () => {
        alert("通信に失敗しました。")
        window.location.href = "/"
    }

    xhr.open("PUT", `${config.server_protocol}://${config.server_ip}:${config.server_port}/restaurant/dish/${foods[food_sel].f_id}`)
    xhr.setRequestHeader("Content-Type", "application/json")
    const auth = (cookie_dict["token_type"] + " " + cookie_dict["access_token"])
    xhr.setRequestHeader("Authorization", auth)
    xhr.send(json_data)
}

function newTag() {
    const val = document.getElementById("tag_input").value

    if (val === "") return;

    const xhr = new XMLHttpRequest()

    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 201) {
                const data = JSON.parse(xhr.responseText)
                document.getElementById("tag_input").value = ""
                getAllTags()
            } else {
                alert("セッションが期限切れです。(4-" + xhr.status + ")")
                window.location.href = "/"
            }
            document.getElementById("add_tag_btn").disabled = false

        }

    }


    xhr.onerror = () => {
        alert("通信に失敗しました。")
        window.location.href = "/"
    }

    xhr.open("POST", `${config.server_protocol}://${config.server_ip}:${config.server_port}/restaurant/tag`)
    xhr.setRequestHeader("Content-Type", "application/json")
    const auth = (cookie_dict["token_type"] + " " + cookie_dict["access_token"])
    xhr.setRequestHeader("Authorization", auth)
    xhr.send(`{\"t_name\":\"${val}\"}`)
    document.getElementById("add_tag_btn").disabled = true
}


function getAllTags() {

    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const data = JSON.parse(xhr.responseText)
                tags = data
                setTags()

                if (tags.length > 0) {
                    if (tag_sel < 0) tag_sel = 0;
                    setTags()
                    getAllItems(tags[tag_sel].t_id)
                } else {
                    setTags()
                }
            } else {
                alert("セッションが期限切れです。(2-" + xhr.status + ")")
                window.location.href = "/"
            }
        }
    }

    xhr.onerror = () => {
        alert("通信に失敗しました。")
        window.location.href = "/"
    }

    xhr.open("GET", `${config.server_protocol}://${config.server_ip}:${config.server_port}/restaurant/tag`)
    xhr.setRequestHeader("Content-Type", "application/json")
    const auth = (cookie_dict["token_type"] + " " + cookie_dict["access_token"])
    xhr.setRequestHeader("Authorization", auth)
    xhr.send()
}

function getAllItems(tag = "") {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const data = JSON.parse(xhr.responseText)
                foods = data
                setFood()
            } else {
                alert("セッションが期限切れです。(3-" + xhr.status + ")")
                window.location.href = "/"
            }
        }
    }

    xhr.onerror = () => {
        alert("通信に失敗しました。")
        window.location.href = "/"
    }

    xhr.open("GET", `${config.server_protocol}://${config.server_ip}:${config.server_port}/restaurant/dish?t_id=${tag}`)
    xhr.setRequestHeader("Content-Type", "application/json")
    const auth = (cookie_dict["token_type"] + " " + cookie_dict["access_token"])
    xhr.setRequestHeader("Authorization", auth)
    xhr.send()
}




function setTags() {

    let html = ""

    let i = 0
    for (const tag of tags) {
        let background = ""
        if (i == tag_sel) {
            background = "background-color:#00ee00;"
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
        ${tag.t_name}
        </div>

        </div>
        `

        i++
    }

    ele_tags.innerHTML = html


    let html2 = ""
    for (const tag of tags) {
        html2 += `<option value="${tag.t_id}">${tag.t_name}</option>`
    }

    document.getElementById("item_tag").innerHTML = html2

}

function setFood() {
    let html = ""

    let i = 0
    for (const food of foods) {
        let background = ""

        if (i == food_sel && addbtn_edit) {
            background = "background-color:#ff0000;"
        }

        let pos = "49.5%"
        if (i % 2 == 0) {
            html += `<div style="position: relative">`
            pos = "0%"
        }

        const top = "" + (Math.floor(i / 2) * 14) + "vh"

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

        if (i % 2 == 1) {
            html += "</div>"
        }
        i++
    }
    if (i % 2 == 1) {
        html += "</div>"
    }
    const top2 = "" + (Math.floor(1 + (i - 1) / 2) * 14) + "vh"

    html += `<div style='height: 5vh;top:${top2};position:absolute;'>　</div>`



    ele_foods.innerHTML = html
}
