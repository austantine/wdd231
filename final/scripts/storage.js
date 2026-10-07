// storage.js
export function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  
  export function loadTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }
  
  export function saveTheme(theme) {
    localStorage.setItem("theme", theme);
  }
  
  export function loadTheme() {
    return localStorage.getItem("theme") || "light";
  }
  
  export function updateFooter() {
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = document.lastModified;
  }
  