// ===============================
// Responsive Menu Toggle
// ===============================
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen); // accessibility
});

// ===============================
// Dynamic Year & Last Modified
// ===============================
document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = "Last Modified: " + document.lastModified;

// ===============================
// Courses Array
// ===============================
const courses = [
  { code: "WDD 130", name: "Web Fundamentals", credits: 3, type: "WDD", completed: true },
  { code: "WDD 131", name: "Responsive Design", credits: 3, type: "WDD", completed: true },
  { code: "WDD 231", name: "Frontend Web Development", credits: 3, type: "WDD", completed: false },
  { code: "CSE 110", name: "Programming Basics", credits: 3, type: "CSE", completed: true },
  { code: "CSE 111", name: "Functions", credits: 3, type: "CSE", completed: true },
  { code: "CSE 210", name: "Programming with Classes", credits: 3, type: "CSE", completed: true }
];

// ===============================
// Display Courses
// ===============================
function displayCourses(filter = "All") {
  const list = document.getElementById("course-list");
  list.innerHTML = "";

  let filtered = courses.filter(c => filter === "All" || c.type === filter);

  filtered.forEach(c => {
    const div = document.createElement("div");
    div.className = c.completed ? "course completed" : "course";
    div.setAttribute("role", "listitem"); // accessibility
    div.textContent = `${c.code} - ${c.name}`;
    list.appendChild(div);
  });

  // Credits for filtered courses
  const total = filtered.reduce((sum, c) => sum + c.credits, 0);
  document.getElementById("total-credits").textContent = total;

  // Completed credits overall
  const completedCredits = courses
    .filter(c => c.completed)
    .reduce((sum, c) => sum + c.credits, 0);
  document.getElementById("completed-credits").textContent = completedCredits;
}

// ===============================
// Active Button Highlight (Wayfinding)
// ===============================
function setActiveButton(activeId) {
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById(activeId).classList.add("active");
}

// ===============================
// Event Listeners
// ===============================
document.getElementById("all").addEventListener("click", () => {
  displayCourses("All");
  setActiveButton("all");
});
document.getElementById("cse").addEventListener("click", () => {
  displayCourses("CSE");
  setActiveButton("cse");
});
document.getElementById("wdd").addEventListener("click", () => {
  displayCourses("WDD");
  setActiveButton("wdd");
});

// ===============================
// Initial Load
// ===============================
displayCourses();
setActiveButton("all");
