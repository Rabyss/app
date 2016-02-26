
'use strict';

import {Shapes} from './../boot/helpers/shapes';
import {JoinRequestStore} from './../stores/JoinRequestStore';

var React = require('react');

export const JoinRequest = React.createClass({

  propTypes: {
    request: Shapes.JoinRequest
  },

  render() {
    const from      = this.props.request.getFrom();
    const avatarUrl = from != null ? from.getAvatarUrl() : '';
    const name      = from != null ? from.getName() : 'Loading...';

    return (
      <li className='waiting'>
        <div className='media'>
          <a className='pull-left' title='Switch to this game' onClick={this.accept}>
            <img className='media-object img-circle' width='40' src={avatarUrl} alt='' />
          </a>
          <div className='media-body'>
            <h5 className='media-heading'>
              {name}
            </h5>
            <div className="waiting-actions">
              <button className='btn btn-mini btn-success' onClick={this.accept}>ACCEPT</button>
              <small> or <a href='' onClick={this.decline}>decline</a></small>
            </div>
          </div>
        </div>
      </li>
    );
  },

  accept(e) {
    e.preventDefault();
    JoinRequestStore.accept(this.props.request.getId());
  },

  decline(e) {
    e.preventDefault();
    JoinRequestStore.decline(this.props.request.getId());
  }

});

export const None = React.createClass({
  render() {
    var center = {textAlign: 'center'};
    return (
      <li>
        <div className='media'>
          <div className='media-body'>
            <p style={center}>No join requests</p>
          </div>
        </div>
      </li>
    );
  }
});
