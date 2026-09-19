console.log("✅ chamber.js is loaded");

document.addEventListener("DOMContentLoaded", () => {
    // ==============================
    // Mobile Navigation Toggle
    // ==============================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'block' ? 'none' : 'block';
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

        // Initial load
        applyTheme(savedTheme === "dark" || (!savedTheme && prefersDark));

        // Toggle on click
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
        const apiKey = "REPLACE_WITH_YOUR_OPENWEATHERMAP_API_KEY"; // must be valid
        const city = "Benin City,NG"; // add country code for reliability
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        async function getWeather() {
            try {
                console.log("Fetching weather from:", url);
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
                const data = await response.json();
                console.log("Weather data loaded:", data);

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
                    const forecast = data.list[i * 8];
                    if (forecast) {
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
                console.log("Fetching members from: data/members.json");
                const response = await fetch("data/members.json");
                if (!response.ok) throw new Error(`Members JSON error: ${response.status}`);
                const members = await response.json();
                console.log("Members data loaded:", members);

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
            <img src="images/${member.image}" alt="${member.name} logo">
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
});
