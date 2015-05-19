document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'complete') {
        // Place all your clicking logic here.

        // function startGame() {
        //     //initiates a new game
        // }

        // function createTable() {
        //     var tbl = document.createElement('table');
        //     for (i = 0; i < 3; i++) {
        //         var row = document.createElement('tr');
        //         for (j = 0; j < 3; j++) {
        //             var cell = document.createElement('td');

        //         }
        //     }
        // }

        play = function () {
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
                    //cell.onclick = set;
                    $(cell).append(document.createTextNode(""));
                    $(row).append(cell);
                    //squares.push(cell);
                    indicator += indicator;
                }
            }

            // Attach under tictactoe if present, otherwise to body.
            parent = document.getElementById("board") || document.body;
            parent.appendChild(board);
            //startNewGame();
        };

        play();

    }
};

// This will help you with finding how much to scroll the window.
// elem is DOM element
function findPos(elem) {
    var top = 0;
    if (elem.offsetParent) {
        do {
            top += elem.offsetTop;
        } while (elem = elem.offsetParent);
        return [top];
    }
}