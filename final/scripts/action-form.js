// action-form.js
export function initActionForm() {
    const formDataDiv = document.getElementById("formData");
    const successBanner = document.getElementById("successBanner");
    const dismissBtn = document.getElementById("dismissBanner");
  
    if (!formDataDiv) return; // Only run if we're on action-form.html
  
    // Display submitted form data
    const params = new URLSearchParams(window.location.search);
    formDataDiv.innerHTML = `
      <p><strong>Task Title:</strong> ${params.get("taskTitle") || "N/A"}</p>
      <p><strong>Deadline:</strong> ${params.get("taskDeadline") || "N/A"}</p>
      <p><strong>Category:</strong> ${params.get("taskCategory") || "N/A"}</p>
    `;
  
    // Dismiss banner manually
    dismissBtn?.addEventListener("click", () => {
      successBanner.classList.add("dismissed");
      successBanner.addEventListener("animationend", () => {
        successBanner.style.display = "none";
      }, { once: true });
    });
  
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      if (successBanner && successBanner.style.display !== "none") {
        successBanner.classList.add("dismissed");
        successBanner.addEventListener("animationend", () => {
          successBanner.style.display = "none";
        }, { once: true });
      }
    }, 5000);
  }
  