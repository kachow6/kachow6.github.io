let makeBtns = (function() {

    let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    alphabet.forEach(function(letter) {
        let element = document.createElement("button");
        element.setAttribute("id", "alphabet");
        element.innerHTML = letter;
        element.onclick = function() { alert(letter); }
        document.getElementById('btns').appendChild(element);
    });
})();
