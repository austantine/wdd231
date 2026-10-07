import { updateFooter, loadTheme, saveTheme } from './storage.js';
import { initTasks } from './tasks.js';
import { initProgress } from './progress.js';
import { initActionForm } from './action-form.js';

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
  
// ========================================
// Dark Mode Toggle with Persistence
// ========================================
const toggleBtn = document.getElementById("dark-mode-toggle");
if (toggleBtn) {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function applyTheme(isDark) {
    if (isDark) {
      document.body.classList.add("dark-mode");
      toggleBtn.textContent = "☀️ Light Mode";
    } else {
      document.body.classList.remove("dark-mode");
      toggleBtn.textContent = "🌙 Dark Mode";
    }
  }

  // Apply saved theme or system preference
  applyTheme(savedTheme === "dark" || (!savedTheme && prefersDark));

  // Toggle on click
  toggleBtn.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
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
  

  // Page-specific initializers
  initTasks();
  initProgress();
  initActionForm(); // Runs only if action-form elements exist
});
