document.onload = (function() {

    let flag = true;
    
    do {

        let num = prompt("How many questions would you like to see? (0-5)");

        if (0 <= num && num <= 5 && num != NaN) {

            loadJSON(function(response) {
                let jsonData = JSON.parse(response);
                
                for (let i = num; i > 0; --i) {
                    let index = Math.floor(Math.random() * jsonData.length);

                    // Generate question
                    let element = document.createElement("p");
                    element.innerHTML = (num - i + 1) + ") " + jsonData[index]["question"];
                    document.getElementById('questions').appendChild(element);

                    let options = document.createElement("div");
                    options.className = "quiz-question";

                    // Generate choices
                    for (let j = 1; j <= 4; ++j) {
                        let choice = document.createElement("input");
                        choice.type = "radio";
                        choice.name = "question" + i;
                        choice.value = "q" + i + "answer" + (j + 1);

                        options.appendChild(choice);

                        let choiceText = document.createElement("span");
                        choiceText.innerHTML = jsonData[index]["choices"][j];
                        options.appendChild(choiceText);

                        options.appendChild(document.createElement("br"));
                    }

                    document.getElementById('questions').appendChild(options);

                    // Remove the item from the array
                    jsonData.splice(index, 1);
                }
            });

            flag = false;
        }
    } while (flag);
})();

function loadJSON(callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../scripts/lab2questions.json', true);
    
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}
