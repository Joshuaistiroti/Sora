// trivia.js – dynamic trivia quiz with randomised questions and score tracking

document.addEventListener('DOMContentLoaded', () => {
  const triviaForm = document.getElementById('trivia-form');
  const container = document.getElementById('trivia-container');
  const resultEl = document.getElementById('trivia-result');

  // Pool of possible trivia questions. Each entry contains the
  // question text, an array of answer options and the correct answer.
  const questionPool = [
    {
      question: 'Who believes naps are a competitive sport?',
      options: ['Izo', 'Niv', 'Deyvi', 'Rifo'],
      answer: 'Rifo'
    },
    {
      question: 'Which friend once tried cereal with coffee instead of milk?',
      options: ['Izo', 'Niv', 'Rifo', 'Cefi'],
      answer: 'Niv'
    },
    {
      question: 'Who has a collection of weird socks for every occasion?',
      options: ['Deyvi', 'Rifo', 'Izo', 'Niv'],
      answer: 'Rifo'
    },
    {
      question: 'Which friend is known for turning quiet grind into loud results?',
      options: ['Izo', 'Niv', 'Cefi', 'Beru'],
      answer: 'Izo'
    },
    {
      question: 'Whose pickup lines belong in a museum?',
      options: ['Cefi', 'Rifo', 'Niv', 'Yoyo'],
      answer: 'Cefi'
    },
    {
      question: 'Who keeps the group laughing with quick wit and battery life?',
      options: ['Niv', 'Izo', 'Deyvi', 'Beru'],
      answer: 'Niv'
    },
    {
      question: 'Who stays chill and hits hard?',
      options: ['Yoyo', 'Beru', 'Rifo', 'Cefi'],
      answer: 'Yoyo'
    },
    {
      question: "Whose motto is 'Life too fast, I'm not'?",
      options: ['Beru', 'Yoyo', 'Niv', 'Deyvi'],
      answer: 'Beru'
    }
  ];

  // Render a random set of questions into the trivia form
  function renderQuestions() {
    container.innerHTML = '';
    const indexes = [];
    // Select three unique random questions from the pool
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
        input.name = 't' + (qi + 1);
        input.value = opt;
        if (opt === q.options[0]) input.required = true;
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + opt));
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
      });
      // Store the correct answer on the div for checking later
      div.dataset.correct = q.answer;
      container.appendChild(div);
    });
  }

  renderQuestions();

  triviaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let correctCount = 0;
    // Loop through each rendered question container to check answers
    const questions = container.querySelectorAll('.quiz-question');
    questions.forEach((div, index) => {
      const name = 't' + (index + 1);
      const selected = triviaForm.querySelector(`input[name="${name}"]:checked`);
      if (selected && selected.value === div.dataset.correct) {
        correctCount++;
      }
    });
    resultEl.textContent = `You got ${correctCount} out of ${questions.length} questions correct!`;
    resultEl.classList.remove('hidden');
    // Prompt for name and store score
    const player = prompt('Enter your name for the leaderboard (optional):');
    if (player) {
      const existing = JSON.parse(localStorage.getItem('triviaScores') || '[]');
      existing.push({ name: player, score: correctCount });
      localStorage.setItem('triviaScores', JSON.stringify(existing));
    }
  });
});