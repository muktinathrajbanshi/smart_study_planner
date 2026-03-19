let timer;
let timeLeft = 1500; // 25 minutes

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");
let chart;

function startTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! Take a break ☕");
      return;
    }

    timeLeft--;

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    document.getElementById("time").innerText =
      `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 1500;
  document.getElementById("time").innerText = "25:00";
}

function render() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.done ? "completed" : ""}">
        ${task.subject} - ${task.hours}h
      </span>
      <div>
        <button onclick="complete(${index})">✔</button>
        <button onclick="removeTask(${index})">❌</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateProgress();
  updateChart();

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateSuggestion() {
  let total = tasks.length;
  let completed = tasks.filter(t => t.done).length;

  let message = "";

  if (total === 0) {
    message = "Start by adding your first task 📚";
  } else if (completed === total) {
    message = "🎉 Great job! All tasks completed!";
  } else if (completed / total < 0.5) {
    message = "Focus more! Try completing at least half your tasks today.";
  } else {
    message = "Good progress! Keep going 💪";
  }

  document.getElementById("suggestion").innerText = message;
}

function addTask() {
  let subject = document.getElementById("subject").value;
  let hours = document.getElementById("hours").value;

  if (subject === "" || hours === "") {
    alert("Enter data");
    return;
  }

  tasks.push({
    subject: subject,
    hours: Number(hours),
    done: false
  });

  document.getElementById("subject").value = "";
  document.getElementById("hours").value = "";

  render();
}

function complete(index) {
  tasks[index].done = !tasks[index].done;
  render();
}

function removeTask(index) {
  tasks.splice(index, 1);
  render();
}

function updateProgress() {
  let totalHours = tasks.reduce((sum, t) => sum + t.hours, 0);
  let completedHours = tasks
    .filter(t => t.done)
    .reduce((sum, t) => sum + t.hours, 0);

  let percent =
    totalHours === 0 ? 0 : (completedHours / totalHours) * 100;

  document.getElementById("progressBar").style.width = percent + "%";
}

function updateChart() {
  let labels = tasks.map(t => t.subject);
  let data = tasks.map(t => t.hours);

  const ctx = document.getElementById("studyChart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Study Hours",
          data: data,
          backgroundColor: "#4caf50"
        }
      ]
    }
  });
}

document.getElementById("darkToggle").onclick = function () {
  document.body.classList.toggle("dark");
};

render();