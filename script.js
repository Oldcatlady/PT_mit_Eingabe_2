let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;
let answered = false;
let checked = false;

function normalize(input) {
  return input
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .trim();
}

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadQuestion();
    updateStats();
  });

function loadQuestion() {
  if (!questions.length || !questions[current]) return;

  answered = false;
  checked = false;

  const q = questions[current];

  document.getElementById("questionBox").innerText = q.question;
  document.getElementById("textInput").value = "";
  document.getElementById("feedback").innerHTML = "";

  document.getElementById("actionBtn").innerText = "Eingabe prüfen";
}

function checkInput() {
  const q = questions[current];
  const input = document.getElementById("textInput").value;

  const user = normalize(input);

  const correctAnswerDisplay = q.answer;
  const answers = Array.isArray(q.answer) ? q.answer : [q.answer];

const isCorrect = answers.some(a => normalize(a) === user);

  answered = true;
  checked = true;

  if (user === correctAnswerCheck) {
    correct++;
    showFeedback(true, q.explanation, correctAnswerDisplay);
  } else {
    wrong++;
    showFeedback(false, q.explanation, correctAnswerDisplay);
  }

  document.getElementById("actionBtn").innerText = "Weiter";
  updateStats();
}

function nextQuestion() {
  current++;

  if (current >= questions.length) {
    showResult();
    return;
  }

  loadQuestion();
  updateStats();
}

document.getElementById("actionBtn").onclick = () => {
  if (!checked) {
    checkInput();
  } else {
    nextQuestion();
  }
};

document.getElementById("textInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (!checked) checkInput();
  }
});

function showFeedback(ok, explanation, correctAnswer) {
  document.getElementById("feedback").innerHTML =
    (ok
      ? "✔ Richtig! "
      : "❌ Falsch! <br>✔ Richtige Antwort: " + correctAnswer + "<br>"
    ) +
    (explanation ? explanation : "");
}

function updateStats() {
  document.getElementById("progressText").innerText =
    `Frage ${current + 1} / ${questions.length}`;

  document.getElementById("scoreText").innerText =
    `✔ ${correct} | ❌ ${wrong}`;

  document.getElementById("progressFill").style.width =
    ((current + 1) / questions.length) * 100 + "%";
}

function showResult() {
  const percent = (correct / questions.length) * 100;

  let grade;

  if (percent >= 92) grade = 1;
  else if (percent >= 81) grade = 2;
  else if (percent >= 67) grade = 3;
  else if (percent >= 50) grade = 4;
  else if (percent >= 30) grade = 5;
  else grade = 6;

  document.getElementById("quizBox").innerHTML = `
    <h2>Quiz beendet</h2>
    <p>Richtige Antworten: ${correct}</p>
    <p>Falsche Antworten: ${wrong}</p>
    <p>Ergebnis: ${percent.toFixed(1)}%</p>
    <h3>Note: ${grade}</h3>
  `;
}