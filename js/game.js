//This remake was inspired the script here: http://jsfiddle.net/rtoal/5wKfF/
document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'complete') {

        var squares = [] //will contain each td item (cell) with a textNode for the value
            ,winningValues = [14, 112, 896, 146, 292, 584, 546, 168]
            ,scoreGreen = 0
            ,scoreYellow = 0
            ,GREEN = "X"
            ,YELLOW = "O"
            ,currTurn = GREEN //human player will always start green
            ,EMPTY = "\xA0"
            ,maxMoves = 9
            ,numMoves = 0
            ,activeAI = false
            ,endGameMessage = "We have a draw!";


        /* The AI is below. */

        /* A boardMove constructor that takes in the index of a square
         * and the value at that corresponding square on the board.
         * By value I mean, how good is that spot for the AI.
         */
        function boardMove(square, val) {
            this.squareIndex = square;
            this.score = val;
        }

        /* A legal move for WHO that has an estimated value >= CUTOFF
         * or that has the best estimated value for player WHO, starting
         * from position START, and looking up to DEPTH moves AHEAD.
         * Returns a two element array like this: [squareIndex, value].
         */
        function findBestMove (side, depth, cutoff, moves) {
            var greenWins, yellowWins;
            greenWins = hasWon(GREEN);
            yellowWins = hasWon(YELLOW);

            if ((side === GREEN) && greenWins) {
                return new boardMove(0, Number.MAX_SAFE_INTEGER);
            } else if ((side === GREEN) && yellowWins) {
                return new boardMove(0, -Number.MAX_SAFE_INTEGER); //maybe do + 1 here??
            } else if ((side === YELLOW) && yellowWins) {
                return new boardMove(0, Number.MAX_SAFE_INTEGER);
            } else if ((side === YELLOW) && greenWins) {
                return new boardMove(0, -Number.MAX_SAFE_INTEGER); //maybe do + 1 here too??
            } else if (numMoves === maxMoves) {
                return new boardMove(0, 0); //this is the tie case
            } else if (depth === 0) {
                var position = staticEval(side, cutoff);
                smartSet(side, position);
                var val = heuristic(side);
                undo(side, position);
                return new boardMove(position, val);
            }

            var bestSoFar = new boardMove(getFirstPossibleMove(side)
                    , -Number.MAX_SAFE_INTEGER); //needs to be -Number.MAX_SAFE_INTEGER +1??
            for (var i = 0; i < squares.length; i++) {
                var currSquare = squares[i];
                var currVal = currSquare.firstChild.nodeValue;
                if (currVal === EMPTY) {
                    var M = new boardMove(i, -Number.MAX_SAFE_INTEGER); //need + 1 here??
                    smartSet(side, i);
                    var reply = findBestMove(opposite(side), depth - 1,
                        -bestSoFar.score, []);
                    var responseValue = reply.score;
                    var response = new boardMove(reply.squareIndex, responseValue);
                    undo(side, i);
                    moves.push(M);
                    if (-response.score > bestSoFar.score) {
                        M.score = -response.score;
                        bestSoFar = M;
                        if (M.score >= cutoff) {
                            break;
                        }
                    }
                }
            }

            var moveToChoose = 0;
            var maxValSeen = -Number.MAX_SAFE_INTEGER; //need + 1 here??
            var currVal;
            for (var i = 0; i < moves.length; i++) {
                currVal = moves[i].score;
                if (currVal > maxValSeen) {
                    maxValSeen = currVal;
                    moveToChoose = i;
                }
            }
            return moves[moveToChoose];
        }


        /* Returns the location of the best square we can go to. */
        function staticEval(side, cutoff) {
            var bestSoFar = new boardMove(getFirstPossibleMove(side), -Number.MAX_SAFE_INTEGER); //need +1??
            var bestSoFarOpp = new boardMove(getFirstPossibleMove(side), Number.MAX_SAFE_INTEGER);

            var currSquare, currVal, tempBoardVal;
            for (var i = 0; i < squares.length; i++) {
                currSquare = squares[i];
                currVal = currSquare.firstChild.nodeValue;
                if (currVal === EMPTY) {
                    smartSet(side, i);
                    tempBoardVal = heuristic(side);
                    undo(side, i);
                    if (side === YELLOW) {
                        if (tempBoardVal > bestSoFar.score) {
                            bestSoFar.squareIndex = i;
                            bestSoFar.score = tempBoardVal;
                            if (tempBoardVal >= cutoff) {
                                break;
                            }
                        }
                    } else if (side === GREEN) {
                        if (-tempBoardVal < bestSoFarOpp.score) { //changed from -tempBoardVal > bestSoFar.score
                            bestSoFarOpp.squareIndex = i;
                            bestSoFarOpp.score = -tempBoardVal;
                            if (-tempBoardVal >= cutoff) {
                                break;
                            }
                        }
                    }
                }
            }

            if (side === YELLOW) {
                return bestSoFar.squareIndex;
            }
            return bestSoFarOpp.squareIndex;
        }

        /* Returns the "value" of the current board at a given state
         * for side SIDE.
         */
        function heuristic(side) {
            var howGood = 0;
            if ((side === GREEN) && hasWon(side)) {
                return -Number.MAX_SAFE_INTEGER; //need + 1??
            } else if ((side === YELLOW) && hasWon(side)) {
                return Number.MAX_SAFE_INTEGER;
            } else {
                var doubles = corners = middle = sides = tie = blocks = 0;
                var sq0, sq1, sq2, sq3, sq4, sq5, sq6, sq7, sq8;
                sq0 = squares[0];
                sq1 = squares[1];
                sq2 = squares[2];
                sq3 = squares[3];
                sq4 = squares[4];
                sq5 = squares[5];
                sq6 = squares[6];
                sq7 = squares[7];
                sq8 = squares[8];

                val0 = sq0.firstChild.nodeValue;
                val1 = sq1.firstChild.nodeValue;
                val2 = sq2.firstChild.nodeValue;
                val3 = sq3.firstChild.nodeValue;
                val4 = sq4.firstChild.nodeValue;
                val5 = sq5.firstChild.nodeValue;
                val6 = sq6.firstChild.nodeValue;
                val7 = sq7.firstChild.nodeValue;
                val8 = sq8.firstChild.nodeValue;

                if (val4 === side) { //if we own the middle
                    middle += 100000;
                }
                if (val0 === side) { //check ya corners
                    corners += 50;
                }
                if (val2 === side) { //check ya corners
                    corners += 50;
                }
                if (val6 === side) { //check ya corners
                    corners += 50;
                }
                if (val8 === side) { //check ya corners
                    corners += 50;
                }
                if (val1 === side) { //check sides
                    sides += 25;
                }
                if (val3 === side) { //check sides
                    sides += 25;
                }
                if (val5 === side) { //check sides
                    sides += 25;
                }
                if (val7 === side) { //check sides
                    sides += 25;
                }

                doubles += countDouble(side, [val0, val1, val2]);
                doubles += countDouble(side, [val3, val4, val5]);
                doubles += countDouble(side, [val6, val7, val8]);
                doubles += countDouble(side, [val0, val3, val6]);
                doubles += countDouble(side, [val1, val4, val7]);
                doubles += countDouble(side, [val2, val5, val8]);
                doubles += countDouble(side, [val0, val4, val8]);
                doubles += countDouble(side, [val2, val4, val6]);

                blocks += countBlocks(side, [val0, val1, val2]);
                blocks += countBlocks(side, [val3, val4, val5]);
                blocks += countBlocks(side, [val6, val7, val8]);
                blocks += countBlocks(side, [val0, val3, val6]);
                blocks += countBlocks(side, [val1, val4, val7]);
                blocks += countBlocks(side, [val2, val5, val8]);
                blocks += countBlocks(side, [val0, val4, val8]);
                blocks += countBlocks(side, [val2, val4, val6]);

                tie += countTie([val0, val1, val2, val3, val4, val5, val6, val7, val8]);

                return doubles + corners + sides + middle + tie + blocks;

            }

        }

        /* Counts the number of consecutive three squares where a side has
         * two spots occupied and the third remaining spot is EMPTY.
         * Returns the value of a double if it is there. 500 for us,
         * -1000 for them.
         */
        function countDouble(side, cells) {
            var us = them = blanks = 0;
            var currVal;
            for (var i = 0; i < cells.length; i++) {
                currVal = cells[i];
                if (currVal === side) {
                    us ++;
                } else if (currVal === opposite(side)) {
                    them ++;
                } else {
                    blanks ++;
                }
            }

            if ((us === 2) && (blanks === 1)) {
                return 500;
            } else if ((them == 2) && (blanks === 1)) {
                return -1000;
            }
            return 0;
        }

        /* Counts the number of blocks that we have. Returns 300
         * if we have one on the opponent. Otherwise return 0. Takes
         * in an array of nodeValues from the squares.
         */
        function countBlocks(side, cells) {
            var us = them = 0;
            var currVal;
            for (var i = 0; i < cells.length; i++) {
                currVal = cells[i];
                if (currVal === side) {
                    us ++;
                } else if (currVal === opposite(side)) {
                    them ++;
                }
            }
            if ((us === 1) && (them === 2)) {
                return 300;
            }
            return 0;
        }


        /* If we have a tie, return 300, otherwise return 0. */
        function countTie(cells) {
            for (var i = 0; i < cells.length; i++) {
                if (cells[i] !== EMPTY) {
                    return 0;
                }
            }
            return 300;
        }

        /* Smart AI set function. Takes in a square index (0-8) and
         * sets the value of the firstChild.nodeValue to YELLOW.
         */
        function smartSet(side, squareIndex) {
            var currSquare, currIndicator;
            currSquare = squares[squareIndex];
            currIndicator = currSquare.indicator;
            currSquare.firstChild.nodeValue = side;

            if (side === GREEN) {
                scoreGreen += squareValue(currIndicator);
            } else {
                scoreYellow += squareValue(currIndicator);
            }
            numMoves ++;
        }

        /* Performs an "undo" on the last move and adjusts the scores
         * for both sides accordingly. Also subtracts 1 from numMoves.
         */
        function undo(side, squareIndex) {
            var currSquare, currIndicator;
            currSquare = squares[squareIndex];
            currIndicator = currSquare.indicator;
            currSquare.firstChild.nodeValue = EMPTY;

            if (side === GREEN) {
                scoreGreen -= squareValue(currIndicator);
            } else {
                scoreYellow -= squareValue(currIndicator);
            }
            numMoves --;
        }

        /* Returns us a move incase we have no others. Uses side SIDE
         * and the current board that we are currently using.
         */
        function getFirstPossibleMove(side) {
            var whichSquare, currSquare, currVal;
            whichSquare = 0;
            for (var i = 0; i < squares.length; i++) {
                currSquare = squares[i];
                currVal = currSquare.firstChild.nodeValue;
                if (currVal === EMPTY) {
                    whichSquare = i;
                    break;
                }
            }
            return whichSquare;
        }











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
            currTurn = GREEN;
        }

        /* Switches turns. If it is 'green' make it 'yellow'
         * and visa-versa. */
        function switchSides(currSide) {
            if (currSide === GREEN) {
                currTurn = YELLOW;
            } else {
                currTurn = GREEN;
            }
         }

        /* Takes in a current side and returns the opposite side. */
        function opposite(player) {
            if (player === GREEN) {
                return YELLOW;
            }
            return GREEN;
        }

        /* Randomly select a square to take a turn on. */
        function AIturn() {
            var currVal, bestIndex, bestMove;
            // randIndex = getRandomInt(0, 8);
            // currVal = squares[randIndex].firstChild.nodeValue;
            // console.log(currVal);
            // while (currVal !== EMPTY) {
            //     randIndex = getRandomInt(0, 8);
            //     currVal = squares[randIndex].firstChild.nodeValue;
            // }
            // console.log("we made it!");
            bestMove = findBestMove(YELLOW, 1, Number.MAX_SAFE_INTEGER, []);
            bestIndex = bestMove.squareIndex;
            AIset(bestIndex);
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
                alert(endGameMessage);
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
            } else if (currTurn === GREEN) {
                this.firstChild.nodeValue = GREEN;
                scoreGreen += squareValue(this.indicator);
            } else {
                this.firstChild.nodeValue = YELLOW;
                scoreYellow += squareValue(this.indicator);
            }

            endTurn();
            if (activeAI && (currTurn === YELLOW)) {
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
            var currVal, greenStatus, yellowStatus;
            greenStatus = hasWon(GREEN);
            yellowStatus = hasWon(YELLOW);

            if ((currTurn === GREEN) && (numMoves !== maxMoves)) {
                if (greenStatus) {
                    endGameMessage = "Green wins!";
                    return true;
                }
            } else if ((currTurn === YELLOW) && (numMoves !== maxMoves)) {
                if (yellowStatus) {
                    endGameMessage = "Yellow wins!";
                    return true;
                }
            }

            if (numMoves === maxMoves) {
                endGameMessage = "We have a draw!";

                if (greenStatus) {
                    endGameMessage = "Green wins!";
                } else if (yellowStatus) {
                    endGameMessage = "Yellow wins!";
                }

                return true;
            }

            return false;
        }

        /* Returns true if player is in a winning state. */
        function hasWon(player) {
            var i, score;

            if (player === GREEN) {
                score = scoreGreen;
            } else {
                score = scoreYellow;
            }

            for (i = 0; i < winningValues.length; i++) {
                currVal = winningValues[i];
                if ((currVal & score) === currVal) {
                    return true;
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