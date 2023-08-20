//1. Deposit money
//2. Number of lines to bet
//3. Collect bet amount
//4. Spin the slot machine
//5  Check if the user won
//6. Give user their winnings
//7. Play again?

const prompt = require("prompt-sync")();
//global variables
const ROWS = 3;
const COLS = 3;
const balance = 0;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
}

const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
}

//1. Deposit money
const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount or 'q' to quit: ");

    if (depositAmount.toLowerCase() === 'q') {
      console.log("Exiting deposit process.");
      break;
    }

    const numberDepositAmount = parseFloat(depositAmount);
    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, try again!!");
    } else {
      return numberDepositAmount;
    }
  }
};

//2. Number of lines to bet
const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter number of lines to bet (1-3) or 'q' to quit: ");

    if (lines.toLowerCase() === 'q') {
      console.log("Exiting number of lines process.");
      break;
    }

    const numberOfLines = parseInt(lines);
    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > ROWS) {
      console.log("Invalid number of lines amount, try again!!");
    } else {
      return numberOfLines;
    }
  }
};

//3. Collect bet amount
const getBet = (balance, lines) => {
  while (true) {
    let maxBet = Math.round(balance / lines);
    console.log("Max Bet: ", maxBet);
    const bet = prompt("Enter bet per line or 'q' to quit: ");

    if (bet.toLowerCase() === 'q') {
      console.log("Exiting number of lines process.");
      break;
    }

    const numberBet = parseFloat(bet);
    if (isNaN(numberBet) || numberBet <= 0 || numberBet > maxBet) {
      console.log("Bet should be lower than", maxBet, "try again!!");
    } else {
      return numberBet;
    }
  }
};

//4. Spin the slot machine
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      /* remove symbol from original array */
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

//part of spin
const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

//part of spin: showing the ultimate result of the spin
const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

//5  Check if the user won
const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  const possibiliites = [];
  for (let row = 0; row < ROWS; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      possibiliites.push(bet * SYMBOLS_VALUES[symbols[0]]);
    }
  }
  possibiliites.sort();
  possibiliites.reverse();
  for (let i = 0; i < possibiliites.length; i++) {
    if (i < lines) winnings += possibiliites[i];
  }
  return winnings;
};


const game = () => {
  let balance = deposit();

  while (balance > 0) {
    console.log("You have a balance of: $" + balance);

    const numberOfLines = getNumberOfLines();
    if (isNaN(numberOfLines)) break;

    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;

    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);

    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;

    console.log("You won, $" + winnings.toString());

    if (balance <= 0) {
      console.log("You've run out of money.");
      break;
    }

    const playAgain = prompt("Do you want to play again (y/n)? ");
    if (playAgain.toLowerCase() !== "y") break;
  }

  console.log("Game over!");
};

game();





