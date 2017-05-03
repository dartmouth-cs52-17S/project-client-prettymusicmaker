import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchPosts } from '../actions';
import PostTile from '../components/postTile';


class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  // fetch all posts
  componentDidMount() {
    this.props.fetchPosts();
  }

  render() {
    if (!this.props.posts) {
      return <div>Loading...</div>;
    }
    const postItems = this.props.posts.map((post) => {
      return (<PostTile key={post.id}
        id={post.id}
        title={post.title}
        cover_url={post.cover_url}
        tags={post.tags}
      />);
    });
    return (
      <div className="mainBoard">
        <div className="postBoardTitle">
          <p>Posts</p>
        </div>
        <div className="postBoardContent">
          {postItems}
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

export default withRouter(connect(mapStateToProps, { fetchPosts })(Posts));
