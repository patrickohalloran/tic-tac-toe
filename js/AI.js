document.onreadystatechange = function () {
	var state = document.readyState;
	if (state == 'complete') {

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
				return new boardMove(0, Number.MAX_VALUE);
			} else if ((side === GREEN) && yellowWins) {
				return new boardMove(0, Number.MIN_VALUE + 1); //maybe do + 1 here??
			} else if ((side === YELLOW) && yellowWins) {
				return new boardMove(0, Number.MAX_VALUE);
			} else if ((side === YELLOW) && greenWins) {
				return new boardMove(0, Number.MIN_VALUE + 1); //maybe do + 1 here too??
			} else if (numMoves === maxMoves) {
				return new boardMove(0, 0); //this is the tie case
			} else if (d === 0) {
				var position = staticEval(side, cutoff);
				smartSet(position);
				var val = heuristic(side);
				undo(position);
				return new boardMove(position, val);
			}

			var bestSoFar = new boardMove(getFirstPossibleMove(side)
					, Number.MIN_VALUE + 1); //needs to be Number.MIN_VALUE + 1 +1??
			for (var i = 0; i < squares.length; i++) {
				var currSquare = squares[i];
				var currVal = currSquare.firstChild.nodeValue;
				if (currVal === EMPTY) {
					var M = new boardMove(i, Number.MIN_VALUE + 1); //need + 1 here??
					smartSet(i);
					var reply = findBestMove(opposite(side), depth - 1,
						-bestSoFar.score, []);
					var responseValue = heuristic(opposite(side));
					var response = new boardMove(reply.squareIndex, responseValue);
					undo(i);
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
			var maxValSeen = Number.MIN_VALUE + 1; //need + 1 here??
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
			var bestSoFar = new boardMove(getFirstPossibleMove(side), Number.MIN_VALUE + 1); //need +1??
			var currSquare, currVal, tempBoardVal;
			for (var i = 0; i < squares.length; i++) {
				currSquare = squares[i];
				currVal = currSquare.firstChild.nodeValue;
				if (currVal === EMPTY) {
					smartSet(i);
					tempBoardVal = heuristic(side);
					undo(i);
					if (side === YELLOW) {
						if (tempBoardVal > bestSoFar.score) {
							bestSoFar.squareIndex = i;
							bestSoFar.score = tempBoardVal;
							if (tempBoardVal >= cutoff) {
								break;
							}
						}
					}
				} else if (side === GREEN) {
					if (-tempBoardVal > bestSoFar.score) {
						bestSoFar.squareIndex = i;
						bestSoFar.score = -tempBoardVal;
						if (-tempBoardVal >= cutoff) {
							break;
						}
					}
				}
			}
			return bestSoFar.squareIndex;
		}

		/* Returns the "value" of the current board at a given state
		 * for side SIDE.
		 */
		function heuristic(side) {
			var howGood = 0;
			if ((side === GREEN) && hasWon(side)) {
				return Number.MIN_VALUE + 1 //need + 1??
			} else if ((side === YELLOW) && hasWon(side)) {
				return Number.MAX_VALUE;
			} else {
				return 0;
			}

		}

		/* Smart AI set function. Takes in a square index (0-8) and
		 * sets the value of the firstChild.nodeValue to YELLOW.
		 */
		function smartSet(squareIndex) {
			var currSquare, currIndicator;
			currSquare = squares[squareIndex];
			currIndicator = currSquare.indicator;
			currSquare.firstChild.nodeValue = YELLOW;
			scoreYellow += squareValue(currIndicator);
			numMoves ++;
		}

		/* Performs an "undo" on the last move and adjusts the scores
		 * for both sides accordingly. Also subtracts 1 from numMoves.
		 */
		function undo(squareIndex) {
			var currSquare, currIndicator;
			currSquare = squares[squareIndex];
			currIndicator = currSquare.indicator;
			currSquare.firstChild.nodeValue = EMPTY;
			scoreYellow -= squareValue(currIndicator);
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
	}
};