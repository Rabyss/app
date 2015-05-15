
'use strict';

var React = require('react'),
    Button = require('react-bootstrap').Button,
    pluralize = require('pluralize'),
    getQuestionTitleByType = require('./getQuestionTitleByType'),
    shapes = require('../shapes'),
    Post = require('../Post'),
    { agoToDate, dateToAgo } = require('../../helpers/timeAgo');
    // debug = require('debug')('Timeline');

var Timeline = React.createClass({

  propTypes: {
    // id: React.PropTypes.number.isRequired,
    type: React.PropTypes.string.isRequired,
    subject: shapes.post.isRequired,
    max: React.PropTypes.string.isRequired,
    min: React.PropTypes.string.isRequired,
    step: React.PropTypes.number.isRequired,
    default: React.PropTypes.string.isRequired,
    unit: React.PropTypes.string.isRequired,
    onDone: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      ago: this.toRelative(this.props.default)
    };
  },

  componentWillReceiveProps(props) {
    this.setState(this.getInitialState());
  },

  toRelative(date) {
    return dateToAgo(date, this.props.unit.toLowerCase());
  },

  propsToRelative() {
    return {
      min: this.toRelative(this.props.min),
      max: this.toRelative(this.props.max),
      default: this.toRelative(this.props.default),
    };
  },

  render() {
    const rel = this.propsToRelative();

    return (
      <div className="question question-time">
        <h4>{getQuestionTitleByType(this.props.type)}</h4>
        <div className="question-subject">
          <Post post={this.props.subject} />
        </div>
        <div className="question-input">
          <input
            type="range"
            max={rel.min}
            min={rel.max}
            step={this.props.step}
            value={this.state.ago}
            onChange={this.onChange} />
          <Button onClick={this.onSubmit}>{this.getButtonText()}</Button>
        </div>
      </div>
    );
  },

  getButtonText() {
    return pluralize(this.props.unit.toLowerCase(), this.state.ago, true) + ' ago ' +
           '(' + agoToDate(this.state.ago, this.props.unit) + ')';
  },

  onChange(e) {
    this.setState({
      ago: +e.target.value
    });
  },

  onSubmit() {
    this.props.onDone({
      date: agoToDate(this.state.ago, this.props.unit, null)
    });
  }

});

module.exports = Timeline;
