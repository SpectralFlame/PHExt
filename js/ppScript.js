
let chatOldTime = 0;
let chatInterval = null;

function openPrivateChat(name, uid) {
    document.getElementById("username").innerHTML = name;
    document.getElementById("uid").value = uid;
    chatOldTime = 0;
    document.getElementById("chat").innerHTML = "";
    if (chatInterval != null) {
        clearInterval(chatInterval);
        chatInterval = null;
    }
    readMsgs();
    console.log("readMsgs started");
    chatInterval = setInterval(readMsgs, 3000);
}

function searchUser(e) {
    $.ajax({
        url: 'http://palpad.pokeheroes.com/search_user.php',
        type: 'POST',
        data: {
            search: e.value
        },
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            document.getElementById('users').innerHTML = data;
        }
    });
}

function sendMsg(e, obj) {
    if (e.keyCode == 13) {
        $.ajax({
            url: "//palpad.pokeheroes.com/sendmsg.php",
            type: "POST",
            data: {
                partner: document.getElementById("uid").value,
                msg: obj.value
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                obj.value = "";
                readMsgs();
            }
        });
    }
}


function readMsgs() {
    $.ajax({
        url: "//palpad.pokeheroes.com/loadchat.php?" + Math.random(),
        type: "POST",
        data: {
            partner: document.getElementById("uid").value,
            date_lim: ">" + chatOldTime,
            upd: "y"
        },
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            let chat = document.getElementById("chat");
            //chat.innerHTML += data;
            convertMsg(data);
            let oldTime = data.match(/prv_update = (\d+);/);
            if (oldTime != null) {
                chatOldTime = oldTime[1];
                chat.scrollTop = chat.scrollHeight;
            }
        }
    });
}

function convertMsg(data) {
    let msgs = data.match(/<div class="chat_msg">.+?<\/div><\/div>/gs);
    let lastUid = null;
    let elMsg = null;
    let picspace = null;
    let elo = null;
    if (msgs !== null) {
        for (let i = 0; i < msgs.length; i++) {
            let m = msgs[i];
            console.log(m);
            let imgsrc = m.match(/\/\/upload.+?uid=(\d+).*?sm/);
            let uid = imgsrc[1];
            imgsrc = imgsrc[0];
            console.log(uid);
            let time = m.match(/>(\d+:\d+)<\/span>/);
            if (time !== null) {
                time = time[1];
            } else {
                time = m.match(/>(\d+\/\d+), (\d+:\d+)<\/span>/);
                if (time !== null) {
                    time = time[1] + "<br>" + time[2];
                }
            }
            console.log(time);
            let msg = m.match(/<\/span>(.+?)<\/div>/s);
            if (msg !== null) {
                msg = msg[1];
                msg = msg.replace(/\[img](.+?)\[\/img]/, "<img src='$1' style='max-height: 300px'/>");
            }
            console.log(msg);
            if (lastUid != uid) {
                if (elMsg !== null) {
                    // finish element and add to chat
                    document.getElementById("chat").appendChild(elMsg);
                }
                // make a new element
                elMsg = document.createElement("div");
                picspace = null;
                elo = null;
            }
            
            console.log(uid);
            console.log(document.getElementById("uid").value);
            
            if (uid == document.getElementById("uid").value) {
                // other
                console.log("other");
                elMsg.setAttribute("class", "msg_wrapper");
                if (picspace == null) {
                    picspace = document.createElement("div");
                    picspace.setAttribute("class", "picspace");
                    picspace.innerHTML = "<img class='pic' src='" + imgsrc + "' />";
                    elMsg.appendChild(picspace);
                }
                if (elo == null) {
                    elo = document.createElement("div");
                    elo.setAttribute("class", "msg");
                    elMsg.appendChild(elo);
                    elo.innerHTML = "<div class='chat_txt other'><span class='time to'>" + time + "</span>" + msg + "</div>";
                } else {
                    elo.innerHTML += "<div class='chat_txt other'><span class='time to'>" + time + "</span>" + msg + "</div>";
                }
                
            } else {
                // you
                console.log("you");
                elMsg.setAttribute("class", "msg");
                elMsg.innerHTML += "<div class='chat_txt you'>" + msg + "<span class='time ty'>" + time + "</span></div>";
            }
        }
        if (elMsg !== null) {
            // finish element and add to chat
            document.getElementById("chat").appendChild(elMsg);
        }
    }
}
