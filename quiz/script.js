let quizData = {
    easy: [],
    medium: [],
    hard: [],
};

const url = "questions.json";

async function loadQuestions() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        quizData = await response.json();
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}
loadQuestions(); // Call the function

let currentQuestionIndex = 0; // Global variable
let currentlevel = "easy";
let score = 0;
let timer;
let timeleft = 50;
let quizEnded = false;

function startQuiz(level) {
    if (!quizData[level] || quizData[level].length === 0) {
        console.error('No data for the chosen level');
        return;
    }

    currentQuestionIndex = 0; // Resetting for a new quiz
    currentlevel = level; // Update current level
    score = 0; // Reset score
    timeleft = 50; // Reset timer
    quizEnded = false; // Reset quiz end flag

    // Show quiz container and hide others
    document.getElementById("result").innerText = "";
    document.getElementById("leaderboard").style.display = "none";
    document.getElementById("difficulty-cont").style.display = "none";
    document.getElementById("quiz-cont").style.display = "flex";
    document.getElementById("next-button").style.display = "inline-block";
    document.getElementById("question-count").style.display = "block";

    loadQuestion();
    startTimer();
}

function loadQuestion() {
    if (quizEnded) {
        return;
    }

    const questionData = quizData[currentlevel][currentQuestionIndex];
    document.getElementById("question").innerText = questionData.question;
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    questionData.options.forEach(option => {
        const button = document.createElement("button");
        button.classList.add("option-button");
        button.innerText = option;
        button.onclick = () => checkAnswer(option, button);
        optionsContainer.appendChild(button);
    });

    document.getElementById("next-button").disabled = true;
    const remainingQuestions = quizData[currentlevel].length - currentQuestionIndex - 1;
    document.getElementById("question-count").innerHTML = `Remaining Questions: ${remainingQuestions}`;
}

function checkAnswer(selectedOption, button) {
    if (quizEnded) return;

    const correctAnswer = quizData[currentlevel][currentQuestionIndex].answer;
    const optionButtons = document.querySelectorAll(".option-button");

    optionButtons.forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("incorrect");
        document.querySelector(`.option-button:not(.incorrect)`).classList.add('correct');
    }

    document.getElementById("next-button").disabled = false;
}

function nextQuestion() {
    if (quizEnded) return;

    currentQuestionIndex++;
    if (currentQuestionIndex < quizData[currentlevel].length) {
        loadQuestion();
    } else {
        clearInterval(timer);
        showResult();
    }
}

function showResult() {
    quizEnded = true;
    let resultMessage = `Quiz Over! You scored ${score} out of ${quizData[currentlevel].length}`;
    if (score >= quizData[currentlevel].length * 0.7) {
        resultMessage = `Congrats, you won! You scored ${score} out of ${quizData[currentlevel].length}`;
    } else {
        resultMessage = `Sorry, you lost! You scored ${score} out of ${quizData[currentlevel].length}`;
    }
    document.getElementById("result").innerHTML = resultMessage;
    document.getElementById("leaderboard").innerText = `Leaderboard:\n Score: ${score}`;
    document.getElementById("leaderboard").style.display = "block";
    document.getElementById("next-button").style.display = "none";
    document.getElementById("question-count").style.display = "none";
}

function startTimer() {
    timer = setInterval(() => {
        if (quizEnded) {
            clearInterval(timer);
            return;
        }

        timeleft--;
        document.getElementById("time-value").innerText = timeleft;
        if (timeleft <= 0) {
            clearInterval(timer);
            quizEnded = true;
            showResult();
        }
    }, 1000);
}

document.getElementById("next-button").addEventListener("click", nextQuestion);
