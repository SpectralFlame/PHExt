function openPrivateChat(name, uid) {
    document.getElementById("username").innerHTML = name;
    document.getElementById("uid").value = uid;
    $.ajax({
        url: "//palpad.pokeheroes.com/loadchat.php?" + Math.random(),
        type: "POST",
        data: {
            partner: uid,
            date_lim: "",
            upd: "y"
        },
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            document.getElementById("chat").innerHTML = data;
        }
    });
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
    if (e.keyCode === 13) {
        $.ajax({
            url: "//palpad.pokeheroes.com/sendmsg.php",
            type: "POST",
            data: {
                partner: document.getElementById("uid").value,
                msg: obj.value
            },
            success: function(data) {
            
            }
        });
    }
}