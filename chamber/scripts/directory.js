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
                        <img src="${member.image}" alt="${member.name} logo" loading="lazy">
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
                <img src="${member.image}" alt="${member.name} logo" loading="lazy">
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
