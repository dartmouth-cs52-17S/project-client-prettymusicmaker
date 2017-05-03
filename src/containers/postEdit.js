import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { deletePost } from '../actions';


class PostEdit extends Component {
  constructor(props) {
    super(props);

    this.onDeleteClicked = this.onDeleteClicked.bind(this);

    this.state = {
    };
  }

  // fetch the current post
  componentDidMount() {

  }

  // delete the post
  onDeleteClicked(e) {
    e.preventDefault();
    this.props.deletePost(this.props.match.params.postID, this.props.history);
  }

  render() {
    return (
      <div className="deletePostHeader">
        <NavLink id="back" exact to="/"><p>Back To Index</p></NavLink>
        <input id="deleteButton" onClick={this.onDeleteClicked} type="submit" value="Delete" />
      </div>
    );
  }
}

// connects particular parts of redux state to props
const mapStateToProps = state => (
  {
    posts: state.posts.all,
  }
);

export default withRouter(connect(mapStateToProps, { deletePost })(PostEdit));
