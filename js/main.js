
class BoardSquare {
    constructor(element, color) {
        this.element = element;
        this.element.addEventListener("click", this, false);
        this.isFaceUp = false;
        this.isMatched = false;
        this.setColor(color);
    }
    
    handleEvent(event) {
        // 2
        switch (event.type) {
          case "click":
            // 3
            if ( this.isFaceUp || this.isMatched ) {
                return;
            }
            flush.play();
            this.faceUp = true;
            this.element.classList.add('flipped');
            squareFlipped( this );
        }
    }

    setColor(color) {
        const faceUpElement = this.element.getElementsByClassName('faceup')[0];
        // remove the previous color if it exists
        faceUpElement.classList.remove(this.color);
        this.color = color;
        faceUpElement.classList.add(color);
    }

    reset() {
        this.isFaceUp = false;
        this.isMatched = false;
        this.element.classList.remove('flipped');
    }
    
    matchFound() {
        this.isFaceUp = true;
        this.isMatched = true;
    }
}

const flush = new Audio('POP1.wav');
let firstFaceupSquare = null;
function squareFlipped(square) {
    // 2
    if (firstFaceupSquare === null) {
        firstFaceupSquare = square;
        return
    }
    // 3
    if (firstFaceupSquare.color === square.color) {
        // 4
        firstFaceupSquare.matchFound();
        square.matchFound();
    
        firstFaceupSquare = null;
    } else {
        // 5
        const a = firstFaceupSquare;
        const b = square;
    
        firstFaceupSquare = null;
        
        setTimeout(function() {
        a.reset();
        b.reset();
        }, 400);
    }
}

const colorPairs = [];
function generateColorPairs() {
    if (colorPairs.length > 0) {
      return colorPairs;
    } else {
      // generates matching pair for each color
      for (let i = 0; i < 8; i++) {
        colorPairs.push('color-' + i);
        colorPairs.push('color-' + i);
      }
      return colorPairs;
    }
  }

  function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

function shuffleColors() {
    const colorPairs = generateColorPairs()
    return shuffle(colorPairs);
}

const numberOfTiles = 16;
let tilesHtml = '';

function generateGameBoard() {

    for ( let i = 0; i < numberOfTiles; i ++ ) {
        tilesHtml +=
            '<div class="col-3 board-square">\n' +
            '<div class="face-container">\n' +
            '<div class="facedown"></div>\n' +
            '<div class="faceup"></div>\n' +
            '</div>\n' +
            '</div>\n';
    }

    const boardElement = document.getElementById('gameboard');
    boardElement.innerHTML = tilesHtml;
}

const boardSquares = [];
function setupGame() {
    generateGameBoard();
    const randomColorPairs = shuffleColors();
    const squareElements = document.getElementsByClassName("board-square");

    for (let i = 0; i < squareElements.length; i++) {
        const element = squareElements[i];
        const color = randomColorPairs[i];
        // 3
        const square = new BoardSquare(element, color)
        // 4
        boardSquares.push(square);
    }
}

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener('click', () => {
    // 3
    resetGame();
});

function resetGame() {
    // 1
    firstFaceupSquare = null;
  
    // 2
    boardSquares.forEach((square) => {
      square.reset()
    });
  
    // 3
    setTimeout(() => {
      // 4
      const randomColorPairs = shuffleColors();
  
      // 5
      for (let i = 0; i < boardSquares.length; i++) {
        const newColor = randomColorPairs[i];
        const square = boardSquares[i];
  
        square.setColor(newColor);
      }
    }, 500);
}

setupGame();
