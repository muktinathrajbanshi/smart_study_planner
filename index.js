let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");
let chart; // important for fixing chart issue

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

function addTask() {
  let subject = document.getElementById("subject").value;
  let hours = document.getElementById("hours").value;

  if (subject === "" || hours === "") {
    alert("Enter data");
    return;
  }

  tasks.push({
    subject: subject,
    hours: Number(hours), // FIXED
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
  let done = tasks.filter(t => t.done).length;
  let percent = tasks.length === 0 ? 0 : (done / tasks.length) * 100;

  document.getElementById("progressBar").style.width = percent + "%";
}

function updateChart() {
  let labels = tasks.map(t => t.subject);
  let data = tasks.map(t => t.hours);

  const ctx = document.getElementById("studyChart");

  if (chart) {
    chart.destroy(); // FIXED
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Study Hours",
          data: data,
          backgroundColor: "#4CAF50"
        }
      ]
    }
  });
}

document.getElementById("darkToggle").onclick = function () {
  document.body.classList.toggle("dark");
};

render();