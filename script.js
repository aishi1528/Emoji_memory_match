const emojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let timer = 0;
let gameStarted = false;
let interval;
let shuffleInterval;

const board = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const message = document.getElementById('message');

function shuffleCards() {
  const doubled = [...emojis, ...emojis];
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

function startGame() {
  cards = shuffleCards();
  board.innerHTML = '';
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerText = emoji;
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
  firstCard = null;
  secondCard = null;
  moves = 0;
  matchedPairs = 0;
  movesDisplay.innerText = 'Moves: 0';
  message.innerText = '';
  resetTimer();
}

function flipCard() {
  if (lockBoard || this.classList.contains('matched') || this === firstCard) return;

  this.classList.add('flipped');

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
    shuffleInterval = setInterval(shuffleBoard, 10000); // shuffle every 10 sec
  }

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    lockBoard = true;
    moves++;
    movesDisplay.innerText = `Moves: ${moves}`;
    checkForMatch();
  }
}

function checkForMatch() {
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    if (matchedPairs === emojis.length) {
      clearInterval(interval);
      clearInterval(shuffleInterval);
      message.innerText = `🎉 You Win in ${moves} moves and ${timer} seconds!`;
    }
    resetFlips();
  } else {
    // Flip back immediately without delay:
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetFlips();
  }
}

function resetFlips() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function startTimer() {
  interval = setInterval(() => {
    timer++;
    timerDisplay.innerText = `Time: ${timer}s`;
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  clearInterval(shuffleInterval);
  timer = 0;
  gameStarted = false;
  timerDisplay.innerText = 'Time: 0s';
}

function shuffleBoard() {
  const currentEmojis = shuffleCards();
  document.querySelectorAll('.card').forEach((card, i) => {
    if (!card.classList.contains('matched')) {
      card.dataset.emoji = currentEmojis[i];
      card.innerText = currentEmojis[i];
      card.classList.remove('flipped');
    }
  });
  resetFlips();
}

startGame();

