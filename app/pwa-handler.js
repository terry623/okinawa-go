"use client";

// This script helps with PWA behavior on iOS
if (typeof window !== "undefined") {
  // Check if the app is in standalone mode (launched from home screen)
  const isInStandaloneMode = () =>
    window.navigator.standalone ||
    window.matchMedia("(display-mode: standalone)").matches;

  // Add event listener when the page loads
  window.addEventListener("DOMContentLoaded", () => {
    // If the app is in standalone mode, we can add specific behaviors here
    if (isInStandaloneMode()) {
      // For example, prevent default link behavior and handle navigation manually
      document.addEventListener("click", (e) => {
        const target = e.target.closest("a");
        if (target && target.getAttribute("href").startsWith("/")) {
          e.preventDefault();
          window.location.href = target.href;
        }
      });
    }
  });
}

export default function PWAHandler() {
  return null; // This component doesn't render anything
}
