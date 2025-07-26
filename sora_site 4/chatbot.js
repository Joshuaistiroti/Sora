// chatbot.js – simple simulated chatbots for each SØRA friend

document.addEventListener('DOMContentLoaded', () => {
  // Predefined response lists for each friend
  const responses = {
    Izo: [
      'Yes, quiet but I make noise when necessary.',
      'Let\'s focus and get things done.',
      'You know I love movies, right?'
    ],
    Niv: [
      'Wait, what happened? Let me debug that.',
      'My brain is like a CPU on overdrive!',
      'Ctrl + Alt + Delete solves everything.'
    ],
    Deyvi: [
      'Size doesn\'t matter.',
      'I may be small but my ideas are big!',
      'Impact comes in small packages.'
    ],
    Rifo: [
      'I\'m still waking up...',
      'Coffee is life.',
      'Out of bed for this? Must be serious.'
    ],
    Cefi: [
      'Flirting is an art, my friend.',
      'Love hard or go home.',
      'Did someone say romance?'
    ],
    Yoyo: [
      'Stay chill. Hit hard.',
      'Let\'s keep it cool.',
      'Sometimes silence speaks volumes.'
    ],
    Beru: [
      'Life in slow motion is the way to go.',
      'I prefer to take things easy.',
      'Fast lane? No thanks.'
    ]
  };

  // Attach submit handler to all chat forms
  document.querySelectorAll('.chat-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const character = form.dataset.character;
      const input = form.querySelector('input');
      const userMsg = input.value.trim();
      if (!userMsg) return;
      const windowId = 'chat-window-' + character.toLowerCase();
      const chatWindow = document.getElementById(windowId);
      // Append user message
      const userDiv = document.createElement('div');
      userDiv.className = 'chat-message user';
      userDiv.textContent = userMsg;
      chatWindow.appendChild(userDiv);
      // Generate friend response
      const respList = responses[character] || ['...'];
      const reply = respList[Math.floor(Math.random() * respList.length)];
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-message friend';
      botDiv.textContent = reply;
      chatWindow.appendChild(botDiv);
      // Scroll to bottom
      chatWindow.scrollTop = chatWindow.scrollHeight;
      // Clear input
      input.value = '';
    });
  });
});