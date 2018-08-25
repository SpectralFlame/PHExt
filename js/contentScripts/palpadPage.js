//
// HEADER
//

document.title = "PalPad";
let link = document.createElement("link");
link.href = chrome.extension.getURL("css/palpadPage.css");
link.type = "text/css";
link.rel = "stylesheet";
document.head.appendChild(link);
let jquery = document.createElement("script");
jquery.src = "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
document.head.appendChild(jquery);
let sound = document.createElement("audio");
sound.setAttribute("id", "notification");
sound.innerHTML = "<source src='" + chrome.extension.getURL("mp3/notification1.mp3") + "' type='audio/mpeg'>";
document.head.appendChild(sound);
let ppScript = document.createElement("script");
ppScript.src = chrome.extension.getURL("js/ppScript.js");
document.head.appendChild(ppScript);

//
// BODY
//

document.body.innerHTML = "";

fetch(chrome.extension.getURL('www/palpadPage.html'))
    .then(response => response.text())
    .then(data => {
        document.body.innerHTML = data;
    }).catch(err => {
    // handle error
});

//
// EVENT LISTENERS
//

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
        data = JSON.parse(data);
        let convlist = data["convlist"];
        for (let i = 0; i < convlist.length; i++) {
            let conv = convlist[i];
            if (i === 0) {
                openPrivateChat(conv["Name"], conv["Uid"]);
            }
            let link = document.createElement("a");
            $(link).class = "friend_chat";
            $(link).attr({ "onclick": 'openPrivateChat("' + conv["Name"] + '", ' + conv["Uid"]+ ');' });
            $(link).html("<span class='img'><img src='" + conv["Avatar"] +
                "'></span><img src='//staticpokeheroes.com/img/misc/" + conv["On"] + ".png'> " + conv["Name"] +
                "<br><span class='last_msg active_countdown' data-countto='1535031146' data-dateformat='1'>2 minutes ago</span>");
            document.getElementById("users").appendChild(link);
        }
    }
});

//
// FUNCTIONS
//

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
            //document.getElementById("chat").innerHTML = data;
        }
    });
}
