
AnswerService = {
    post(gameId, tileId, answers) {
        var game = Games.findOne(gameId);
        var boardState = game.boardState;
        var board;
        const board1 = GameBoards.findOne(game.player1Board);
        const board2 = GameBoards.findOne(game.player2Board);
        const currentTurn = game.playerTurn;
        var currentScoreId;

        var currentUser = this.userId;

        if (currentUser === game.player1 || game.player1 === Bots[0]._id && currentTurn === 1) {
            console.log('getting player 1 board');
            board = board1;
            currentScoreId = "player1Scores";
        } else if (currentUser === game.player2 || game.player2 === Bots[1]._id && currentTurn === 2) {
            console.log('getting player 2 board');
            board = board2;
            currentScoreId = "player2Scores";
        } else {
            throw Meteor.Error(404, "Invalid gameId + " + gameId + "user does not play this game");
        }
        var tile = _.find(board.tiles, function(tile){return tile._id === tileId});
        if (tile){
            const index = _.indexOf(board.tiles, tile);
            const row = Math.floor(index / 3);
            const col = index % 3;
            const result = this.getResultsForTile(tile, answers);
            var scores = [];
            for (var i = 0; i < tile.questions.length; i++){
                scores.push({questionId: tile.questions[i]._id, score: result[i]})
            }
            const oldScore = boardState[row][col].player === currentTurn? boardState[row][col].score : 0;
            const newScore = _.reduce(_.map(scores, function(s){return s.score}), function(add, x) {
                return add + x;
            });
            console.log(boardState);

            const otherScore = boardState[row][col].player !== currentTurn? boardState[row][col].score : 0;
            if (newScore > oldScore){
                game[currentScoreId][tile._id] = scores;
                if (otherScore < newScore){
                    boardState[row][col].player = currentTurn;
                    boardState[row][col].score = newScore;
                    console.log(boardState);

                }
            }
            game.playerTurn = game.playerTurn === 1 ? 2 : 1;
            GameRepository.save(game);
            return {
                win: this.playerWins(boardState, currentTurn, row, col),
                draw: this.isDraw(boardState)
            }
        } else {
            throw Meteor.Error(404, "Invalid tileId + " + tileId);
        }

    },

    getResultsForTile(tile, answers) {
        const questionAnswers = _.zip(tile.questions, answers);
        if (tile.type === "MultipleChoice"){
            return _.map(questionAnswers, function(qa){return AnswerService.verifyAnswerMultipleChoice(qa[0], qa[1])});
        } else if (tile.type === "Timeline"){
            return _.map(questionAnswers, function(qa){return AnswerService.verifyAnswerTimeLine(qa[0], qa[1])});
        } else {
            console.log("got invalid question type" + tile.type)
        }
    },

    verifyAnswerMultipleChoice(question, answer) {
        return question.answer === answer ? 1 : 0;
    },

    verifyAnswerTimeLine(question, answer) {
        const milliSecondsPerDay = 24 * 60 * 60 * 100;
        const range = question.range * milliSecondsPerDay;
        return answer.getTime() - range <= new Date(question.answer).getTime() <= answer.getTime() + range ? 1 : 0;
    },

    playerWins(boardState, playerTurn, row, column) {

        return AnswerService.verifyWonRow(boardState, row, playerTurn) ||
            AnswerService.verifyWonColumn(boardState, column, playerTurn) ||
            AnswerService.verifyWonDiagonal(boardState, playerTurn) ||
            AnswerService.verifyWonAntiDiagonal(boardState, playerTurn)

    },

    verifyWonRow(boardState, row, player){
        for (var i = 0; i < 3; i++){
            if (boardState[row][i].player !== player || boardState[row][i].score === 0){
                return false;
            }
            if (i === boardState[row].length - 1){
                return true;
            }
        }
    },

    verifyWonColumn(boardState, column, player){
        for (var j = 0; j < 3; j++){
            if (boardState[j][column].player !== player || boardState[j][column].score === 0){
                return false;
            }
        }
        return true;

    },

    verifyWonDiagonal(boardState, player){
        for (var x = 0; x < 3; x++) {
            const cell = boardState[x][x];
            if (cell.player !== player) {
                return false
            }
        }
        return true;
    },
    verifyWonAntiDiagonal(boardState, player) {
        var y = 2;
        for (var x = 0; x < 3; x++) {
            const cell = boardState[y][x];
                if (cell.player !== player) {
                    return false;
                }
            y--;
        }
        return true;
    },

    isDraw(boardState) {
        const impossible = this.checkRows(boardState) +
            this.checkColumns(boardState) +
            this.checkDiagonal(boardState) +
            this.checkAntiDiagonal(boardState);

        return impossible === 8;



    },

    checkRows(boardState){
        var player = 0;
        var impossible = 0;
        for (var x = 0; x < boardState.length; x++){
            for (var y = 0; y < boardState.length; y++){
                if (boardState[x][y].score === 3){
                    if (player !== 0 && boardState[x][y].player !== player){
                        impossible++;
                        break;
                    }
                    Object.assign(player, boardState[x][y].player);
                }
            }
        }
        return impossible;
    },
    checkColumns(boardState){
        var player = 0;
        var impossible = 0;
        const n = 3;
        for (var x = 0; x < n; x++){
            for (var y = 0; y < n; y++){
                const cell = boardState[y][x];
                if (cell.score === 3){
                    if (player !== 0 && cell.player !== player){
                        impossible++;
                        break;
                    }
                    Object.assign(player, cell.player);
                }
            }
        }
        return impossible
    },
    checkDiagonal(boardState) {
        var player = 0;
        var impossible = 0;
        const n = 3;
        for (var x = 0; x < n; x++) {
            const cell = boardState[x][x];
            if (cell.score === 3) {
                if (player !== 0 && cell.player !== player) {
                    impossible++;
                    break;
                }
                Object.assign(player, cell.player);
            }

        }
        return impossible;
    },
    checkAntiDiagonal(boardState){
        var player = 0;
        var impossible = 0;
        const n = 3;
        var y = 2;
        for (var x = 0; x < n; x++) {
            const cell = boardState[y][x];
            if (cell.score === 3) {
                if (player !== 0 && cell.player !== player) {
                    impossible++;
                    break;
                }
                Object.assign(player, cell.player);
            }
            y--;
        }
        return impossible;
    }
};
