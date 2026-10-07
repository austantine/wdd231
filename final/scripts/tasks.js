// tasks.js
import { saveTasks, loadTasks } from './storage.js';

export function initTasks() {
  const taskForm = document.getElementById('taskForm');
  if (!taskForm) return;

  let tasks = loadTasks();

  async function loadInitialTasks() {
    try {
      const response = await fetch("data/items.json");
      if (!response.ok) throw new Error("Network error");
      const jsonTasks = await response.json();
      if (tasks.length === 0) {
        tasks = jsonTasks;
        saveTasks(tasks);
      }
      renderTasks();
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }

  function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const div = document.createElement('div');
      div.className = 'task-item';
      if (task.status === 'completed') div.classList.add('completed');
      div.innerHTML = `
        <span><strong>${task.title}</strong> - ${task.deadline} (${task.category}) [${task.status}]</span>
        <button class="complete-btn" data-index="${index}">Mark Completed</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      taskList.appendChild(div);
    });
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value.trim();
    const deadline = document.getElementById('taskDeadline').value;
    const category = document.getElementById('taskCategory').value;
    if (!title || !deadline) return;

    tasks.push({ title, deadline, category, status: 'pending' });
    saveTasks(tasks);
    renderTasks();
    e.target.reset();
  });

  document.getElementById('taskList').addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    if (e.target.classList.contains('delete-btn')) {
      tasks.splice(index, 1);
      saveTasks(tasks);
      renderTasks();
    }
    if (e.target.classList.contains('complete-btn')) {
      tasks[index].status = 'completed';
      saveTasks(tasks);
      renderTasks();
    }
  });

  loadInitialTasks();
}
