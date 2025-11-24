const ChoiceKey = {
  ROCK: "ROCK",
  PAPER: "PAPER",
  SCISSORS: "SCISSORS",
};

const choiceMap = {
  [ChoiceKey.ROCK]: {
    key: ChoiceKey.ROCK,
    displayName: "Kő",
    image: "hand-rock.png",
    beats: ChoiceKey.SCISSORS,
  },
  [ChoiceKey.PAPER]: {
    key: ChoiceKey.PAPER,
    displayName: "Papír",
    image: "hand-paper.png",
    beats: ChoiceKey.ROCK,
  },
  [ChoiceKey.SCISSORS]: {
    key: ChoiceKey.SCISSORS,
    displayName: "Olló",
    image: "hand-scissors.png",
    beats: ChoiceKey.PAPER,
  },
};

const CHOICES = Object.values(choiceMap);

const playerImg = document.getElementById("playerImg");
const computerImg = document.getElementById("computerImg");
const announcement = document.getElementById("announcement");
const newGameButton = document.getElementById("newGameButton");
const playerHandArea = document.getElementById("playerHandArea");
const computerHandArea = document.getElementById("computerHandArea");
const playerWinsCounter = document.getElementById("playerWinsCounter");
const computerWinsCounter = document.getElementById("computerWinsCounter");
const choicesBox = document.getElementById("choicesBox");
const actionsBox = document.getElementById("actionsBox");
const choiceRock = document.getElementById("choiceRock");
const choicePaper = document.getElementById("choicePaper");
const choiceScissors = document.getElementById("choiceScissors");

function getImagePath(filename) {
  return `/public/images/${filename}`;
}

const context = {
  maxWins: 3,
  totalWins: 0,
  playerWins: 0,
  computerWins: 0,
};

function resetGame() {
  playerHandArea.classList.remove("winner-hand");
  computerHandArea.classList.remove("winner-hand");
  context.playerWins = 0;
  context.computerWins = 0;
  announcement.innerHTML = "Készen állsz?";

  updateUi();
}

function updateUi() {
  if (
    context.playerWins === context.maxWins ||
    context.computerWins === context.maxWins
  ) {
    choicesBox.style.opacity = 0;
    actionsBox.style.opacity = 1;
  } else {
    choicesBox.style.opacity = 1;
    actionsBox.style.opacity = 0;
  }

  playerWinsCounter.innerHTML = `${context.playerWins}/${context.maxWins}`;
  computerWinsCounter.innerHTML = `${context.computerWins}/${context.maxWins}`;
}

async function playRound(playerChoice) {
  choicesBox.style.opacity = 0;
  playerHandArea.classList.remove("winner-hand");
  computerHandArea.classList.remove("winner-hand");

  const computerChoice = getRandom(CHOICES);

  playerImg.src = getImagePath("player-hand-rock.png");
  computerImg.src = getImagePath("computer-hand-rock.png");
  playerImg.classList.remove("shake");
  computerImg.classList.remove("shake");

  const texts = ["Kő...", "Papír...", "Ol...", "...ló!"];
  for (let i = 0; i < texts.length; i++) {
    announcement.textContent = texts[i];
    // announcement.style.opacity = "1";

    if (i < 4) {
      playerImg.classList.add("player-shake");
      computerImg.classList.add("computer-shake");
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    playerImg.classList.remove("player-shake");
    computerImg.classList.remove("computer-shake");
    // announcement.style.opacity = "0";

    if (i < texts.length - 1) await new Promise((r) => setTimeout(r, 200));
  }

  // 4. Reveal final choices with a nice bounce
  playerImg.src = getImagePath(`player-${playerChoice.image}`);
  computerImg.src = getImagePath(`computer-${computerChoice.image}`);

  playerImg.style.transform = "scale(1.2)";
  computerImg.style.transform = "scale(1.2)";
  setTimeout(() => {
    playerImg.style.transform = "";
    computerImg.style.transform = "";
  }, 300);

  // 5. Determine winner, etc.
  choicesBox.style.opacity = 1;
  determineWinner(playerChoice, computerChoice);
}

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Example player choice (replace with real buttons or whatever)
function getPlayerChoice() {
  return getRandom(choiceMap);
}

function determineWinner(playerChoice, computerChoice) {
  let winnerHandArea = null;
  let winnerWinsCounter = null;

  if (playerChoice.beats === computerChoice.key) {
    winnerHandArea = playerHandArea;
    winnerWinsCounter = playerWinsCounter;
    context.playerWins++;
    announcement.innerHTML = "Nyertél! 😎";
  } else if (computerChoice.beats === playerChoice.key) {
    winnerHandArea = computerHandArea;
    winnerWinsCounter = computerWinsCounter;
    context.computerWins++;
    announcement.innerHTML = "Vesztettél! 😞";
  } else {
    announcement.innerHTML = "Döntetlen! 😐";
  }

  if (winnerHandArea && winnerWinsCounter) {
    winnerHandArea.classList.add("winner-hand");
    updateUi();
  }
}

// Hook up button
newGameButton.addEventListener("click", resetGame);
choiceRock.addEventListener("click", () => {
  playRound(choiceMap[ChoiceKey.ROCK]);
});
choicePaper.addEventListener("click", () => {
  playRound(choiceMap[ChoiceKey.PAPER]);
});
choiceScissors.addEventListener("click", () => {
  playRound(choiceMap[ChoiceKey.SCISSORS]);
});

window.onload = resetGame;
