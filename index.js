const Util = {
  sleep: async (milliseconds) =>
    await new Promise((resolve) => setTimeout(resolve, milliseconds)),
  getImagePath: (filename) => `/public/images/${filename}`,
  getRandom: (array) => array[Math.floor(Math.random() * array.length)],
};

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

class Hand {
  constructor(prefix) {
    this.prefix = prefix;
    this.choice = null;
  }

  get imageElement() {
    return document.getElementById(`${this.prefix}HandImg`);
  }

  get areaElement() {
    return document.getElementById(`${this.prefix}HandBox`);
  }

  revealChoice() {
    const imageName = `${this.prefix}-${this.choice.image}`;
    this.imageElement.src = Util.getImagePath(imageName);
  }

  markAsWinner() {
    this.areaElement.classList.add("winner-hand");
  }

  removeWinnerMarker() {
    this.areaElement.classList.remove("winner-hand");
  }

  startShaking() {
    this.imageElement.classList.add(`${this.prefix}-shake`);
  }

  stopShaking() {
    this.imageElement.classList.remove(`${this.prefix}-shake`);
  }

  async bounce() {
    this.imageElement.style.transform = "scale(1.2)";

    await Util.sleep(300);

    this.imageElement.style.transform = "";
  }

  reset() {
    this.choice = null;
    this.imageElement.src = Util.getImagePath(`${this.prefix}-hand-rock.png`);
    this.removeWinnerMarker();
  }
}

class HandsManager {
  constructor() {
    this.userHand = new Hand("user");
    this.computerHand = new Hand("computer");
  }

  async shake() {
    this.userHand.startShaking();
    this.computerHand.startShaking();

    await Util.sleep(600);

    this.userHand.stopShaking();
    this.computerHand.stopShaking();
  }

  setChoices(userChoice, computerChoice) {
    this.userHand.choice = userChoice;
    this.computerHand.choice = computerChoice;
  }

  revealChoices() {
    this.userHand.revealChoice();
    this.userHand.bounce();
    this.computerHand.revealChoice();
    this.computerHand.bounce();
  }

  reset() {
    this.userHand.reset();
    this.computerHand.reset();
  }
}

class Choice {
  constructor(name, displayName, onClick) {
    this.name = name;
    this.key = name.toUpperCase();
    this.displayName = displayName;
    this.tooltipElement = document.getElementById("instruction");
    this.containerElement = document.getElementById(name);
    this.containerElement.addEventListener("click", onClick);
    this.containerElement.addEventListener("mouseenter", () =>
      this.showTooltip()
    );
    this.containerElement.addEventListener("mouseleave", () =>
      this.hideTooltip()
    );
  }

  showTooltip() {
    this.tooltipElement.textContent = this.displayName;
  }

  hideTooltip() {
    this.tooltipElement.textContent = "Válassz kezet!";
  }
}

class ChoicesManager {
  constructor(onChoice) {
    this.containerElement = document.getElementById("choicesBox");
    this.instructionsElement = document.getElementById("instruction");

    const choiceRock = new Choice("choiceRock", "Kő", () =>
      onChoice(choiceMap[ChoiceKey.ROCK])
    );
    const choicePaper = new Choice("choicePaper", "Papír", () =>
      onChoice(choiceMap[ChoiceKey.PAPER])
    );
    const choiceScissors = new Choice("choiceScissors", "Olló", () =>
      onChoice(choiceMap[ChoiceKey.SCISSORS])
    );

    this.choices = [choiceRock, choicePaper, choiceScissors];
  }

  show() {
    this.containerElement.style.display = "flex";
    this.instructionsElement.style.display = "flex";
  }

  hide() {
    this.containerElement.style.display = "none";
    this.instructionsElement.style.display = "none";
  }
}

class EmojiCollection {
  constructor(emojis) {
    this.emojis = emojis;
    this.index = -1;
  }

  getNext() {
    const nextEmoji = this.emojis?.[++this.index];
    const lastEmoji = this.emojis[this.emojis.length - 1];

    return nextEmoji ?? lastEmoji;
  }

  reset() {
    this.index = -1;
  }
}

class EmojiManager {
  constructor() {
    this.winningEmojis = new EmojiCollection(["😊", "😁👍", "😎👌"]);
    this.losingEmojis = new EmojiCollection(["😳", "😨", "😞💔"]);
    this.tieEmojis = new EmojiCollection(["😐", "😒", "🥱", "😴", "😵‍💫"]);
  }

  reset() {
    this.winningEmojis.reset();
    this.losingEmojis.reset();
    this.tieEmojis.reset();
  }
}

class GameContext {
  constructor() {
    this.config = {
      maxWinCount: 3,
    };
    this.DEFAULT_STATS = {
      tieCount: 0,
      userWinCount: 0,
      computerWinCount: 0,
    };
    this.stats = {
      ...this.DEFAULT_STATS,
    };
  }

  get userWinsCounterElement() {
    return document.getElementById("userWinsCounter");
  }

  get computerWinsCounterElement() {
    return document.getElementById("computerWinsCounter");
  }

  incrementUserWins() {
    this.stats.userWinCount++;
    this.refreshCounters();
  }

  incrementComputerWins() {
    this.stats.computerWinCount++;
    this.refreshCounters();
  }

  hasUserWon() {
    return this.stats.userWinCount >= this.config.maxWinCount;
  }

  hasComputerWon() {
    return this.stats.computerWinCount >= this.config.maxWinCount;
  }

  incrementTies() {
    this.stats.tieCount++;
  }

  isGameFinished() {
    return this.hasUserWon() || this.hasComputerWon();
  }

  resetStats() {
    this.stats = { ...this.DEFAULT_STATS };
    this.refreshCounters();
  }

  refreshCounters() {
    this.userWinsCounterElement.textContent = `${this.stats.userWinCount}/${this.config.maxWinCount}`;
    this.computerWinsCounterElement.textContent = `${this.stats.computerWinCount}/${this.config.maxWinCount}`;
  }
}

class GameEngine {
  constructor() {
    this.context = new GameContext();
    this.hands = new HandsManager();
    this.choices = new ChoicesManager((choice) => this.playRound(choice));
    this.announcement = document.getElementById("announcement");
    this.actionsBox = document.getElementById("actionsBox");
    this.newGameButton = document.getElementById("newGameButton");
    this.newGameButton.addEventListener("click", () => this.resetGame());
    this.userChoice = null;
    this.computerChoice = null;
    this.emojis = new EmojiManager();
  }

  async playRound(userChoice) {
    this.choices.hide();
    this.hands.reset();

    this.userChoice = userChoice;
    this.computerChoice = Util.getRandom(CHOICES);
    this.hands.setChoices(this.userChoice, this.computerChoice);

    const texts = ["Kő...", "Papír...", "Ol...", "...ló!"];
    for (let i = 0; i < texts.length; i++) {
      this.announce(texts[i]);

      await this.hands.shake();
      await Util.sleep(150);
    }

    this.hands.revealChoices();
    this.displayRoundWinner();
  }

  displayRoundWinner() {
    const userWonRound = this.userChoice.beats === this.computerChoice.key;
    const computerWonRound = this.computerChoice.beats === this.userChoice.key;

    if (userWonRound) {
      this.context.incrementUserWins();
      this.hands.userHand.markAsWinner();
      const emoji = this.emojis.winningEmojis.getNext();
      this.announce(`Nyertél! ${emoji}`);
    } else if (computerWonRound) {
      this.context.incrementComputerWins();
      this.hands.computerHand.markAsWinner();
      const emoji = this.emojis.losingEmojis.getNext();
      this.announce(`Vesztettél! ${emoji}`);
    } else {
      this.context.incrementTies();
      const emoji = this.emojis.tieEmojis.getNext();
      this.announce(`Döntetlen! ${emoji}`);
    }

    this.checkEndGame();
  }

  checkEndGame() {
    if (this.context.isGameFinished()) {
      this.showActions();
    } else {
      this.choices.show();
    }
  }

  showActions() {
    this.actionsBox.style.opacity = 1;
    this.actionsBox.style.display = "flex";
  }

  hideActions() {
    this.actionsBox.style.opacity = 0;
    this.actionsBox.style.display = "none";
  }

  resetGame() {
    this.hideActions();
    this.context.resetStats();
    this.hands.reset();
    this.choices.show();
    this.emojis.reset();
    this.announce("Készen állsz?");
  }

  announce(text) {
    this.announcement.textContent = text;
  }
}

const engine = new GameEngine();

window.onload = () => engine.resetGame();
