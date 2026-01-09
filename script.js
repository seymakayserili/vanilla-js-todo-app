const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const categorySelect = document.getElementById("categorySelect");
const categoryFilter = document.getElementById("categoryFilter");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = []; //Array to store tasks
let currentFilter = "all";
let selectedCategory = "all";

//local storage start
const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
//local storage end

addBtn.addEventListener("click", function (e) {
  e.preventDefault();
  gorevEkle();
});

taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    gorevEkle();
  }
});

categoryFilter.addEventListener("change", filtreleKategoriyeGore);

filterButtons.forEach(button => {
  button.addEventListener("click", function () {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    this.classList.add("active");

    currentFilter = this.dataset.filter;

    if (currentFilter === "active") {
      TamamlanmayanlariGoster();
    } else {
      renderTasks();
    }
  });
});


function gorevEkle() {
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({
    text: text,
    category: categorySelect.value,
    completed: false
  });

  saveTasks();
  taskInput.value = "";
  renderTasks();
}

function gorevTamamla(id) {
  tasks[id].completed = !tasks[id].completed;
  saveTasks();
  renderTasks();
}

function filtreleKategoriyeGore() {
  selectedCategory = categoryFilter.value;
  renderTasks();
}

function TamamlanmayanlariGoster() {
  currentFilter = "active";
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks
    .filter(task => {
      if (currentFilter === "active" && task.completed) return false;
      if (currentFilter === "completed" && !task.completed) return false;
      if (selectedCategory !== "all" && task.category !== selectedCategory) return false;
      return true;
    })
    .forEach((task, index) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const checkbox = document.createElement("div");
      checkbox.className = "checkbox";
      if (task.completed) {
        checkbox.classList.add("checked");
        checkbox.textContent = "✔";
      }

      checkbox.addEventListener("click", function () {
        gorevTamamla(index);
      });

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;

      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = task.category;

      const del = document.createElement("span");
      del.className = "delete";
      del.textContent = "×";
      del.addEventListener("click", function () {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      li.append(checkbox, text, tag, del);
      taskList.appendChild(li);
    });
}

renderTasks();
