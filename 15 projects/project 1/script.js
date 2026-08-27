// Dom Element
const questions = [
    {
        question: "Which language runs in a web browser?",
        options: ["Python", "JavaScript", "C++", "Rust"],
        answer: "JavaScript"
    },
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Trainer Markup Language",
            "HyperText Markup Language",
            "HighText Machine Language",
            "Hyperlink Text Management Language"
        ],
        answer: "HyperText Markup Language"
    },
    {
        question: "Which CSS property changes text color?",
        options: ["font-size", "color", "background", "margin"],
        answer: "color"
    },
    {
        question: "Which HTML tag defines a paragraph?",
        options: ["<head>", "<p>", "<section>", "<div>"],
        answer: "<p>"
    },
    {
        question: "Which symbol is used for a single-line comment in JavaScript?",
        options: ["<!-- -->", "#", "//", "/* */"],
        answer: "//"
    }
];

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const questionText = document.getElementById("question-text");
const currentQuestionEl = document.getElementById("current-question");
const totalQuestionsEl = document.getElementById("total-questions");
const answersContainer = document.getElementById("answers-container");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const maxScoreEl = document.getElementById("max-score");
const progressEl = document.getElementById("progress");
const resultMessageEl = document.getElementById("result-message");
const screens = document.querySelectorAll(".screen");

let currentQuestionIndex = 0;
let score = 0;

function showScreen(screenId) {
    screens.forEach((screen) => {
        screen.classList.toggle("active", screen.id === screenId);
    });
}

function updateScore() {
    scoreEl.textContent = score;
}

function setResultMessage() {
    const percentage = Math.round((score / questions.length) * 100);

    if (percentage >= 80) {
        resultMessageEl.textContent = "Excellent! You crushed it!";
    } else if (percentage >= 60) {
        resultMessageEl.textContent = "Great job! Keep going!";
    } else if (percentage >= 40) {
        resultMessageEl.textContent = "Nice try! Practice makes perfect.";
    } else {
        resultMessageEl.textContent = "Good effort! Try again!";
    }
}

function renderQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    questionText.textContent = currentQuestion.question;
    currentQuestionEl.textContent = currentQuestionIndex + 1;
    totalQuestionsEl.textContent = questions.length;
    answersContainer.innerHTML = "";

    currentQuestion.options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-btn";
        button.textContent = option;

        button.addEventListener("click", () => handleAnswer(button, option, currentQuestion.answer));
        answersContainer.appendChild(button);
    });

    const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressEl.style.width = `${progressValue}%`;
}

function handleAnswer(selectedButton, selectedOption, correctAnswer) {
    const buttons = document.querySelectorAll(".answer-btn");

    buttons.forEach((button) => {
        button.disabled = true;
        if (button.textContent === correctAnswer) {
            button.classList.add("correct");
        }
        if (button.textContent === selectedOption && selectedOption !== correctAnswer) {
            button.classList.add("incorrect");
        }
    });

    if (selectedOption === correctAnswer) {
        score += 1;
        updateScore();
    }

    setTimeout(() => {
        currentQuestionIndex += 1;

        if (currentQuestionIndex < questions.length) {
            renderQuestion();
        } else {
            finishQuiz();
        }
    }, 700);
}

function finishQuiz() {
    finalScoreEl.textContent = score;
    maxScoreEl.textContent = questions.length;
    setResultMessage();
    showScreen("result-screen");
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    updateScore();
    showScreen("quiz-screen");
    renderQuestion();
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    updateScore();
    showScreen("start-screen");
}

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", restartQuiz);

// Quiz State Vars
