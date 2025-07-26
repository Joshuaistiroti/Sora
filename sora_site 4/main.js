// main.js – adds fun interactive elements to the SØRA Friends site

// Initialize interactive elements once the DOM is ready. If the script is loaded
// after the DOM has already been parsed, invoke immediately; otherwise wait
// for DOMContentLoaded.
function initSoraInteractive() {
  // Countdown timer for the upcoming drop. Adjust the target date as needed.
  const countdownEl = document.getElementById('drop-countdown');
  if (countdownEl) {
    // Set the target drop date (YYYY-MM-DD). Here we pick 2025‑10‑01 as a placeholder.
    const dropDate = new Date('2025-10-01T00:00:00');
    function updateCountdown() {
      const now = new Date();
      const diff = dropDate - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else {
        countdownEl.textContent = 'Drop is live!';
      }
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Display a random fun fact about the friends to keep the site lively
  const funFactEl = document.getElementById('fun-fact');
  if (funFactEl) {
    const facts = [
      'Izo can recite entire scenes from his favourite movies on command.',
      'Niv once tried to eat cereal with coffee instead of milk (spoiler: he loved it).',
      'Deyvi believes naps are a competitive sport.',
      'Rifo has a collection of weird socks for every occasion.',
      'Cefi is convinced his pickup lines belong in a museum.'
    ];
    const fact = facts[Math.floor(Math.random() * facts.length)];
    funFactEl.textContent = fact;
  }

  // Easter egg handler: when a user clicks the coffee cup icon in any footer,
  // reward them with a secret message. This encourages exploration and adds
  // a playful hidden interaction. The icon's presence is defined in each
  // footer via an element with id="easter-egg".
  // Handle all instances of the easter egg icon (there can be one per page).
  const easterEggEls = document.querySelectorAll('#easter-egg');
  easterEggEls.forEach((egg) => {
    egg.style.cursor = 'pointer';
    egg.title = 'Click me!';
    egg.addEventListener('click', () => {
      // Create a temporary toast-like message on screen instead of using alert.
      const msg = document.createElement('div');
      msg.className = 'secret-message';
      msg.textContent = "☕ You found Rifo's secret coffee stash! Enjoy a virtual cup on us!";
      document.body.appendChild(msg);
      // Remove the message after a few seconds
      setTimeout(() => {
        if (msg.parentNode) msg.parentNode.removeChild(msg);
      }, 5000);
    });
  });
}

// Execute the initializer depending on document ready state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSoraInteractive);
} else {
  initSoraInteractive();
}