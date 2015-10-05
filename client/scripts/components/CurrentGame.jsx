
'use strict';

var React = require('react');

var CurrentGame = React.createClass({

  propTypes: {
    game: R.Shapes.Game
  },

  render() {
    const game         = this.props.game;
    const opponent     = game.getOpponent();
    const opponentName = opponent != null ? opponent.getName() : 'Loading...';
    const avatarUrl    = opponent != null ? opponent.getAvatarUrl() : '';
    const classNames   = this.getClassNames();

    return (
      <li className={classNames.waiting}>
        <div className='media'>
          <a className='pull-left' title='Switch to this game' href="#" onClick={this.switchToGame(game)}>
            <img className='media-object img-circle' width='40' src={avatarUrl} alt='' />
          </a>
          <div className='media-body'>
            <h5 className='media-heading'>
              <a title='Switch to this game' onClick={this.switchToGame(game)} href="#">
                {opponentName}
              </a>
            </h5>
            <p>{this.renderDescription()}</p>
          </div>
        </div>
      </li>
    );
  },

  renderDescription() {
    var game = this.props.game;
    var desc = <small></small>;

    switch (game.getStatus()) {
      case GameStatus.Creating:
        return <small><b>In creation</b></small>;

      case GameStatus.Waiting:
        return <small><b>Waiting</b></small>;

      case GameStatus.Declined:
        return <small><b>Declined</b></small>;

      case GameStatus.Failed:
        return <small><b>Failed</b></small>;

      case GameStatus.Ended:
      case GameStatus.Finished:
        desc = <small><b>Ended</b></small>;
        break;

      case GameStatus.Playing:
        if (game.isMyTurnToPlay()) {
          desc = <small><b className='player'>Your turn</b></small>;
        } else {
          desc = <small><b>Their turn</b></small>;
        }
    }

    var score = this.props.game.getScore() || {};

    return (
      <small>
        <b className='player'>{score.me}</b>
        –
        <b>{score.them}</b>
        &nbsp;
        ({desc})
      </small>
    );
  },

  switchToGame(game) {
    return (e) => {
      e.preventDefault();
      R.GameStore.switchTo(game.getId());
    };
  },

  getClassNames() {
    return {
      waiting: this.props.game.isWaiting() ? 'waiting' : ''
    };
  }
});

CurrentGame.None = React.createClass({
  render() {
    var center = {textAlign: 'center'};
    return (
      <li>
        <div className='media'>
          <div className='media-body'>
            <p style={center}>No current games</p>
          </div>
        </div>
      </li>
    );
  }
});

Reminisce.CurrentGame = CurrentGame;
