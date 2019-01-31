let stateModule = (function() {

    // Number of possible answers per question
    const NUM_ANSWERS = 4;

    // Strings
    const CREATE_QUESTION_SUCCESS = "Question has been successfully created.";
    const STORE_QUIZ_WARNING = "Please make some questions first!";
    const STORE_QUIZ_SUCCESS = "Quiz was successfully saved!";
    const SAVE_QUIZ_SUCCESS = "Question has been successfully saved.";
    const SAVE_QUIZ_WARNING = "ERROR: one or more required fields are missing.";

    // Temp question storage
    let currentQuizQuestions = [];

    // Unique id tracker
    let idStore = 0;

    // Current question in edit tracker
    let editId = 0;

    // Publicly accessible object
    let pub = {};

    /**
     * Generates a new question confirmation message.
     */
    function confirmQuestion() {
        let notification = document.getElementById("new-question-notification");
        notification.style["display"] = "inline";
        notification.style["color"] = "green";
        document.getElementById("new-question-notification-text").innerHTML = CREATE_QUESTION_SUCCESS;
    }
    
    /**
     * Removes all empty values within the current list of quiz questions.
     */
    function filterQuestions() {
        currentQuizQuestions = currentQuizQuestions.filter(function (el) {
            return el != null;
        });
    }

    /**
     * Returns the answer radio button that has been checked in the new question form.
     */
    function getCheckedButton() {
        for (let i = 1; i <= NUM_ANSWERS; ++i) {
            if (document.getElementById("radiobtn" + i).checked)
                return (i);
        }
    }

    /**
     * Returns the index of a quiz question from an element id.
     * @param {*} element 
     */
    function getQuizIndexFromElement(element) {
        let elementId = element.parentNode.id;
        return elementId.replace("current-question-", "");
    }

        /**
     * Removes a quiz question from the browser and temp storage.
     */
    pub.deleteQuestion = function(element) {

        let id = getQuizIndexFromElement(element);

        // Remove element from browser
        let question = document.getElementById(element.parentNode.id);
        question.parentNode.removeChild(question);

        // Remove object from temp storage
        delete currentQuizQuestions[id];

        // Reset question form
        resetQuestionForm();
    }

    /**
     * Resets the page question form to allow user to edit a question.
     */
    pub.editQuestion = function(element) {

        // Swap question form headers
        let update = document.getElementById("update-question-submit");
        update.style["display"] = "inline";

        let submit = document.getElementById("new-question-submit");
        submit.style["display"] = "none";

        let formHeader = document.getElementById("new-question-title");
        formHeader.innerHTML = "Edit Question Text *";

        // Clear question form message
        document.getElementById("new-question-notification-text").innerHTML = "";

        // Fill question form fields with current question to edit
        let id = getQuizIndexFromElement(element);
        let question = currentQuizQuestions[id];
        
        let questionField = document.getElementById("question");
        questionField.value = question.question;

        for (let i = 1; i <= NUM_ANSWERS; ++i) {
            let answerField = document.getElementById("answer" + i);
            answerField.value = question["answer" + i];

            if (question.correct == i) {
                let currentAnswer = document.getElementById("radiobtn" + i);
                currentAnswer.checked = true;
            }
        }

        // Log question id when it's time to update
        editId = id;
    }

    /**
     * Add quiz question button event handler.
     * Validates form fields and adds a new quiz question to temporary storage.
     */
    pub.saveQuestion = function() {
        let question = document.getElementById("question");
        let ans1 = document.getElementById("answer1");
        let ans2 = document.getElementById("answer2");
        let ans3 = document.getElementById("answer3");
        let ans4 = document.getElementById("answer4");

        let fields = [question, ans1, ans2, ans3, ans4];

        if (validateForm(fields)) {
            let checkedVal = getCheckedButton();
            let newQuestion = {
                question: question.value,
                answer1: ans1.value,
                answer2: ans2.value,
                answer3: ans3.value,
                answer4: ans4.value,
                correct: checkedVal
            };
            currentQuizQuestions[idStore] = newQuestion;
            resetQuestionForm();
            confirmQuestion();
            renderQuestion(newQuestion);
        }
    }

    /**
     * Saves current quiz to browser local storage.
     */
    pub.storeQuiz = function() {

        filterQuestions();

        if (currentQuizQuestions === undefined || currentQuizQuestions.length == 0) {
            alert(STORE_QUIZ_WARNING);
            return;
        }

        // Clear local storage
        localStorage.clear();

        // Convert quiz questions to JSON and store in local storage
        localStorage.setItem("quiz-questions", JSON.stringify(currentQuizQuestions));

        alert(STORE_QUIZ_SUCCESS);
    }

    /**
     * Updates html component and question in temp storage with updated fields from question form.
     */
    pub.updateQuestion = function() {

        // Update question fields
        let compText = document.getElementById("current-question-text-" + editId);
        let newText = document.getElementById("question").value;
        compText.innerHTML = newText;
        currentQuizQuestions[editId].question = newText;

        // Update answer fields
        let compAnswers = document.getElementsByClassName("current-question-span-" + editId);
        for (let i = 0; i < NUM_ANSWERS; ++i) {
            let newAnswer = document.getElementById("answer" + (i + 1)).value;
            compAnswers[i].innerHTML = newAnswer;
            currentQuizQuestions[editId]["answer" + (i + 1)] = newAnswer;    
        }

        // Update correct answer
        let checkedBtn = getCheckedButton();
        document.getElementById("current-question-radio-" + editId + "-" + checkedBtn).checked = true;
        currentQuizQuestions[editId].correct = checkedBtn;

        // Reset form fields
        resetQuestionForm();

        document.getElementById("new-question-notification-text").innerHTML = SAVE_QUIZ_SUCCESS;
    }

    /**
     * Renders the delete button for a newly created quiz question.
     */
    function renderDeleteBtn() {
        let del = document.createElement("button");
        del.classList.add('question-button');
        del.setAttribute("onclick", "stateModule.deleteQuestion(this);");
        del.innerHTML = "Delete";
        return del;
    }

    /**
     * Renders the edit button for a newly created quiz question.
     */
    function renderEditBtn() {
        let edit = document.createElement("button");
        edit.classList.add('question-button');
        edit.setAttribute("onclick", "stateModule.editQuestion(this);");
        edit.innerHTML = "Edit";
        return edit;
    }

    /**
     * Renders a new quiz question component to the browser.
     * @param {*} question
     */
    function renderQuestion(question) {
        let div = document.createElement("div");
        div.id = "current-question-" + idStore;

        let q = document.createElement("p");
        q.id = "current-question-text-" + idStore;
        q.innerHTML = question.question;

        div.appendChild(q);

        // make radio options
        for (let i = 1; i <= NUM_ANSWERS; ++i) {
            let ans = document.createElement("input");
            let ansText = document.createElement("span");
            let br = document.createElement("br");

            switch (i) {
                case 1:
                    ansText.innerHTML = question.answer1;
                    break;
                case 2:
                    ansText.innerHTML = question.answer2;
                    break;
                case 3:
                    ansText.innerHTML = question.answer3;
                    break;
                case 4:
                    ansText.innerHTML = question.answer4;
                    break;
                default:
            }

            ans.id = "current-question-radio-" + idStore + "-" + i;
            ans.className = "current-question-radio-" + idStore;
            ans.name = "current-question-radio-" + idStore;
            ans.type = "radio";
            if (question.correct == i) {
                ans.checked = true;
            }
            ans.disabled = true;

            ansText.id = "current-question-span-" + idStore + "-" + i;;
            ansText.className = "current-question-span-" + idStore;

            div.appendChild(ans);
            div.appendChild(ansText);
            div.appendChild(br);
        }

        div.appendChild(renderEditBtn());
        div.appendChild(renderDeleteBtn());

        updateIdStore();

        document.getElementById("current-questions").appendChild(div);
    }

    /**
     * Resets all of the textarea input fields and notification message of the question form.
     */
    function resetQuestionForm() {
        let formHeader = document.getElementById("new-question-title");
        formHeader.innerHTML = "New Question Text *";

        let update = document.getElementById("update-question-submit");
        update.style["display"] = "none";

        let submit = document.getElementById("new-question-submit");
        submit.style["display"] = "inline";

        document.getElementById("new-question-notification-text").innerHTML = "";

        let questionField = document.getElementById("question");
        questionField.value = "";

        let currentAnswer = document.getElementById("radiobtn1");
        currentAnswer.checked = true;

        for (let i = 1; i <= NUM_ANSWERS; ++i) {
            let answerField = document.getElementById("answer" + i);
            answerField.value = "";
        }
    }

    /**
     * Updates the unique quiz question id store for the page.
     */
    function updateIdStore() {
        idStore++;
    }

    /**
     * Validates a new quiz question input field.
     * @param {*} field
     */
    function validateField(field) {
        if (field.value == "") {
            field.style["border"] = "solid 1px red";
            return false;
        } else {
            field.style["border"] = "solid 1px rgb(185, 185, 185)";
            return true;
        }
    }

    /**
     * Validates the new quiz question input form.
     * @param {*} fields
     */
    function validateForm(fields) {
        valid = true;

        fields.forEach(function(field) {
            if (!validateField(field)) {
                valid = false;
            }
        });

        let notification = document.getElementById("new-question-notification");

        if (!valid) {
            notification.style["display"] = "inline";
            notification.style["color"] = "red";
            document.getElementById("new-question-notification-text").innerHTML = SAVE_QUIZ_WARNING;
        } else {
            notification.style["display"] = "none";
        }

        return valid;
    }

    return pub;

}());
