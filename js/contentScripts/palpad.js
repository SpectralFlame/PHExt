let userbar = document.getElementById("userbar");
let div = userbar.getElementsByTagName("div")[2];
let goldenPalpad = document.createElement("a");
goldenPalpad.setAttribute("href", "//pokeheroes.com/palpad");
goldenPalpad.innerHTML = "<img src='" + chrome.extension.getURL('img/golden_palpad.png') +
    "' class='smallMarginRight' style='" + div.firstElementChild.getAttribute("style") + "'>";
div.insertBefore(goldenPalpad, div.firstChild);