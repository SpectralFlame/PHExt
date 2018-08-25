let read_again = false;
let reading = false;
let chatOldTime = 0;
let chatInterval = null;
let userInterval = null;
let searching = false;
let isActive = true;
let notifyTimer = null;
let newMsgs = [];

function openPrivateChat(name, uid) {
    if (searching) {
        document.getElementById("tbxSearch").value = "";
        searching = false;
    }
    document.getElementById("username").innerHTML = name;
    document.getElementById("uid").value = uid;
    chatOldTime = 0;
    document.getElementById("chat").innerHTML = "";
    if (chatInterval != null) {
        clearInterval(chatInterval);
        chatInterval = null;
    }
    readMsgs();
    chatInterval = setInterval(readMsgs, 3000);
    document.getElementById("tbxChat").focus();
    notify(false);
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
function updateUsers() {
    if (!searching) {
        $.ajax({
            url: "//palpad.pokeheroes.com/conv_list.php?" + Math.random(),
            type: "POST",
            data: {
                activeLogin: true
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                addUsers(data);
            }
        });
    }
}

function addUsers(data) {
    $("#users").text("");
    let newMsg = false;
    let convArr = JSON.parse(data)["convlist"];
    for (let i = convArr.length - 1; i >= 0; i--) {
        if(convArr[i].isNew) {
            newMsg = true;
            if (convArr[i].Uid in newMsgs) {
                if (newMsgs[convArr[i].Uid] !== convArr[i].lastMsg) {
                    notify();
                    newMsgs[convArr[i].Uid] = convArr[i].lastMsg;
                }
            } else {
                newMsgs[convArr[i].Uid] = convArr[i].lastMsg;
                notify();
            }
        }
        $("#users").prepend('<a class="friend_chat" onclick="openPrivateChat(\'' + convArr[i].Name + '\', ' + convArr[i].Uid + ');">' +
            '<span class="img"><img src="' + convArr[i].Avatar + '"></span>' +
            '<img src="//staticpokeheroes.com/img/misc/' + convArr[i].On + '.png"> ' + (convArr[i].isNew ? '<span style="font-size: 6pt; color: red"><b>NEW</b></span> ' : '') + '' + convArr[i].Name + '<br>' +
            (convArr[i].lastMsg >= 0 ? '<span class="last_msg active_countdown" data-countto="' + convArr[i].lastMsg + '" data-dateformat="1">' + getDateCountdownText(convArr[i].lastMsg, 1) + '</span>' : '') +
            '</a>');
    }
}
function getDateCountdownText(t, dateFormat) {
    let txt;
    let diff;
    let subfix = "";
    let praefix = "";
    let years, months, days, hours, minutes, seconds;
    let var_used, dateformat;
    let curr_unix = Math.round((new Date()).getTime() / 1000);
    if (t > 0) {
        diff = t - curr_unix;
        if (diff < 0) {
            subfix = "";
            praefix = "ago";
            diff = -diff;
        } else {
            subfix = "In ";
            praefix = ""
        }
        years = Math.floor(diff / (60 * 60 * 24 * 365));
        diff = diff - (years * 60 * 60 * 24 * 365);
        months = Math.floor(diff / (60 * 60 * 24 * 30.5));
        diff = Math.round(diff - (months * 60 * 60 * 24 * 30.5));
        days = Math.floor(diff / (60 * 60 * 24));
        diff = diff - (days * 60 * 60 * 24);
        hours = Math.floor(diff / (60 * 60));
        diff = diff - (hours * 60 * 60);
        minutes = Math.floor(diff / 60);
        diff = diff - (minutes * 60);
        seconds = diff;
        if (dateFormat != null && dateFormat == 1) {
            var_used = 1;
            dateformat = 1;
        } else {
            dateformat = 2;
            var_used = 0;
        }
        txt = "";
        if (years > 0) {
            if (years > 1) {
                txt = txt + years + " years "
            } else {
                txt = txt + "1 year "
            }
            var_used++
        }
        if ((var_used < 2 && months > 0) || (var_used == 1 && dateformat == 2)) {
            if (var_used == 1 && dateformat == 2) {
                txt = txt + "and "
            }
            if (months > 1) {
                txt = txt + months + " months "
            } else {
                txt = txt + "1 month "
            }
            var_used++
        }
        if ((var_used < 2 && days > 0) || (var_used == 1 && dateformat == 2)) {
            if (var_used == 1 && dateformat == 2) {
                txt = txt + "and "
            }
            if (days > 1) {
                txt = txt + days + " days "
            } else {
                txt = txt + "1 day "
            }
            var_used++
        }
        if ((var_used < 2 && hours > 0) || (var_used == 1 && dateformat == 2)) {
            if (var_used == 1 && dateformat == 2) {
                txt = txt + "and "
            }
            if (hours > 1) {
                txt = txt + hours + " hours "
            } else {
                txt = txt + "1 hour "
            }
            var_used++
        }
        if ((var_used < 2 && minutes > 0) || (var_used == 1 && dateformat == 2)) {
            if (var_used == 1 && dateformat == 2) {
                txt = txt + "and "
            }
            if (minutes > 1) {
                txt = txt + minutes + " minutes "
            } else {
                txt = txt + "1 minute "
            }
            var_used++
        }
        if ((var_used < 2 && seconds > 0) || (var_used == 1 && dateformat == 2)) {
            if (var_used == 1 && dateformat == 2) {
                txt = txt + "and "
            }
            if (seconds > 1) {
                txt = txt + seconds + " seconds "
            } else {
                txt = txt + "1 second "
            }
            var_used++
        }
        if (txt != "") {
            txt = subfix + txt + praefix
        } else {
            txt = "Now"
        }
        if (txt.charAt(txt.length - 1) == " ") {
            txt = txt.substr(0, txt.length - 1)
        }
    }
    return txt;
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
                    if (!isActive) {
                        notify();
                    }
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
userInterval = setInterval(updateUsers, 3000);

window.onfocus = function() {
    isActive = true;
    notify(false);
};
window.onblur = function() {
    isActive = false;
};

let notified = false;
function notify(t) {
    if (t == undefined) {
        if (notifyTimer == null) {
            notifyTimer = setInterval(notifyTitle, 2000);
        }
        beep();
    } else {
        if (notifyTimer !== null) {
            clearInterval(notifyTimer);
        }
        notifyTimer = null;
        document.title = "PalPad";
        newMsgs = [];
    }
}
function notifyTitle() {
    if (!notified) {
        document.title = "New Message!";
        notified = true;
    } else {
        document.title = "PalPad";
        notified = false;
    }
}

function beep() { let snd = document.getElementById("notification"); snd.play();}

