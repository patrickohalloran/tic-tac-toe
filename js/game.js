//This remake was inspired the script here: http://jsfiddle.net/rtoal/5wKfF/
document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'complete') {
        // Place all your clicking logic here.

        var squares = []; //will contain each td item (cell) with a textNode for the value
        var winningValues = [14, 112, 896, 146, 292, 584, 546, 168];
        var scoreGreen = 0;
        var scoreYellow = 0;
        var greenX = "X";
        var yellowO = "O";
        var currTurn = "green";
        var EMPTY = "\xA0";
        var maxMoves = 9;
        var numMoves = 0;

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

        function set() {
            //sets a square on the board
            var currVal = this.firstChild.nodeValue;
            console.log(currVal);
            if (currVal !== EMPTY) {
                return;
            } else if (currTurn === "green") {
                this.firstChild.nodeValue = "X";
                scoreGreen += squareValue(this.indicator);
                currTurn = "yellow";
            } else {
                this.firstChild.nodeValue = "O";
                scoreYellow += squareValue(this.indicator);
                currTurn = "green";
            }

            numMoves ++;
            if (gameOver()) {
                endGame();
            }
        }

        function gameOver() {
            if ($.inArray(scoreYellow, winningValues) !== -1) {
                alert("Yellow wins!");
                return true;
            } else if ($.inArray(scoreGreen, winningValues) !== -1) {
                alert("Green wins!");
                return true;
            } else if (numMoves === maxMoves) {
                alert("We have a draw!");
                return true;
            }
            return false;
        }

        function endGame() {
            startNewGame();
        }

        function squareValue(x) {
            if (x === 1) {
                return 2;
            }
            return 2 * squareValue(x - 1);
        }

        function play() {
            var board = document.createElement("table"),
                indicator = 1,
                i, j,
                row, cell,
                parent;
            board.border = 1;
            for (i = 0; i < 3; i += 1) {
                row = document.createElement("tr");
                board.appendChild(row);
                for (j = 0; j < 3; j += 1) {
                    cell = document.createElement("td");
                    $(cell).css({"width": 50,
                                "height": 50,
                                "align": 'center',
                                "valign": 'center'});
                    cell.indicator = indicator;
                    cell.onclick = set;
                    $(cell).append(document.createTextNode(""));
                    $(row).append(cell);
                    squares.push(cell);
                    indicator += 1;
                }
            }

            // Attach under tictactoe if present, otherwise to body.
            parent = document.getElementById("board");
            $(parent).append(board);
            startNewGame();
        };

        play();

    }
};
