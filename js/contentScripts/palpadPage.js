document.body.innerHTML = "";
// $.get(chrome.extension.getURL('../../www/palpadPage.html'), function(data) {
//     // Or if you're using jQuery 1.8+:
//     $($.parseHTML(data)).appendTo('body');
// });

fetch(chrome.extension.getURL('www/palpadPage.html'))
    .then(response => response.text())
    .then(data => {
        console.log(data);
        document.body.innerHTML = data;
        // other code
        // eg update injected elements,
        // add event listeners or logic to connect to other parts of the app
        
        let div = document.getElementById("div");
        
        chrome.storage.sync.get('color', function(data) {
            div.style.backgroundColor = data.color;
        });
        
        let btn = document.getElementById("btn");
        
        btn.onclick = function() {
            chrome.storage.sync.set({color: '#ff5f42'}, function() {
                console.log("The color is red.");
            });
        }
        
    }).catch(err => {
    // handle error
});

let link = document.createElement("link");
link.href = chrome.extension.getURL("css/palpadPage.css");
link.type = "text/css";
link.rel = "stylesheet";
document.head.appendChild(link);