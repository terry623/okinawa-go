// iOS PWA helper script
(function () {
  // Check if the app is running in standalone mode (added to home screen)
  if (window.navigator.standalone) {
    document.documentElement.classList.add("ios-pwa");

    // Handle internal links to prevent opening in Safari
    document.addEventListener("click", function (e) {
      var target = e.target;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }

      if (target && target.getAttribute("href")) {
        var href = target.getAttribute("href");

        // Only handle internal links
        if (href.startsWith("/") || href.startsWith(window.location.origin)) {
          e.preventDefault();
          window.location.href = href;
        }
      }
    });

    // Add a class to the body when the app is loaded from home screen
    document.body.classList.add("standalone-mode");
  }
})();
