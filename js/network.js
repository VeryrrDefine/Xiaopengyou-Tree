var network_temp = {
    rank_pos: Infinity,
    rank_players: [],
    loaded: false,
    token: 0,
    unload_tip: "未连接至服务器",
    username: "",
    password: "",
    tip: ""
}
addLayer("NW", {
    name: "网络", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "NW", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(0),
        }
    },
    tooltip() {
        return "网络"
    },
    color: "#723f89",
    nodeStyle() {
        return {
            "background": "radial-gradient(#723f89, #431c53)",
        }
    },
    requires: new ExpantaNum(0), // Can be a function that takes requirement increases into account
    resource: "",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have

    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() { return 1 },
    achievements: {
    },
    tabFormat: {
        "网络": {
            content: [
                ["raw-html", function () {
                    return "注： 星期一——星期五服务器大部分时间不在线"
                }],
                ["raw-html", function () {
                    return location.protocol == "https:" ? "由于浏览器的机制，且服务器使用http协议，当前暂不支持网络功能" : ""
                }],
                ["raw-html", function () {
                    return "send mail to hrp1167@outlook.com to register(take username password there)"
                }],
                ["raw-html", function () {
                    if (network_temp.loaded) return `加载成功！`
                    return "网络功能并没有加载: "+network_temp.unload_tip
                }],
                ["raw-html", function () {
                    return network_temp.tip;
                }],
                "clickables"
            ]
        },
    },
    /*
    
loadNW().catch(function (){
    //服务器宕机了
    network_temp.loaded = false;
    network_temp.unload_tip = "服务器疑似宕机"
});
    */
    clickables: {
        11: {
            display() {
                return "连接"
            },
            onClick() {
                network_temp.unload_tip = "正在连接服务器"
                loadNW().catch(function (){
                    //服务器宕机了
                    network_temp.loaded = false;
                    network_temp.unload_tip = "服务器疑似宕机"
                });
            },
            canClick() {
                return !network_temp.loaded
            },
            style() {
                return {
                    "font-size": "20px"
                }
            }
        },
        12: {
            display() {
                return "将存档上传至服务器"
            },
            onClick() {
                saveCloud()
            },
            canClick() {
                return network_temp.loaded
            },
            style() {
                return {
                    "font-size": "20px"
                }
            }
        },
        13: {
            display() {
                return "输入用户密码"
            },
            onClick() {
                let username = prompt("用户名")
                let password = prompt("密码")
                network_temp.username=username;
                network_temp.password = password;
            },
            canClick() {
                return !network_temp.loaded
            },
            style() {
                return {
                    "font-size": "20px"
                }
            }
        },
        21: {
            display() {
                return "登出"
            },
            onClick() {
                network_temp.loaded = false
                logOut()

            },
            canClick() {
                return network_temp.loaded
            },
            style() {
                return {
                    "font-size": "20px"
                }
            }
        },
    }
});
function saveCloud() {
    return fetch(NETWORK_BACKEND_URL+"/xpyapi/updatesave", {
        method: "POST",
        body: JSON.stringify({
            savedata: player,
            token: network_temp.token
        })
    }).then(function(x) {
        return x.json()
    },function(){
        //服务器宕机了
        network_temp.loaded = false;
        network_temp.unload_tip = "服务器疑似宕机"
        clearInterval(a)
    }).then(function (x){
        if (x.code=="400" && x.message=="too fast"){
            network_temp.tip = ("不要存的太快")
        } else if (x.code=="200" && x.message=="Success"){
            network_temp.tip = ("成功")
        }
        
    })

}
function logOut() {
    return fetch(NETWORK_BACKEND_URL+"/xpyapi/logout", {
        method: "POST",
        body: JSON.stringify({
            username: network_temp.username,
            password: network_temp.password,
            token: network_temp.token,
        })
    }).catch(function(){
        //服务器宕机了
        network_temp.loaded = false;
        network_temp.unload_tip = "服务器疑似宕机"
        clearInterval(a)
    })

}
var NETWORK_BACKEND_URL = "http://47.109.27.164:9527";
(function (){
    let username = localStorage.getItem("XPYtreeusername")
    let password = localStorage.getItem("XPYtreepassword")
    if (username !== null) network_temp.username = username;
    if (password !== null) network_temp.password = password; 
})()
async function loadNW() {
    let fetch1 = await fetch(NETWORK_BACKEND_URL + "/xpyapi/login", {
        method: "POST",
        body: JSON.stringify({
            username: network_temp.username,
            password: network_temp.password,
            
        })
    });
    let jsondata = await fetch1.json();
    if (jsondata.code != "200") {
        network_temp.unload_tip = "用户名或密码错误"
        return;
    }
    localStorage.setItem("XPYtreeusername", network_temp.username)
    localStorage.setItem("XPYtreepassword", network_temp.password)
    network_temp.token = jsondata.message.token
    network_temp.loaded = true


}
