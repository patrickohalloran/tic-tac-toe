//This remake was inspired the script here: http://jsfiddle.net/rtoal/5wKfF/
document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'complete') {
        // Place all your clicking logic here.

        var squares = [] //will contain each td item (cell) with a textNode for the value
            ,winningValues = [14, 112, 896, 146, 292, 584, 546, 168]
            ,scoreGreen = 0
            ,scoreYellow = 0
            ,GREEN = "X"
            ,YELLOW = "O"
            ,currTurn = "green" //human player will always start green
            ,EMPTY = "\xA0"
            ,maxMoves = 9
            ,numMoves = 0
            ,activeAI = false;

        /* Empties the game board by setting each of the firstChild.nodeValues
         * to EMPTY and resets all of the score and turn variables.
         */
        function startNewGame() {
            var i;
            for (i = 0; i < squares.length; i++) {
                squares[i].firstChild.nodeValue = EMPTY;
            }

            scoreYellow = 0;
            scoreGreen = 0;
            numMoves = 0;
            currTurn = "green";
        }

        /* Switches turns. If it is 'green' make it 'yellow'
         * and visa-versa. */
        function switchSides(currSide) {
            if (currSide === "green") {
                currTurn = "yellow";
            } else {
                currTurn = "green";
            }
         }

        /* Randomly select a square to take a turn on. */
        function AIturn() {
            var currVal, randIndex;
            randIndex = getRandomInt(0, 8);
            currVal = squares[randIndex].firstChild.nodeValue;
            console.log(currVal);
            while (currVal !== EMPTY) {
                randIndex = getRandomInt(0, 8);
                currVal = squares[randIndex].firstChild.nodeValue;
            }
            console.log("we made it!");
            AIset(randIndex);
        }

        /* Takes in a square index to modify to AI value. */
        function AIset(squareIndex) {
            var currSquare, currIndicator;
            currSquare = squares[squareIndex];
            currIndicator = currSquare.indicator;
            currSquare.firstChild.nodeValue = YELLOW;
            scoreYellow += squareValue(currIndicator);
            endTurn();
        }

        /* Returns a random index to pick from "squares" array
         * Takes in a minimum integer and a maximum integer range
         * both inclusive and returns an integer.
         *
         * Taken from an example on StackOverflow.
         */
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        /* Ends a turn by incrementing numMoves and switching sides. */
        function endTurn() {
            numMoves ++;
            if (gameOver()) {
                endGame();
                return;
            } else {
                switchSides(currTurn);
            }
        }


        /* Sets the current td's firstChild.nodevalue (a square on the board)
         * to either an 'X' or an 'O' and then updates turn variables.
         */
        function set() {
            var currVal = this.firstChild.nodeValue;
            console.log(currVal);
            if (currVal !== EMPTY) {
                return;
            } else if (currTurn === "green") {
                this.firstChild.nodeValue = GREEN;
                scoreGreen += squareValue(this.indicator);
            } else {
                this.firstChild.nodeValue = YELLOW;
                scoreYellow += squareValue(this.indicator);
            }

            endTurn();
            if (activeAI && (currTurn === "yellow")) {
                console.log("yoooo")
                AIturn();
            }
            //put in logic to call the AI function if AI variable is on

        }

        /* A boolean function that returns true if moves === 9
         * (aka the board is full and it's a tie), or if either player
         * has one of the winning lines represented in the
         * array "winningValues". Else returns false.
         */
        function gameOver() {
            var currVal;

            if (numMoves === maxMoves) {
                alert("We have a draw!");
                return true;
            }
            if (currTurn === "green") {
                var i;
                for (i = 0; i < winningValues.length; i++) {
                    currVal = winningValues[i];
                    if ((currVal & scoreGreen) === currVal) {
                        alert("Green wins!");
                        return true;
                    }
                }
            } else if (currTurn === "yellow") {
                var j;
                for (var j = 0; j < winningValues.length; j++) {
                    currVal = winningValues[j];
                    if ((currVal & scoreYellow) === currVal) {
                        alert("Yellow wins!");
                        return true;
                    }
                }
            }
            return false;
        }


        /* Resets the game board by calling startNewGame() */
        function endGame() {
            startNewGame();
        }

        /* Calculates the corresponding score for each square
         * represented by powers of 2 from exponents 1-9
         * Takes in an integer X and returns 2^X.
         */
        function squareValue(x) {
            if (x === 1) {
                return 2;
            }
            return 2 * squareValue(x - 1);
        }

        /* Sets the game to single-player */
        function singleModeSet() {
            activeAI = true;
        }

        /* Sets the game to two-player */
        function twoModeSet() {
            activeAI = false;
        }

        /* Begins a game by setting up the game board on the screen
         * and populating the "squares" array. Also creates the two buttons
         * anc calls the startNewGame() function.
         */
        function play() {
            var board = document.createElement("table"),
                indicator = 1,
                i, j,
                row, cell,
                parent,
                singlePlayerButton, twoPlayerButton,
                singleButtonText, twoButtonText;
            board.border = 1;
            for (i = 0; i < 3; i += 1) {
                row = document.createElement("tr");
                board.appendChild(row);
                for (j = 0; j < 3; j += 1) {
                    cell = document.createElement("td");
                    $(cell).css({"width": 50,
                                "height": 50,
                                "text-align": 'center'
                                });
                    cell.indicator = indicator;
                    cell.onclick = set;
                    $(cell).append(document.createTextNode(""));
                    $(row).append(cell);
                    squares.push(cell);
                    indicator += 1;
                }
            }

            parent = document.getElementById("board");
            $(parent).append(board);
            singlePlayerButton = document.createElement("BUTTON");
            singleButtonText = document.createTextNode("Single Player");
            $(singlePlayerButton).append(singleButtonText);
            $(singlePlayerButton).click(function() {
                singleModeSet();
            });
            twoPlayerButton = document.createElement("BUTTON");
            twoButtonText = document.createTextNode("Two Player")
            $(twoPlayerButton).append(twoButtonText);
            $(twoPlayerButton).click(function() {
                twoModeSet();
            });
            $(parent).append(singlePlayerButton);
            $(parent).append(twoPlayerButton);
            startNewGame();
        };

        play();

    }
};