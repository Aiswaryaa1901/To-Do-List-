
document.addEventListener("DOMContentLoaded", getTasks);


document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    addTask(taskText);
    taskInput.value = "";
  }
});

const BASE_URL = "http://localhost:3000"; 


function getTasks() {
  fetch(`${BASE_URL}/tasks`)
    .then((res) => res.json())
    .then((tasks) => {
      const taskList = document.getElementById("taskList");
      taskList.innerHTML = ""; // Clear existing
      tasks.forEach((task) => renderTask(task));
    })
    .catch((err) => console.error("Error fetching tasks:", err));
}


function addTask(text) {
  fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
    .then((res) => res.json())
    .then((newTask) => renderTask(newTask))
    .catch((err) => console.error("Error adding task:", err));
}


function renderTask(task) {
  const taskList = document.getElementById("taskList");

  const li = document.createElement("li");
  li.textContent = task.text;
  li.style.textDecoration = task.completed ? "line-through" : "none";

 
  const completeBtn = document.createElement("button");
  completeBtn.textContent = task.completed ? "↩️" : "✅";
  completeBtn.onclick = () => toggleComplete(task._id, li);

  
  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.onclick = () => deleteTask(task._id, li);

  li.appendChild(completeBtn);
  li.appendChild(delBtn);
  taskList.appendChild(li);
}


function toggleComplete(taskId, li) {
  fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "PATCH",
  })
    .then((res) => res.json())
    .then((updatedTask) => {
      li.style.textDecoration = updatedTask.completed ? "line-through" : "none";
    })
    .catch((err) => console.error("Error updating task:", err));
}


function deleteTask(taskId, li) {
  fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  })
    .then(() => li.remove())
    .catch((err) => console.error("Error deleting task:", err));
}
