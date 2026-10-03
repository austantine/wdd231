
    // ==============================
    // Mobile Navigation Toggle
    // ==============================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // ==============================
    // Footer Dates
    // ==============================
    const yearEl = document.getElementById('year');
    const lastModifiedEl = document.getElementById('lastModified');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified;

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
                toggleBtn.classList.add("dark");
            } else {
                document.body.classList.remove("dark-mode");
                toggleBtn.textContent = "🌙 Dark Mode";
                toggleBtn.classList.remove("dark");
            }
        }

        applyTheme(savedTheme === "dark" || (!savedTheme && prefersDark));

        toggleBtn.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark-mode");
            applyTheme(isDark);
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }

    
  // ==============================
// Discover Page Logic (Banner + Randomized + Shuffle Again + Fade-in)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    const discoverGrid = document.querySelector(".discover-grid");
    const visitorMessage = document.getElementById("visitor-message");
  
    // --- Visitor Message using localStorage ---
    if (visitorMessage) {
      const lastVisit = localStorage.getItem("lastVisit");
      const now = Date.now();
      let messageText = "";
  
      if (!lastVisit) {
        messageText = "👋 Welcome! Let us know if you have any questions.";
      } else {
        const days = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
        if (days < 1) {
          messageText = "⚡ Back so soon! Awesome!";
        } else if (days === 1) {
          messageText = "📅 You last visited 1 day ago.";
        } else {
          messageText = `📅 You last visited ${days} days ago.`;
        }
      }
      localStorage.setItem("lastVisit", now);
      visitorMessage.textContent = messageText;
    }
  
    // --- Load Discover Cards from members.json ---
    if (discoverGrid) {
      async function loadDiscover() {
        try {
          const response = await fetch("data/members.json");
          if (!response.ok) throw new Error(`Discover JSON error: ${response.status}`);
          const members = await response.json();
  
          // Shuffle members array
          const shuffled = members.sort(() => 0.5 - Math.random());
  
          // Select first 9 after shuffle
          const items = shuffled.slice(0, 9);
  
          // Clear grid before re-rendering
          discoverGrid.innerHTML = "";
  
          items.forEach((member, index) => {
            const card = document.createElement("section");
            card.classList.add("card", "fade-in"); // add fade-in class
            card.style.animationDelay = `${index * 0.1}s`; // staggered animation
            card.innerHTML = `
              <h2>${member.name}</h2>
              <figure>
                <img src="images/${member.image}" alt="${member.name}" loading="lazy">
              </figure>
              <address>${member.address}</address>
              <p>${member.info}</p>
              <button>Learn More</button>
            `;
            discoverGrid.appendChild(card);
          });
  
          // Add Shuffle Again button if not already present
          if (!document.getElementById("shuffle-btn")) {
            const shuffleBtn = document.createElement("button");
            shuffleBtn.id = "shuffle-btn";
            shuffleBtn.textContent = "🔄 Shuffle Again";
            shuffleBtn.addEventListener("click", loadDiscover);
            discoverGrid.parentElement.appendChild(shuffleBtn);
          }
        } catch (error) {
          console.error("Error loading discover items:", error);
          discoverGrid.innerHTML = "<p>Error loading discover items.</p>";
        }
      }
      loadDiscover();
    }
  });

  // ==============================
// Discover Page Logic (Expand/Collapse Learn More)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    const discoverGrid = document.querySelector(".discover-grid");
    const visitorMessage = document.getElementById("visitor-message");
  
    // --- Visitor Message using localStorage ---
    if (visitorMessage) {
      const lastVisit = localStorage.getItem("lastVisit");
      const now = Date.now();
      let messageText = "";
  
      if (!lastVisit) {
        messageText = "👋 Welcome! Let us know if you have any questions.";
      } else {
        const days = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
        if (days < 1) {
          messageText = "⚡ Back so soon! Awesome!";
        } else if (days === 1) {
          messageText = "📅 You last visited 1 day ago.";
        } else {
          messageText = `📅 You last visited ${days} days ago.`;
        }
      }
      localStorage.setItem("lastVisit", now);
      visitorMessage.textContent = messageText;
    }
  
    // --- Load Discover Cards from members.json ---
    if (discoverGrid) {
      async function loadDiscover() {
        try {
          const response = await fetch("data/members.json");
          if (!response.ok) throw new Error(`Discover JSON error: ${response.status}`);
          const members = await response.json();
  
          // Shuffle members array
          const shuffled = members.sort(() => 0.5 - Math.random());
  
          // Select first 8 after shuffle
          const items = shuffled.slice(0, 8);
  
          // Clear grid before re-rendering
          discoverGrid.innerHTML = "";
  
          items.forEach((member) => {
            const card = document.createElement("section");
            card.classList.add("card", "fade-in");
            card.innerHTML = `
              <h2>${member.name}</h2>
              <figure>
                <img src="images/${member.image}" alt="${member.name}" loading="lazy">
              </figure>
              <address>${member.address}</address>
              <p>${member.info}</p>
              <div class="extra-info" style="display:none;">
                <p>📞 ${member.phone}</p>
                <p><a href="${member.website}" target="_blank">Visit Website</a></p>
              </div>
              <button class="learn-more-btn">Learn More</button>
            `;
  
            // Toggle extra info on button click
            const btn = card.querySelector(".learn-more-btn");
            const extra = card.querySelector(".extra-info");
            btn.addEventListener("click", () => {
              if (extra.style.display === "none") {
                extra.style.display = "block";
                btn.textContent = "Close";
              } else {
                extra.style.display = "none";
                btn.textContent = "Learn More";
              }
            });
  
            discoverGrid.appendChild(card);
          });
  
          // Add Shuffle Again button if not already present
          if (!document.getElementById("shuffle-btn")) {
            const shuffleBtn = document.createElement("button");
            shuffleBtn.id = "shuffle-btn";
            shuffleBtn.textContent = "🔄 Shuffle Again";
            shuffleBtn.addEventListener("click", loadDiscover);
            discoverGrid.parentElement.appendChild(shuffleBtn);
          }
        } catch (error) {
          console.error("Error loading discover items:", error);
          discoverGrid.innerHTML = "<p>Error loading discover items.</p>";
        }
      }
      loadDiscover();
    }
  });
  
