let read_again = false;
let reading = false;
let chatOldTime = 0;
let chatInterval = null;
let searching = false;

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
    if (e.value.length > 2) {
        searching = true;
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
    } else {
        searching = false;
    }
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
                if (reading) {
                    read_again = true;
                } else {
                    readMsgs();
                }
            }
        });
    }
}


function readMsgs(uid) {
    if (!reading) {
        reading = true;
        if (uid == undefined) {
            uid = document.getElementById("uid").value;
        }
        $.ajax({
            url: "//palpad.pokeheroes.com/loadchat.php?" + Math.random(),
            type: "POST",
            data: {
                partner: uid,
                date_lim: ">" + chatOldTime,
                upd: "y"
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                addMessagesToChat(data);
                let oldTime = data.match(/prv_update = (\d+);/);
                if (oldTime != null) {
                    chatOldTime = oldTime[1];
                    scrollDown();
                }
                reading = false;
                if (read_again) {
                    read_again = false;
                    readMsgs();
                }
            }
        });
    }
}

function addMessagesToChat(data) {
    let msgs = data.match(/<div class="chat_msg">.+?<\/div><\/div>/gs);
    let lastUid = null;
    let msgOuter = null;
    let elMsg = null;
    let picspace = null;
    let msgspace = null;
    if (msgs !== null) {
        for (let i = 0; i < msgs.length; i++) {
            let m = msgs[i];
            let imgsrc = m.match(/\/\/upload.+?uid=(\d+).*?sm/);
            let uid = imgsrc[1];
            imgsrc = imgsrc[0];
            let time = m.match(/>(\d+:\d+)<\/span>/);
            if (time !== null) {
                time = time[1];
            } else {
                time = m.match(/>(\d+\/\d+), (\d+:\d+)<\/span>/);
                if (time !== null) {
                    time = time[1] + "<br>" + time[2];
                }
            }
            let msg = m.match(/<\/span>(.+?)<\/div>/s);
            if (msg !== null) {
                msg = msg[1];
                msg = msg.replace(/\[img](.+?)\[\/img]/,
                    "<img src='$1' onload='scrollDown()' style='max-height: 300px; max-width: 100%;'/>");
            }
            let msgParts = msg.split("<br><br>");
            for (let j = 0; j < msgParts.length; j++) {
                msg = msgParts[j];
                if (lastUid != uid) {
                    if (elMsg !== null) {
                        // finish element and add to chat
                        document.getElementById("chat").appendChild(msgOuter);
                    }
                    // make a new element
                    msgOuter = document.createElement("div");
                    elMsg = document.createElement("div");
                    picspace = null;
                    msgspace = null;
                    msgOuter.appendChild(elMsg);
                }
                lastUid = uid;
    
                if (uid == document.getElementById("uid").value) {
                    // other
                    msgOuter.setAttribute("class", "msg_wrapper_outer mwoo");
                    elMsg.setAttribute("class", "msg_wrapper_inner other");
                    if (picspace == null) {
                        picspace = document.createElement("div");
                        picspace.setAttribute("class", "picspace");
                        picspace.innerHTML = "<div class='picrel'><img class='pic' src='" + imgsrc + "' /></div>";
                        elMsg.appendChild(picspace);
                    }
                    if (msgspace == null) {
                        msgspace = document.createElement("div");
                        msgspace.setAttribute("class", "msgspace mso");
                        elMsg.appendChild(msgspace);
                        msgspace.innerHTML = addMsgBlockO(msg, time);
                    } else {
                        msgspace.innerHTML += addMsgBlockO(msg, time);
                    }
        
                } else {
                    // you
                    msgOuter.setAttribute("class", "msg_wrapper_outer mwoy");
                    elMsg.setAttribute("class", "msg_wrapper_inner you");
    
                    if (msgspace == null) {
                        msgspace = document.createElement("div");
                        msgspace.setAttribute("class", "msgspace msy");
                        elMsg.appendChild(msgspace);
                        msgspace.innerHTML += addMsgBlockY(msg, time);
                    } else {
                        msgspace.innerHTML += addMsgBlockY(msg, time);
                    }
                    if (picspace == null) {
                        picspace = document.createElement("div");
                        picspace.setAttribute("class", "picspace");
                        picspace.innerHTML = "<div class='picrel'><img class='pic' src='" + imgsrc + "' /></div>";
                        elMsg.appendChild(picspace);
                    }
                }
            }
        }
        if (elMsg !== null) {
            // finish element and add to chat
            document.getElementById("chat").appendChild(msgOuter);
        }
    }
}
function addMsgBlockY(msg, time) {
    return "<div class='msgblock you mby'><div class='msg'>" + msg + "</div>" + addTimeField(time) + "</div>";
}
function addMsgBlockO(msg, time) {
    return "<div class='msgblock other mbo'>" + addTimeField(time) + "<div class='msg'>" + msg + "</div></div>";
}
function addTimeField(time) {
    return "<div class='timespace'><div class='timerel'><span class='time'>" + time + "</span></div></div>";
}

function scrollDown() {
    let chat = document.getElementById("chat");
    chat.scrollTop = chat.scrollHeight;
}

setTimeout(readMsgs, 500);
chatInterval = setInterval(readMsgs, 3000);