// ==============================
// Progress Page Logic
// ==============================
const progressSummary = document.getElementById('progressSummary');
const progressChart = document.getElementById('progressChart');
const categoryProgress = document.getElementById("categoryProgress");
const completionGauge = document.getElementById("completionGauge");
const motivationMessage = document.getElementById("motivationMessage");
const streakSection = document.getElementById("currentStreak");
const longestSection = document.getElementById("longestStreak");
const resetSuccessBanner = document.getElementById("resetSuccessBanner");
const dismissResetBanner = document.getElementById("dismissResetBanner");

// Newly added definitions
const confirmResetBtn = document.getElementById("confirmResetBtn");
const resetModal = document.getElementById("resetModal");

// Reset Streak Button Logic
const resetStreakBtn = document.getElementById("resetStreakBtn");
if (resetStreakBtn) {
  resetStreakBtn.addEventListener("click", () => {
    localStorage.removeItem("lastCompletionDate");
    localStorage.setItem("currentStreak", 0);
    localStorage.setItem("longestStreak", 0);

    if (streakSection && longestSection) {
      streakSection.textContent = "🔥 Current Streak: 0 day(s)";
      longestSection.textContent = "🏆 Longest Streak: 0 day(s)";
    }
  });
}

// Show banner after reset
function showResetSuccessBanner() {
  if (resetSuccessBanner) {
    resetSuccessBanner.style.display = "flex";
    resetSuccessBanner.classList.add("show");

    setTimeout(() => {
      resetSuccessBanner.classList.add("dismissed");
      resetSuccessBanner.style.display = "none";
    }, 5000);
  }
}

// Dismiss manually
if (dismissResetBanner) {
  dismissResetBanner.addEventListener("click", () => {
    resetSuccessBanner.classList.add("dismissed");
    resetSuccessBanner.style.display = "none";
  });
}

// Confirm reset logic
if (confirmResetBtn) {
  confirmResetBtn.addEventListener("click", () => {
    localStorage.removeItem("lastCompletionDate");
    localStorage.setItem("currentStreak", 0);
    localStorage.setItem("longestStreak", 0);

    if (streakSection && longestSection) {
      streakSection.textContent = "🔥 Current Streak: 0 day(s)";
      longestSection.textContent = "🏆 Longest Streak: 0 day(s)";
    }

    if (resetModal) resetModal.style.display = "none";
    showResetSuccessBanner();
  });
}


function drawProgressPage() {
  if (progressSummary && progressChart) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.length - completed;
    const total = completed + pending || 1;
    const percent = completed / total;

    const isDarkMode = document.body.classList.contains("dark-mode");

    // Summary text
    progressSummary.textContent = `Completed: ${completed} | Pending: ${pending}`;
    progressSummary.style.color = isDarkMode ? "#ffffff" : "#004080";

    // Bar chart
    const ctx = progressChart.getContext('2d');
    ctx.clearRect(0, 0, progressChart.width, progressChart.height);

    const completedWidth = (completed / total) * 200;
    const pendingWidth = (pending / total) * 200;

    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(50, 50, completedWidth, 30);

    ctx.fillStyle = '#f44336';
    ctx.fillRect(50 + completedWidth, 50, pendingWidth, 30);

    ctx.strokeStyle = '#004080';
    ctx.strokeRect(50, 50, 200, 30);

    // Tooltip
    progressChart.onmousemove = (e) => {
      const rect = progressChart.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.clearRect(0, 90, progressChart.width, 40);

      if (y >= 50 && y <= 80 && x >= 50 && x <= 250) {
        ctx.fillStyle = isDarkMode ? "#ffffff" : "#333333";
        ctx.font = '14px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText(
          x <= 50 + completedWidth ? `Completed: ${completed}` : `Pending: ${pending}`,
          150, 110
        );
      }
    };

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

      gctx.strokeStyle = "#ddd";
      gctx.lineWidth = 15;
      gctx.beginPath();
      gctx.arc(100, 100, 80, 0, 2 * Math.PI);
      gctx.stroke();

      gctx.strokeStyle = "#4CAF50";
      gctx.beginPath();
      gctx.arc(100, 100, 80, -Math.PI/2, (2 * Math.PI * percent) - Math.PI/2);
      gctx.stroke();

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

    // Streak Tracker Display
    if (streakSection && longestSection) {
      const currentStreak = localStorage.getItem("currentStreak") || 0;
      const longestStreak = localStorage.getItem("longestStreak") || 0;

      streakSection.textContent = `🔥 Current Streak: ${currentStreak} day(s)`;
      longestSection.textContent = `🏆 Longest Streak: ${longestStreak} day(s)`;
    }
  }
}

// Run once on page load
drawProgressPage();