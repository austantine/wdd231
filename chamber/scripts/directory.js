console.log("✅ directory.js is loaded");

document.addEventListener("DOMContentLoaded", () => {
    // ==============================
    // Environment Detection
    // ==============================
    const isDev = location.hostname === "localhost" || location.hostname === "127.0.0.1";

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
// Weather API
// ==============================
const weatherContainer = document.getElementById("weather-info");
if (weatherContainer) {
    const apiKey = "YOUR_REAL_OPENWEATHERMAP_API_KEY"; // replace with your valid key
    const city = "Benin,NG"; // try "Benin City,NG" if needed
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Auto-detect environment: localhost = dev, otherwise production
    const isDev = location.hostname === "localhost" || location.hostname === "127.0.0.1";

    async function getWeather() {
        try {
            if (isDev) console.log("Fetching weather from:", url);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
            const data = await response.json();
            if (isDev) console.log("Weather data loaded:", data);

            if (!data.list || data.list.length === 0) {
                weatherContainer.innerHTML = "<p>No weather data available.</p>";
                return;
            }

            const current = data.list[0];
            let html = `
                <p>🌡️ Current Temp: ${current.main.temp}°C</p>
                <p>☁️ Condition: ${current.weather[0].description}</p>
                <h3>3-Day Forecast</h3><ul>
            `;

            for (let i = 1; i <= 3; i++) {
                const index = i * 8; // 8 intervals ≈ 24 hours
                if (index < data.list.length) {
                    const forecast = data.list[index];
                    html += `<li>${new Date(forecast.dt_txt).toDateString()}: ${forecast.main.temp}°C</li>`;
                }
            }

            html += "</ul>";
            weatherContainer.innerHTML = html;
        } catch (error) {
            console.error("Error fetching weather:", error);
            weatherContainer.innerHTML = "<p>Error loading weather data.</p>";
        }
    }
    getWeather();
}

    // ==============================
    // Company Spotlights
    // ==============================
    const spotlightContainer = document.getElementById("spotlight-container");
    if (spotlightContainer) {
        async function loadSpotlights() {
            try {
                if (isDev) console.log("Fetching members from: data/members.json");
                const response = await fetch("data/members.json");
                if (!response.ok) throw new Error(`Members JSON error: ${response.status}`);
                const data = await response.json();
                const members = data.members || data;
                if (isDev) console.log("Members data loaded:", members);

                const goldSilver = members.filter(m => m.membership === "Gold" || m.membership === "Silver");
                if (goldSilver.length === 0) {
                    spotlightContainer.innerHTML = "<p>No Gold or Silver members found.</p>";
                    return;
                }

                const randomMembers = goldSilver.sort(() => 0.5 - Math.random()).slice(0, 3);

                spotlightContainer.innerHTML = "";
                randomMembers.forEach(member => {
                    const card = document.createElement("div");
                    card.classList.add("spotlight-card", "community-card");
                    card.innerHTML = `
                        <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
                        <h3>${member.name}</h3>
                        <p>📞 ${member.phone}</p>
                        <p>📍 ${member.address}</p>
                        <p><a href="${member.website}" target="_blank">Visit Website</a></p>
                        <p>Membership: ${member.membership}</p>
                    `;
                    spotlightContainer.appendChild(card);
                });
            } catch (error) {
                console.error("Error loading spotlights:", error);
                spotlightContainer.innerHTML = "<p>Error loading member spotlights.</p>";
            }
        }
        loadSpotlights();
    }

    // ==============================
    // Chamber Directory Members
    // ==============================
    const membersContainer = document.getElementById("members");
    const gridBtn = document.getElementById("grid");
    const listBtn = document.getElementById("list");

    async function loadMembers() {
        try {
            if (isDev) console.log("Fetching directory members from: data/members.json");
            const response = await fetch("data/members.json");
            if (!response.ok) throw new Error(`Members JSON error: ${response.status}`);
            const data = await response.json();
            const members = data.members || data;
            if (isDev) console.log("Directory members loaded:", members);
            displayMembers(members);
        } catch (error) {
            console.error("Error loading members:", error);
            membersContainer.innerHTML = "<p>Error loading member directory.</p>";
        }
    }

    function displayMembers(members) {
        membersContainer.innerHTML = "";
        members.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
                <h3>${member.name}</h3>
                <p>📍 ${member.address}</p>
                <p>📞 ${member.phone}</p>
                <p><a href="${member.website}" target="_blank">Visit Website</a></p>
                <p>Membership: ${member.membership}</p>
                <p>${member.info}</p>
            `;
            membersContainer.appendChild(card);
        });
    }

    if (gridBtn && listBtn) {
        gridBtn.addEventListener("click", () => {
            membersContainer.classList.add("grid");
            membersContainer.classList.remove("list");
            membersContainer.querySelectorAll(".card img").forEach(img => img.style.display = "block");
        });

        listBtn.addEventListener("click", () => {
            membersContainer.classList.add("list");
            membersContainer.classList.remove("grid");
            membersContainer.querySelectorAll(".card img").forEach(img => img.style.display = "none");
        });
    }

    if (membersContainer) {
        loadMembers();
    }
});

// ==============================
    // Join Membership Page
    // ==============================
// Auto-fill timestamp when form loads

    document.addEventListener("DOMContentLoaded", () => {
        const tsField = document.getElementById("timestamp");
        if (tsField) {
          tsField.value = new Date().toISOString();
        }
      
        // Modal open triggers
        document.querySelectorAll(".membership-cards a").forEach(link => {
          link.addEventListener("click", e => {
            e.preventDefault();
            const modalId = link.getAttribute("href").replace("#", "");
            const modal = document.getElementById(modalId);
            if (modal) modal.showModal();
          });
        });
      
        // Modal close triggers
        document.querySelectorAll(".close-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const modal = document.getElementById(targetId);
            if (modal) modal.close();
          });
        });
      
        // Optional: allow ESC key to close any open modal
        document.addEventListener("keydown", e => {
          if (e.key === "Escape") {
            document.querySelectorAll("dialog[open]").forEach(modal => modal.close());
          }
        });
      });
      
  
  // Thank You page population
document.addEventListener("DOMContentLoaded", () => {
    const thankyouContainer = document.querySelector(".thankyou-container");
    if (thankyouContainer) {
      const params = new URLSearchParams(window.location.search);
      ["firstName","lastName","email","phone","organization","timestamp"].forEach(field => {
        const el = document.getElementById(field);
        if (el) el.textContent = params.get(field);
      });
    }
  });
  

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
  