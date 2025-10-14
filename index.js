const input = document.getElementById("input");
const list = document.getElementById("list");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const addBtn = document.getElementById("addBtn");


function addTask() {
  const task = input.value.trim();
  if (!task) {
    alert("Please write down a task");
    return;
  }

  addTaskFromStorage(task, false);
  input.value = "";
  saveTasks();
}

function addTaskFromStorage(text, completed = false) {
  const li = document.createElement("li");
  li.innerHTML = `
    <label>
      <input type="checkbox" ${completed ? "checked" : ""}>
      <span>${text}</span>
    </label>
    <span class="both">
      <span class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293z"/>
          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>
      </span>
      <span class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        </svg>
      </span>
    </span>
  `;

  if (completed) li.classList.add("completed");
  list.appendChild(li);

  const checkbox = li.querySelector("input");
  const edit = li.querySelector(".edit-btn");
  const taskSpan = li.querySelector("label span");
  const del = li.querySelector(".delete-btn");

  
  checkbox.addEventListener("click", () => {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();
    saveTasks();
  });

  
  edit.addEventListener("click", () => {
    const update = prompt("Edit task:", taskSpan.textContent);
    if (update !== null) {
      taskSpan.textContent = update.trim();
      li.classList.remove("completed");
      checkbox.checked = false;
      updateCounters();
      saveTasks();
    }
  });

  
  del.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove();
      updateCounters();
      saveTasks();
    }
  });

  updateCounters();
}


function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;
  const totalTasks = document.querySelectorAll("#list li").length;
  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = totalTasks - completedTasks;
}


function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#list li").forEach(li => {
    const text = li.querySelector("label span").textContent;
    const completed = li.classList.contains("completed");
    tasks.push({ text, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadTasks() {
  const stored = JSON.parse(localStorage.getItem("tasks")) || [];
  stored.forEach(task => addTaskFromStorage(task.text, task.completed));
  updateCounters();
}


input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addBtn.click();
  }
});


window.addEventListener("DOMContentLoaded", loadTasks);
