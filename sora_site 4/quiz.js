// quiz.js – dynamic personality quiz that randomises questions each visit and stores scores

document.addEventListener('DOMContentLoaded', () => {
  const quizForm = document.getElementById('quiz-form');
  const container = document.getElementById('quiz-container');
  const resultEl = document.getElementById('quiz-result');

  // Define a pool of possible questions with options mapped to friends
  const questionPool = [
    {
      question: "What's your ideal Friday night?",
      options: [
        { text: 'Coding a side project', value: 'Izo' },
        { text: 'Music festival with friends', value: 'Niv' },
        { text: 'Camping under the stars', value: 'Deyvi' },
        { text: 'Sleeping early – I\'m exhausted', value: 'Rifo' },
        { text: 'Dinner date & dancing', value: 'Cefi' },
        { text: 'Chilling by the ocean', value: 'Yoyo' },
        { text: 'Watching the sunset quietly', value: 'Beru' }
      ]
    },
    {
      question: 'Pick a motto:',
      options: [
        { text: 'Quiet grind, loud results', value: 'Izo' },
        { text: 'CTRL + ALT + WTF', value: 'Niv' },
        { text: 'Small size, major impact', value: 'Deyvi' },
        { text: 'Out of bed = big deal', value: 'Rifo' },
        { text: 'Flirts hard, loves harder', value: 'Cefi' },
        { text: 'Stay chill, hit hard', value: 'Yoyo' },
        { text: 'Life too fast, I\'m not', value: 'Beru' }
      ]
    },
    {
      question: 'Your favourite beverage?',
      options: [
        { text: 'Espresso', value: 'Izo' },
        { text: 'Energy drink', value: 'Niv' },
        { text: 'Herbal tea', value: 'Deyvi' },
        { text: 'Anything caffeinated', value: 'Rifo' },
        { text: 'A fancy cocktail', value: 'Cefi' },
        { text: 'Lemonade', value: 'Yoyo' },
        { text: 'Calm chamomile tea', value: 'Beru' }
      ]
    },
    {
      question: 'Choose a vacation spot:',
      options: [
        { text: 'Tokyo hackathon', value: 'Izo' },
        { text: 'Barcelona music festival', value: 'Niv' },
        { text: 'Hiking the Alps', value: 'Deyvi' },
        { text: 'Spa retreat in Bali', value: 'Rifo' },
        { text: 'Romantic Paris getaway', value: 'Cefi' },
        { text: 'Surfing in Hawaii', value: 'Yoyo' },
        { text: 'Quiet cabin in the woods', value: 'Beru' }
      ]
    }
  ];

  function renderQuestions() {
    container.innerHTML = '';
    // Select three unique random questions
    const indexes = [];
    while (indexes.length < 3) {
      const idx = Math.floor(Math.random() * questionPool.length);
      if (!indexes.includes(idx)) indexes.push(idx);
    }
    indexes.forEach((idx, qi) => {
      const q = questionPool[idx];
      const div = document.createElement('div');
      div.className = 'quiz-question';
      const p = document.createElement('p');
      p.textContent = `${qi + 1}. ${q.question}`;
      div.appendChild(p);
      q.options.forEach(opt => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q' + (qi + 1);
        input.value = opt.value;
        if (opt === q.options[0]) input.required = true;
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + opt.text));
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
      });
      container.appendChild(div);
    });
  }

  renderQuestions();

  quizForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(quizForm);
    // Initialise counts for all friends
    const counts = { Izo: 0, Niv: 0, Deyvi: 0, Rifo: 0, Cefi: 0, Yoyo: 0, Beru: 0 };
    for (const pair of formData.entries()) {
      const friend = pair[1];
      counts[friend]++;
    }
    // Find winner and max count
    let winner = null;
    let max = -Infinity;
    Object.keys(counts).forEach(name => {
      if (counts[name] > max) {
        max = counts[name];
        winner = name;
      }
    });
    // Display result
    const messages = {
      Izo: "You're most like Izo – the quiet genius with a big heart.",
      Niv: "You're most like Niv – a lightning bolt of energy and fun.",
      Deyvi: "You're most like Deyvi – proof that big things come in small packages.",
      Rifo: "You're most like Rifo – master of naps and one‑liners.",
      Cefi: "You're most like Cefi – charming, cheeky and always loyal.",
      Yoyo: "You're most like Yoyo – cool, collected and always ready to strike.",
      Beru: "You're most like Beru – laid back but surprisingly quick when needed."
    };
    resultEl.textContent = messages[winner] || '';
    resultEl.classList.remove('hidden');
    // Prompt for name to store score
    const name = prompt('Enter your name to record your result on the leaderboard (optional):');
    if (name) {
      const score = max; // number of answers that match the winner
      const existing = JSON.parse(localStorage.getItem('quizScores') || '[]');
      existing.push({ name, score });
      localStorage.setItem('quizScores', JSON.stringify(existing));
    }
  });
});