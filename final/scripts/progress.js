// ===================================================================
// Reset, confirm, and cancel buttons for streak reset functionality
// ==================================================================

const resetStreakBtn = document.getElementById("resetStreakBtn");
const confirmResetBtn = document.getElementById("confirmResetBtn");
const cancelResetBtn = document.getElementById("cancelResetBtn");
const resetModal = document.getElementById("resetModal");
const resetSuccessBanner = document.getElementById("resetSuccessBanner");
const dismissResetBanner = document.getElementById("dismissResetBanner");
const streakSection = document.getElementById("currentStreak");
const longestSection = document.getElementById("longestStreak");

function drawStreaks() {
  const currentStreak = parseInt(localStorage.getItem("currentStreak")) || 0;
  const longestStreak = parseInt(localStorage.getItem("longestStreak")) || 0;

  if (streakSection) streakSection.textContent = `🔥 Current Streak: ${currentStreak} day(s)`;
  if (longestSection) longestSection.textContent = `🏆 Longest Streak: ${longestStreak} day(s)`;
}

function showResetSuccessBanner() {
  if (resetSuccessBanner) {
    resetSuccessBanner.style.display = "flex";
    setTimeout(() => {
      resetSuccessBanner.style.display = "none";
    }, 5000);
  }
}

if (resetStreakBtn) {
  resetStreakBtn.addEventListener("click", () => {
    if (resetModal) resetModal.style.display = "block";
  });
}

if (cancelResetBtn) {
  cancelResetBtn.addEventListener("click", () => {
    if (resetModal) resetModal.style.display = "none";
  });
}

if (confirmResetBtn) {
  confirmResetBtn.addEventListener("click", () => {
    localStorage.setItem("currentStreak", "0");
    localStorage.setItem("longestStreak", "0");
    drawStreaks();
    if (resetModal) resetModal.style.display = "none";
    showResetSuccessBanner();
  });
}

if (dismissResetBanner) {
  dismissResetBanner.addEventListener("click", () => {
    resetSuccessBanner.style.display = "none";
  });
}

// Run once on page load
drawStreaks();
