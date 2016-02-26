
'use strict';

import {GameStore} from './../stores/GameStore';
import {StartGameModal} from './modals/StartGameModal';
import {FriendsAutocomplete} from './FriendsAutocomplete';
import {QuitGameModal} from './modals/QuitGameModal';

var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    ModalTrigger = Bootstrap.ModalTrigger,
    debug = require('debug')('GameToolbar');

export const GameToolbar = React.createClass({

  getInitialState() {
    return {
      showStartModal: false,
      friend: null
    };
  },

  onFriendSelect(friend) {
    debug('friend', friend);
    this.setState({
      friend,
      showStartModal: true
    });
  },

  /* eslint no-underscore-dangle: 0 */
  startGame(friend) {
    GameStore.start(friend._id);
  },

  onStart() {
    this.setState({ showStartModal: false});
    this.startGame(this.state.friend);
  },

  onAbortStart() {
    this.setState({
      showStartModal: false,
      friend: null
    });
  },

  onQuit() {
    debug('quit game');
    GameStore.quit(this.props.game);
    Session.set('page', 'home');
  },

  onResume() {
    debug('resume game');
  },

  render() {
    var startModal = '';

    if (this.state.showStartModal && this.state.friend) {
      startModal = <StartGameModal friend={this.state.friend}
                                   onOk={this.onStart}
                                   onCancel={this.onAbortStart} />;
    }

    return (
      <span>
        <span className='start-game'>
          Start new game with
          &nbsp;
          <FriendsAutocomplete onSelect={this.onFriendSelect} />
          {/* &nbsp; <i className='icon-check-sign'></i> */}
        </span>
        &nbsp;
        {this.renderQuitGameButton()}
        {startModal}
      </span>
    );
  },

  renderQuitGameButton() {
    if (this.props.game == null) {
      return '';
    }

    return (
      <ModalTrigger modal={<QuitGameModal game={this.props.game} onQuit={this.onQuit} onResume={this.onResume} />}>
        <a role='button' data-toggle='modal' href='#modal-confirm'>
          <i className='icon-signout'></i>
          Quit this game
        </a>
      </ModalTrigger>
    );
  }

});
