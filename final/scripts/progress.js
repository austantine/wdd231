// ===================================================================
// Reset, confirm, and cancel buttons for streak reset functionality
// ==================================================================

// DOM references
const streakSection = document.getElementById("currentStreak");
const longestSection = document.getElementById("longestStreak");
const resetStreakBtn = document.getElementById("resetStreakBtn");
const confirmResetBtn = document.getElementById("confirmResetBtn");
const cancelResetBtn = document.getElementById("cancelResetBtn");
const resetModal = document.getElementById("resetModal");
const resetSuccessBanner = document.getElementById("resetSuccessBanner");
const dismissResetBanner = document.getElementById("dismissResetBanner");

// Helper: format date as YYYY-MM-DD
function getToday() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// Display streaks
function drawStreaks() {
  const currentStreak = parseInt(localStorage.getItem("currentStreak")) || 0;
  const longestStreak = parseInt(localStorage.getItem("longestStreak")) || 0;

  if (streakSection) streakSection.textContent = `🔥 Current Streak: ${currentStreak} day(s)`;
  if (longestSection) longestSection.textContent = `🏆 Longest Streak: ${longestStreak} day(s)`;
}

// Update streaks when a task is completed
function updateStreak() {
  const today = getToday();
  const lastCompletionDate = localStorage.getItem("lastCompletionDate");
  let currentStreak = parseInt(localStorage.getItem("currentStreak")) || 0;
  let longestStreak = parseInt(localStorage.getItem("longestStreak")) || 0;

  if (lastCompletionDate === today) {
    // Already counted today → do nothing
  } else if (lastCompletionDate) {
    const lastDate = new Date(lastCompletionDate);
    const diffDays = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak += 1; // consecutive day
    } else {
      currentStreak = 1; // reset streak
    }
  } else {
    currentStreak = 1; // first completion ever
  }

  // Update longest streak
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // Save values
  localStorage.setItem("lastCompletionDate", today);
  localStorage.setItem("currentStreak", currentStreak.toString());
  localStorage.setItem("longestStreak", longestStreak.toString());

  drawStreaks();
}

// Show banner after reset
function showResetSuccessBanner() {
  if (resetSuccessBanner) {
    resetSuccessBanner.style.display = "flex";
    setTimeout(() => {
      resetSuccessBanner.style.display = "none";
    }, 5000);
  }
}

// Reset button → open modal
if (resetStreakBtn) {
  resetStreakBtn.addEventListener("click", () => {
    if (resetModal) resetModal.style.display = "block";
  });
}

// Cancel reset
if (cancelResetBtn) {
  cancelResetBtn.addEventListener("click", () => {
    if (resetModal) resetModal.style.display = "none";
  });
}

// Confirm reset
if (confirmResetBtn) {
  confirmResetBtn.addEventListener("click", () => {
    localStorage.removeItem("lastCompletionDate");
    localStorage.setItem("currentStreak", "0");
    localStorage.setItem("longestStreak", "0");

    drawStreaks();
    if (resetModal) resetModal.style.display = "none";
    showResetSuccessBanner();
  });
}

// Dismiss banner manually
if (dismissResetBanner) {
  dismissResetBanner.addEventListener("click", () => {
    resetSuccessBanner.style.display = "none";
  });
}

// Run once on page load
drawStreaks();
