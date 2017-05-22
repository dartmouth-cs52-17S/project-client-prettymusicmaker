import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';

import { connect } from 'react-redux';
import { deleteMusic } from '../actions';


class MusicTile extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.onDeleteClicked = this.onDeleteClicked.bind(this);
  }

  // delete a Song
  onDeleteClicked() {
    // console.log(this.props.id);
    // console.log(this.props.history);
    this.props.deleteMusic(this.props.id, this.props.history);
  }

  render() {
    const id = this.props.id;

    return (
      <div className="songinfo">
        <div className="songtitle">{id}</div>
        <NavLink to={`editor/${id}`}>see</NavLink>
        <button>edit</button>
        <button>share</button>
        <button onClick={this.onDeleteClicked}>delete</button>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
  }
);

export default withRouter(connect(mapStateToProps, { deleteMusic })(MusicTile));
