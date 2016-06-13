import {GameFetches} from "./collections/GameFetches";
import {GameFetchRepository} from './repositories/GameFetchRepository';
import {BotService} from './services/BotService';
import {Games} from './collections/Games';
import {Game} from './collections/Game';
import {GameBoard, RawGameBoard} from '../common/models/GameBoard';
import {GameBoardRepository} from './repositories/GameBoardRepository';
import {GameStatus, GAME_STATUS} from '../common/models/GameStatus';
import {GameFetch} from "./collections/GameFetch";
import {GameCreatorService} from './services/GameCreatorService';
import {FacebookService} from "./services/FacebookService";
import {MeteorUser} from "./MeteorUser";

export const Server = {

  fetchGameBoard(fbId: string, gameId: string | Mongo.ObjectID, playerNum: number, createFetch: boolean = true) {
    console.log(`Fetching game board for user ${fbId}... and game ${gameId}`);
    const game: Game = Games.findOne(gameId);
    const bot = BotService.bot();

    let gameBoard;

    if (!game) {
      return;
    }
    try {
      if (BotService.isBot(fbId)) {
        console.log(`User ${fbId} is a bot. Creating bot board...`);
        const botBoard: RawGameBoard = JSON.parse(Assets.getText('json/gameboards/gameboard1.json'));
        botBoard.userId = fbId;
        gameBoard = GameBoard.fromRaw(botBoard);
      }
      else {
        const user: MeteorUser = FacebookService.getUserFromFacebookId(fbId);
        const accessToken = user.services.facebook.accessToken;
        const rawBoard: RawGameBoard = GameCreatorService.fetchGameboard(fbId, accessToken).data;
        rawBoard.userId = fbId;

        gameBoard = GameBoard.fromRaw(rawBoard);

      }

      GameBoardRepository.save(gameBoard);
      switch (playerNum) {
        case 1:
          game.player1Board = gameBoard;
          break;
        case 2:
          game.player2Board = gameBoard;
          break;
        default:
          throw new Meteor.Error(`Playern Number ${playerNum} is not authorized [1, 2] only`)
      }

      const status = (game.player1Board && game.player2Board) ? GAME_STATUS.Playing : GAME_STATUS.Creating;
      game.status = status;

      Games.update(game._id, game);

      return gameBoard;
    }
    catch (e) {
      console.error(`ERROR: Can't create game board from game creator result.`);
      console.error(`ERROR: ${e.stack}`);

      if (createFetch && !BotService.isBot(fbId)) {
        console.log(`Creating new fetch request as it failed for user ${fbId} in game: ${game._id}`);
        const fetch = new GameFetch(
            new Mongo.ObjectID(),
            game._id,
            fbId,
            playerNum,
            1
        );

        GameFetchRepository.save(fetch);
      }
    }
  },

  fetchData(fbId: string) {
    console.log(`Fetching data for user ${fbId}...`);
    const user = FacebookService.getUserFromFacebookId(fbId);
    const accessToken = user.services.facebook.accessToken;

    try {
      const result = GameCreatorService.fetchData(fbId, accessToken);
      console.log(`Game creator replied: ${result.data.message}`);
    }
    catch (e) {
      console.error(`Non 200 reply from game creator to 'fetchData' request ${e}`);
    }
  },

  fetchAllBoards() {
    const fetches = GameFetches.find().fetch();
    fetches.forEach((fetch: GameFetch) => {
      Meteor.setTimeout(() => {
        console.log(`Trygin again to fetch data for ${fetch.playerId} in game: ${fetch.gameId} for the: ${fetch.tries} time`);
        this.processFetch(fetch);
      }, 0);
    });
  },

  processFetch(fetch: GameFetch) {
    console.log(`Processing fetch ${fetch._id}...`);
    console.log(` - Game: ${fetch.gameId}`);
    console.log(` - Player Id: ${fetch.playerId}`);
    console.log(` - Player Num: ${fetch.player}`);
    console.log(` - Tries: ${fetch.tries}`);

    const board = this.fetchGameBoard(fetch.playerId, fetch.gameId, fetch.player, false);

    if (board == null) {
      this.fetchFailed(fetch);
    } else {
      GameFetches.remove(fetch._id);

    }
  },

  fetchFailed(fetch: GameFetch) {
    fetch.incrementTries();

    if (fetch.tries >= 10) {
      const failedGame: Game = Games.findOne(fetch.gameId);
      if (failedGame) {
        failedGame.status = GAME_STATUS.Failed;
        Games.update(failedGame._id, failedGame);
        console.log(`Server: Maximum number of tries for game ${failedGame._id} reached`);
      }
      GameFetches.remove(fetch._id);

    }
    else {
      GameFetchRepository.save(fetch);
    }
  }

};


