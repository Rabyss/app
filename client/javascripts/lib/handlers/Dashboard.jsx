
'use strict';

var React = require('react'),
    Players = require('../components/Players'),
    CurrentGames = require('../components/CurrentGames'),
    JoinRequests = require('../components/JoinRequests'),
    Footer = require('../components/Footer'),
    shapes = require('../components/shapes');

var Dashboard = React.createClass({

  propTypes: {
    currentGame: shapes.Game,
    user: shapes.User,
    games: React.PropTypes.arrayOf(shapes.Game),
    joinRequests: React.PropTypes.arrayOf(shapes.JoinRequest)
  },

  render() {
    return (
      <div>
        <Players game={this.props.currentGame} user={this.props.user} />
        <div id="dashboard" className="grid-container">
          <div className="grid-20">
            <div className="notifications">
              <CurrentGames games={this.props.games} />
            </div>
          </div>
          <div className='grid-50 prefix-5'>
            <div className="dashboard-main">
              {this.props.children}
            </div>
          </div>
          <div className='grid-20 prefix-5'>
            <div className='notifications'>
              <JoinRequests requests={this.props.joinRequests} />
            </div>
          </div>
        </div>
        <nav id="navigation-toggle" role="navigation">
          <div className="grid-container">
            <div id="js-footer" className="grid-100">
              <Footer />
            </div>
          </div>
        </nav>
      </div>
    );
  }

});

module.exports = Dashboard;