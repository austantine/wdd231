// ========================================
// Study Planner - planner.js
// ========================================

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
      document.body.classList.add("dark-mode");
      darkToggle.textContent = "☀️ Light Mode";
    } else {
      document.body.classList.remove("dark-mode");
      darkToggle.textContent = "🌙 Dark Mode";
    }
  }

  if (darkToggle) {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    darkToggle.addEventListener("click", () => {
      const newTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    });
  }

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

  // render tasks with Completed/Uncompleted buttons
  function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const div = document.createElement('div');
      div.className = 'task-item';
      if (task.status === 'completed') {
        div.classList.add('completed');
      }
      div.innerHTML = `
        <span><strong>${task.title}</strong> - ${task.deadline} (${task.category}) [${task.status}]</span>
        ${task.status === 'completed' 
          ? `<button class="uncomplete-btn" data-index="${index}">Mark Uncompleted</button>` 
          : `<button class="complete-btn" data-index="${index}">Mark Completed</button>`}
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      taskList.appendChild(div);
    });
  }

  // Add new task locally and update localStorage
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value.trim();
    const deadline = document.getElementById('taskDeadline').value;
    const category = document.getElementById('taskCategory').value;

    if (!title || !deadline) return;

    tasks.push({ title, deadline, category, status: 'pending' });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();

    // Populate hidden submission form for action-form.html
    document.getElementById('submitTaskTitle').value = title;
    document.getElementById('submitTaskDeadline').value = deadline;
    document.getElementById('submitTaskCategory').value = category;

    e.target.reset();
  });

  //Handle delete, complete, and uncomplete actions
  document.getElementById('taskList').addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    if (e.target.classList.contains('delete-btn')) {
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
    if (e.target.classList.contains('complete-btn')) {
      tasks[index].status = 'completed';
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
    if (e.target.classList.contains('uncomplete-btn')) {
      tasks[index].status = 'pending';
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
  });

  loadInitialTasks();
}

// ==============================
//    Progress Page
// ==============================
const progressSummary = document.getElementById('progressSummary');
const progressChart = document.getElementById('progressChart');
const categoryProgress = document.getElementById("categoryProgress");
const completionGauge = document.getElementById("completionGauge");
const motivationMessage = document.getElementById("motivationMessage");

// Function to draw progress page elements
function drawProgressPage() {
  if (progressSummary && progressChart) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.length - completed;
    const total = completed + pending || 1;
    const percent = completed / total;

    // Detect dark mode
    const isDarkMode = document.body.classList.contains("dark-mode");

    // Summary text
    progressSummary.textContent = `Completed: ${completed} | Pending: ${pending}`;
    progressSummary.style.color = isDarkMode ? "#ffffff" : "#004080";

    // Draw bar chart
    const ctx = progressChart.getContext('2d');
    ctx.clearRect(0, 0, progressChart.width, progressChart.height);

    const completedWidth = (completed / total) * 200;
    const pendingWidth = (pending / total) * 200;

    // Completed bar
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(50, 50, completedWidth, 30);

    // Pending bar
    ctx.fillStyle = '#f44336';
    ctx.fillRect(50 + completedWidth, 50, pendingWidth, 30);

    // Border
    ctx.strokeStyle = '#004080';
    ctx.strokeRect(50, 50, 200, 30);

    // Tooltip logic
    progressChart.addEventListener('mousemove', (e) => {
      const rect = progressChart.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Clear tooltip area
      ctx.clearRect(0, 90, progressChart.width, 40);

      if (y >= 50 && y <= 80 && x >= 50 && x <= 250) {
        ctx.fillStyle = isDarkMode ? "#ffffff" : "#333333";
        ctx.font = '14px Roboto';
        ctx.textAlign = 'center';

        if (x <= 50 + completedWidth) {
          ctx.fillText(`Completed: ${completed}`, 150, 110);
        } else {
          ctx.fillText(`Pending: ${pending}`, 150, 110);
        }
      }
    });

    // Category Breakdown
    if (categoryProgress) {
      const categories = ["reading", "assignment", "exam-prep"];
      categoryProgress.innerHTML = categories.map(cat => {
        const totalCat = tasks.filter(t => t.category === cat).length;
        const completedCat = tasks.filter(t => t.category === cat && t.status === "completed").length;
        return `<li>${cat}: ${completedCat}/${totalCat} completed</li>`;
      }).join("");
    }

    // Circular Gauge
    if (completionGauge) {
      const gctx = completionGauge.getContext("2d");
      gctx.clearRect(0, 0, completionGauge.width, completionGauge.height);

      // Background circle
      gctx.strokeStyle = "#ddd";
      gctx.lineWidth = 15;
      gctx.beginPath();
      gctx.arc(100, 100, 80, 0, 2 * Math.PI);
      gctx.stroke();

      // Progress arc
      gctx.strokeStyle = "#4CAF50";
      gctx.beginPath();
      gctx.arc(100, 100, 80, -Math.PI/2, (2 * Math.PI * percent) - Math.PI/2);
      gctx.stroke();

      // Text percentage (adapt to dark mode)
      gctx.fillStyle = isDarkMode ? "#ffffff" : "#333";
      gctx.font = "20px Roboto";
      gctx.textAlign = "center";
      gctx.fillText(`${Math.round(percent * 100)}%`, 100, 110);
    }

    // Motivational Message
    if (motivationMessage) {
      if (percent === 1) {
        motivationMessage.textContent = "🎉 Fantastic! All tasks completed!";
      } else if (percent >= 0.5) {
        motivationMessage.textContent = "👍 Great job! Keep pushing!";
      } else {
        motivationMessage.textContent = "💡 Stay focused, you can do it!";
      }
      motivationMessage.style.color = isDarkMode ? "#ffffff" : "#004080";
    }
  }
}

// Run once on page load
drawProgressPage();

// Re-run when dark mode is toggled
const darkModeToggle = document.getElementById("dark-mode-toggle");
if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    drawProgressPage(); // redraw immediately
  });
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

  // Close modal with Esc key
    document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    taskModal.style.display = "none";
    taskModal.setAttribute("aria-hidden", "true");
  }
  });


 // ==============================
// Action Form Page Logic
// ==============================
const formDataDiv = document.getElementById("formData");
const successBanner = document.getElementById("successBanner");
const dismissBtn = document.getElementById("dismissBanner");
const backBtn = document.getElementById("backToPlanner");
const successSound = document.getElementById("successSound");

if (formDataDiv) {
  // Fade-in banner when page loads
  successBanner.classList.add("show");

  // Play success sound (if available)
  successSound?.play().catch(err => {
    console.warn("Audio playback blocked until user interaction:", err);
  });

  // Display submitted form data from query string
  const params = new URLSearchParams(window.location.search);
  formDataDiv.innerHTML = `
    <p><strong>Task Title:</strong> ${params.get("taskTitle") || "N/A"}</p>
    <p><strong>Deadline:</strong> ${params.get("taskDeadline") || "N/A"}</p>
    <p><strong>Category:</strong> ${params.get("taskCategory") || "N/A"}</p>
  `;

  // Dismiss banner manually
  dismissBtn?.addEventListener("click", () => {
    successBanner.classList.add("dismissed");
    successBanner.addEventListener("transitionend", () => {
      successBanner.style.display = "none";
    }, { once: true });
  });

  // Auto-dismiss after 15 seconds
  setTimeout(() => {
    if (successBanner && successBanner.style.display !== "none") {
      successBanner.classList.add("dismissed");
      successBanner.addEventListener("transitionend", () => {
        successBanner.style.display = "none";
      }, { once: true });
    }
  }, 15000);

  // Back to Planner button clears banner state
  backBtn?.addEventListener("click", () => {
    if (successBanner) {
      successBanner.style.display = "none";
      successBanner.classList.remove("dismissed", "show");
    }
  });
}

});
