
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
            let oldTime = data.match(/updateChatOldTime\((\d+)\)/);
            if (oldTime != null) {
                chatOldTime = oldTime[1];
            }
            let chat = document.getElementById("chat");
            chat.innerHTML += data;
            chat.scrollTop = chat.scrollHeight;
        }
    });
}
