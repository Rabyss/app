
import {Link} from "react-router";
import {Game} from "../models/Game";
import {Routes} from "../../common/Routes";
import {GAME_STATUS} from "../../common/models/GameStatus";
import {Friend} from "../../common/models/Friend";
import {Score} from "../../common/models/Score";

interface GameItemProps {
  game: Game;
}

export class GameItem extends React.Component<GameItemProps, {}> {

  render() {
    const game: Game       = this.props.game;
    const opponent: Friend = game.opponent as Friend;
    const opponentName     = opponent != null ? opponent.name      : 'Loading...';
    const avatarUrl        = opponent != null ? opponent.avatarUrl : '';
    const classNames       = this.getClassNames();
    return (
      <li className={classNames.waiting}>
        <div className='media'>
          <Link to={Routes.Page.playGame(game)} className='pull-left' title='Switch to this game'>
            <img className='media-object img-circle' width='40' src={avatarUrl} alt='' />
          </Link>
          <div className='media-body'>
            <h5 className='media-heading'>
              <Link to={Routes.Page.playGame(game)} title='Switch to this game'>
                {opponentName}
              </Link>
            </h5>
            <span>{this.renderDescription()}</span>
          </div>
        </div>
      </li>
    );
  }

  renderDescription() {
    const game: Game   = this.props.game;
    const score: Score = this.props.game.score;

    return (
        <small>
          <b className='player'>{score.me}</b>
          –
          <b>{score.them}</b>
          &nbsp;
          (<small>{this.renderGameStatus(game)}</small>)
        </small>
    );
  }

  renderGameStatus(game: Game) {
    switch (game.status) {
      case GAME_STATUS.Creating:
        return <b>In creation</b>;

      case GAME_STATUS.Waiting:
        return <b>Waiting</b>;

      case GAME_STATUS.Declined:
        return <b>Declined</b>;

      case GAME_STATUS.Failed:
        return <b>Failed</b>;

      case GAME_STATUS.Ended:
        let text = '';
        let cls = '';

        if (game.isWon) {
          text = 'Won';
          cls = 'won';
        }
        else if (game.isDraw) {
          text = 'Draw';
          cls = 'draw';
        }
        else {
          text = 'Lost';
          cls = 'lost'
        }

        return <b className={cls}>{text}</b>;

      case GAME_STATUS.Playing:
        if (game.isMyTurnToPlay) {
          return <b className='player'>Your turn</b>;
        }

        return <b>Their turn</b>;

      default:
        return <b>?</b>;
    }
  }

  getClassNames() {
    return {
      waiting: this.props.game.isWaiting ? 'waiting' : ''
    };
  }
}


export class None extends React.Component<{}, {}> {

  render() {
    const center = { textAlign: 'center' };

    return (
      <li>
        <div className='media'>
          <div className='media-body'>
            <p style={center}>No games</p>
          </div>
        </div>
      </li>
    );
  }
}

