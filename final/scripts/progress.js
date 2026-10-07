// ========================================
// Progress Page - progress.js
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  drawProgressPage();
});

function drawProgressPage() {
  const progressSummary = document.getElementById('progressSummary');
  const progressChart = document.getElementById('progressChart');
  const categoryProgress = document.getElementById("categoryProgress");
  const completionGauge = document.getElementById("completionGauge");
  const motivationMessage = document.getElementById("motivationMessage");

  if (progressSummary && progressChart) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.length - completed;
    const total = completed + pending || 1;
    const percent = completed / total;

    const isDarkMode = document.body.classList.contains("dark-mode");

    // Helper to pull CSS variables
    function getCSSVar(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    const accentColor = getCSSVar("--accent-color");
    const dangerColor = getCSSVar("--danger-color");
    const textColor = isDarkMode ? getCSSVar("--dark-text") : getCSSVar("--text-color");
    const primaryColor = getCSSVar("--primary-color");

    // ==============================
    // Summary Text
    // ==============================
    progressSummary.textContent = `Completed: ${completed} | Pending: ${pending}`;
    progressSummary.style.color = textColor;

    // ==============================
    // Bar Chart
    // ==============================
    const ctx = progressChart.getContext('2d');
    ctx.clearRect(0, 0, progressChart.width, progressChart.height);

    const completedWidth = (completed / total) * 200;
    const pendingWidth = (pending / total) * 200;

    ctx.fillStyle = accentColor;
    ctx.fillRect(50, 50, completedWidth, 30);

    ctx.fillStyle = dangerColor;
    ctx.fillRect(50 + completedWidth, 50, pendingWidth, 30);

    ctx.strokeStyle = primaryColor;
    ctx.strokeRect(50, 50, 200, 30);

    // Tooltip
    progressChart.onmousemove = (e) => {
      const rect = progressChart.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.clearRect(0, 90, progressChart.width, 40);

      if (y >= 50 && y <= 80 && x >= 50 && x <= 250) {
        ctx.fillStyle = textColor;
        ctx.font = '14px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText(
          x <= 50 + completedWidth ? `Completed: ${completed}` : `Pending: ${pending}`,
          150, 110
        );
      }
    };

    // ==============================
    // Category Breakdown
    // ==============================
    if (categoryProgress) {
      const categories = ["reading", "assignment", "exam-prep"];
      categoryProgress.innerHTML = categories.map(cat => {
        const totalCat = tasks.filter(t => t.category === cat).length;
        const completedCat = tasks.filter(t => t.category === cat && t.status === "completed").length;
        return `<li>${cat}: ${completedCat}/${totalCat} completed</li>`;
      }).join("");
    }

    // ==============================
    // Circular Gauge
    // ==============================
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
      gctx.strokeStyle = accentColor;
      gctx.beginPath();
      gctx.arc(100, 100, 80, -Math.PI/2, (2 * Math.PI * percent) - Math.PI/2);
      gctx.stroke();

      // Percentage text
      gctx.fillStyle = textColor;
      gctx.font = "20px Roboto";
      gctx.textAlign = "center";
      gctx.fillText(`${Math.round(percent * 100)}%`, 100, 110);
    }

    // ==============================
    // Motivational Message
    // ==============================
    if (motivationMessage) {
      if (percent === 1) {
        motivationMessage.textContent = "🎉 Fantastic! All tasks completed!";
      } else if (percent >= 0.5) {
        motivationMessage.textContent = "👍 Great job! Keep pushing!";
      } else {
        motivationMessage.textContent = "💡 Stay focused, you can do it!";
      }
      motivationMessage.style.color = textColor;
    }
  }
}
