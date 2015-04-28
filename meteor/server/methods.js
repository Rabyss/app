Meteor.methods({

    'fetchGameBoard': function(userId) {
        var data = Server.fetchGameBoard(userId);
        return {status: "success", gameBoard: data};
    },

    'fetchData': function(userId) {
      Server.fetchData(userId);
    },

    'JoinRequest.decline': function(requestId) {
      JoinRequestService.decline(requestId);
      return {status: "success", error: null};
    },

    'JoinRequest.accept': function(requestId) {
      return JoinRequestService.accept(requestId);
    },

    'JoinRequest.send': function(userId) {
      return JoinRequestService.send(userId);
    },

    'Game.start': function(userId) {
        var gameId = "example";
        return {status: "success"};
    },

    'Game.quit': function(gameId) {
        return {status: "success"};
    },

    'Game.timeout': function(gameId){
        return {status: "success"};
    },

    'Answer.post': function(gameId, tileId, answers){
        var game = Games.find(gameId);
        var board;
        var currentUser = Meteor.userId();
        if (currentUser === game.player1) {
            board = GameBoards.find(game.player1Board);
        } else if (currentUser === game.player2) {
            board = GameBoards.find(game.player2Board);
        } else {
            throw Meteor.Error(404, "Invalid gameId + " + gameId + "user does not play this game");
        }
        var tile = _.find(board.tiles, function(tile){return tile.id === tileId});
        if (tile){
            var correctAnswer = _.map(tile.questions, function(q){return q.answer});
            var result = _.reduce(_.map(_.zip(correctAnswer, answers), function(aa){
                return aa[0] === aa[1] ? 1 : 0;
            }), function(acc, r){return acc + r;}, 0);
            return {
                status: "success",
                data: {
                    correct: result,
                    wrong: 3 - result
                }
            }
        } else {
            throw Meteor.Error(404, "Invalid tileId + " + tileId);
        }

    }



});
