let stateModule = (function() {

    // Number of possible answers per question
    const NUM_ANSWERS = 4;

    // List of quiz questions
    let quizQuestions = [];

    // Publicly accessible object
    let pub = {};

    // Run on load
    retrieveQuiz();

    /**
     * Displays the user's quiz score on the browser.
     * @param {*} correct 
     * @param {*} size 
     */
    function displayScore(correct, size) {
        let scoreDiv = document.getElementById("score");
        let score = document.createElement("h3");
        let percent = Math.round((correct/size * 100) * 10) / 10
        score.innerHTML = "Your score: " + correct + "/" + size + "    " + percent + "%";
        
        scoreDiv.appendChild(score);
    }

    /**
     * Renders quiz question components.
     */
    function buildQuiz() {
        let parent = document.getElementById("quiz");

        for (let i = 0; i < quizQuestions.length; ++i) {

            let div = document.createElement("div");
            div.id = "quiz-question-" + i;
            div.className = "quiz-question";

            // Make question
            let question = document.createElement("p");
            question.id = "quiz-question-" + i + "-text";
            question.className = "quiz-question-text";
            question.innerHTML = (i + 1) + ") " + quizQuestions[i].question;
            div.appendChild(question);

            // Make answers
            for (let j = 0; j < NUM_ANSWERS; ++j) {
                let answer = document.createElement("div");
                answer.id = "quiz-question-"+ i + "-answer-" + j;
                answer.className = "quiz-question-"+ i + "-answer";

                let radioBtn = document.createElement("input");
                radioBtn.type = "radio";
                radioBtn.name = "quiz-question-radio-" + i;

                let span = document.createElement("span");
                span.innerHTML = quizQuestions[i]["answer" + (j + 1)];

                answer.appendChild(radioBtn);
                answer.appendChild(span);
                div.appendChild(answer);
            }

            parent.appendChild(div);
        }
    }

    /**
     * Removes validation borders from a previous quiz submission.
     */
    function clearPrevResponses() {

        let questionTexts = document.getElementsByClassName("quiz-question-text");

        for (let i = 0; i < questionTexts.length; ++i) {
            questionTexts[i].style["border"] = "none";
            questionTexts[i].innerHTML = quizQuestions[i].question 
        }

        let questions = document.getElementsByClassName("quiz-question");

        for (let j = 0; j < questions.length; ++j) {
            let answerDivs = document.getElementsByClassName("quiz-question-" + j + "-answer");
            for (let k = 0; k < answerDivs.length; ++k) {
                answerDivs[k].style["border"] = "none";
            }
        }
    }

    /**
     * Retrieves correct quiz answers.
     */
    function getQuizAnswers() {
        let answers = [];
        quizQuestions.forEach(function(question) {
            answers.push(question.correct);
        });

        return answers;
    }

    /**
     * Retrieves user quiz responses.
     */
    function getUserAnswers() {
        let usrResponses = [];

        let questions = document.getElementsByClassName("quiz-question");

        for (let i = 0; i < questions.length; ++i) {
            let answerDivs = document.getElementsByClassName("quiz-question-" + i + "-answer");

            for (let j = 0; j < answerDivs.length; ++j) {
                if (answerDivs[j].childNodes[0].checked == true) {

                    // Store quiz question, selected value, and selected div
                    let response = { value: (j + 1), div: answerDivs[j] };
                    usrResponses[i] = response;
                }
            }
        }

        return usrResponses;
    }

    /**
     * Quiz submission event handler.
     */
    pub.submitQuiz = function() {

        clearPrevResponses();

        let complete = true;
        let correct = 0;
        
        // Get correct answers
        let answers = getQuizAnswers();

        // Get user answers
        let userAnswers = getUserAnswers();

        for (let i = 0; i < answers.length; ++i) {
            let userInput = userAnswers[i];

            // User is missing a response
            if (userInput == null || userInput == undefined) {
                let questionText = document.getElementById("quiz-question-" + i + "-text"); 
                questionText.style["border"] = "solid 1px red";
                questionText.innerHTML = quizQuestions[i].question + " <b> Missing Answer </b>" 
                complete = false;
                continue;
            }

            // Validate user response
            if (userInput.value == answers[i]) {
                userInput.div.style["border"] = "solid 1px green";
                correct++;
            } else {
                userInput.div.style["border"] = "solid 1px red";
                // console.log("quiz-question-" + i + "-answer-" + (answers[i] - 1));
                let correct = document.getElementById("quiz-question-" + i + "-answer-" + (answers[i] - 1));
                correct.style["border"] = "solid 1px green";
            }
        }

        if (complete) {
            displayScore(correct, answers.length);
        }
    }

    /**
     * Retrieves quiz questions from local storage.
     */
    function retrieveQuiz() {
        let quizData = localStorage.getItem('quiz-questions');

        if (quizData == undefined || quizData == null) {
            alert("No available quiz data.");
            return;
        }

        quizQuestions = JSON.parse(quizData);
        buildQuiz();
    }

    return pub;

}());