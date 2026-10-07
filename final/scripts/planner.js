document.addEventListener('DOMContentLoaded', () => {
    // ==============================
    // Footer Dynamic Info
    // ==============================
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = document.lastModified;
  
    // ==============================
    // Highlight Active Nav Link
    // ==============================
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav ul li a').forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  
    // ==============================
    // Hamburger Menu Toggle
    // ==============================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        hamburger.classList.toggle('active');
      });
    }
  
    // ==============================
    // Dark Mode Toggle with LocalStorage
    // ==============================
    const darkToggle = document.getElementById("dark-mode-toggle");
    function applyTheme(theme) {
      if (theme === "dark") {
        document.body.style.background = "var(--dark-bg)";
        document.body.style.color = "var(--dark-text)";
      } else {
        document.body.style.background = "var(--background-color)";
        document.body.style.color = "var(--text-color)";
      }
    }
    darkToggle?.addEventListener("click", () => {
      let currentTheme = localStorage.getItem("theme") === "dark" ? "light" : "dark";
      localStorage.setItem("theme", currentTheme);
      applyTheme(currentTheme);
    });
    applyTheme(localStorage.getItem("theme") || "light");
  
    // ==============================
    // Index Page CTA Button
    // ==============================
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'tasks.html';
      });
    }
  
    // ==============================
    // Tasks Page Logic
    // ==============================
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
      // Load initial tasks from items.json if localStorage is empty
      async function loadInitialTasks() {
        try {
          const response = await fetch("data/items.json");
          if (!response.ok) throw new Error("Network error");
          const jsonTasks = await response.json();
          if (tasks.length === 0) {
            tasks = jsonTasks;
            localStorage.setItem("tasks", JSON.stringify(tasks));
          }
          renderTasks();
        } catch (err) {
          console.error("Error fetching tasks:", err);
        }
      }
  
      // Render tasks dynamically with buttons
      function renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
          const div = document.createElement('div');
          div.className = 'task-item';
          // Add CSS class if task is completed
          if (task.status === 'completed') {
            div.classList.add('completed');// trigger CSS for completed tasks
          }
          div.innerHTML = `
            <span><strong>${task.title}</strong> - ${task.deadline} (${task.category}) [${task.status}]</span>
            <button class="complete-btn" data-index="${index}">Mark Completed</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
          `;
          taskList.appendChild(div);
        });
      }
  
      // Add new task
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value.trim();
        const deadline = document.getElementById('taskDeadline').value;
        const category = document.getElementById('taskCategory').value;
  
        if (!title || !deadline) return;
  
        tasks.push({ title, deadline, category, status: 'pending' });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        e.target.reset();
      });
  
      // Handle delete and mark completed actions
      document.getElementById('taskList').addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('delete-btn')) {
          // Remove task
          tasks.splice(index, 1);
          localStorage.setItem('tasks', JSON.stringify(tasks));
          renderTasks();
        }
        if (e.target.classList.contains('complete-btn')) {
          // Mark task as completed
          tasks[index].status = 'completed';
          localStorage.setItem('tasks', JSON.stringify(tasks));
          renderTasks();
        }
      });
  
      loadInitialTasks();
    }
  
    // ==============================
    // Progress Page Logic
    // ==============================
    const progressSummary = document.getElementById('progressSummary');
    const progressChart = document.getElementById('progressChart');
    if (progressSummary && progressChart) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const completed = tasks.filter(t => t.status === 'completed').length;
      const pending = tasks.length - completed;
  
      progressSummary.textContent = `Completed: ${completed} | Pending: ${pending}`;
  
      const ctx = progressChart.getContext('2d');
      const total = completed + pending || 1;
  
      // Clear canvas
      ctx.clearRect(0, 0, progressChart.width, progressChart.height);
  
      // Draw completed bar (green)
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(50, 50, (completed / total) * 200, 30);
  
      // Draw pending bar (red) right next to completed
      ctx.fillStyle = '#f44336';
      ctx.fillRect(50 + (completed / total) * 200, 50, (pending / total) * 200, 30);
  
      // Outline
      ctx.strokeStyle = '#004080';
      ctx.strokeRect(50, 50, 200, 30);
    }
  
    // ==============================
    // Modal Dialog Example
    // ==============================
    const modal = document.getElementById("taskModal");
    const modalDetails = document.getElementById("modalDetails");
    const closeBtn = document.querySelector(".close");
  
    document.getElementById("taskList")?.addEventListener("click", e => {
      if (e.target.tagName === "SPAN") {
        modalDetails.textContent = e.target.textContent;
        modal.style.display = "block";
        modal.setAttribute("aria-hidden", "false");
      }
    });
  
    closeBtn?.addEventListener("click", () => {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    });
  });
  
  // ==============================
  // action-form.js
  // ==============================
export function initActionForm() {
  const formDataDiv = document.getElementById("formData");
  const successBanner = document.getElementById("successBanner");
  const dismissBtn = document.getElementById("dismissBanner");

  if (!formDataDiv) return; // Only run if we're on action-form.html

  // Display submitted form data
  const params = new URLSearchParams(window.location.search);
  formDataDiv.innerHTML = `
    <p><strong>Task Title:</strong> ${params.get("taskTitle") || "N/A"}</p>
    <p><strong>Deadline:</strong> ${params.get("taskDeadline") || "N/A"}</p>
    <p><strong>Category:</strong> ${params.get("taskCategory") || "N/A"}</p>
  `;

  // Dismiss banner manually
  dismissBtn?.addEventListener("click", () => {
    successBanner.classList.add("dismissed");
    successBanner.addEventListener("animationend", () => {
      successBanner.style.display = "none";
    }, { once: true });
  });

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (successBanner && successBanner.style.display !== "none") {
      successBanner.classList.add("dismissed");
      successBanner.addEventListener("animationend", () => {
        successBanner.style.display = "none";
      }, { once: true });
    }
  }, 5000);
}
