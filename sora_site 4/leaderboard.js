// leaderboard.js – display top scores for the personality quiz and trivia

document.addEventListener('DOMContentLoaded', () => {
  const quizBoard = document.getElementById('quiz-board');
  const triviaBoard = document.getElementById('trivia-board');
  const quizScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
  const triviaScores = JSON.parse(localStorage.getItem('triviaScores') || '[]');

  function render(board, scores) {
    board.innerHTML = '';
    if (!scores.length) {
      const li = document.createElement('li');
      li.textContent = 'No scores yet. Take the quiz or trivia!';
      board.appendChild(li);
      return;
    }
    // Sort scores descending by score
    scores.sort((a, b) => b.score - a.score);
    scores.slice(0, 5).forEach((item, index) => {
      const li = document.createElement('li');
      let medal = '';
      if (index === 0) medal = '🥇 ';
      else if (index === 1) medal = '🥈 ';
      else if (index === 2) medal = '🥉 ';
      li.textContent = `${medal}${item.name} – ${item.score}`;
      board.appendChild(li);
    });
  }

  render(quizBoard, quizScores);
  render(triviaBoard, triviaScores);
});