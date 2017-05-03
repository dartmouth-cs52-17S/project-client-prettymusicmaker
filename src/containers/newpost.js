import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchPosts } from '../actions';


class NewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: '',
      tags: '',
      cover_url: '',
    };
  }

  render() {
    return (
      <div className="newPostBoard">
        <div className="newPostTitle">
          <p>Create A New Post</p>
        </div>
        <div className="newPostContent">
          <input id="new_post_input_id" placeholder="title" />
          <input id="new_post_input_id" placeholder="tags" />
          <input id="new_post_input_id" placeholder="content" />
          <input id="new_post_input_id" placeholder="cover_url" />
        </div>
        <div className="newPostButtonContainer">
          <input id="new_post_button1" type="submit" value="Submit" />
          <input id="new_post_button2" type="submit" value="Cancel" />
        </div>
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

export default withRouter(connect(mapStateToProps, { fetchPosts })(NewPost));
