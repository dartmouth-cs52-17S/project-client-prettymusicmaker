// import ReactDOM from 'react-dom';
// import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
// import { createStore, applyMiddleware, compose } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

// import reducers from './reducers';
import PostTile from '../components/posttile';
import { fetchPosts } from '../actions';

// import NewPost from '../components/newpost';

class musicPortion extends Component {
  constructor(props) {
    super(props);
    this.renderPosts = this.renderPosts.bind(this);
  }

  componentDidMount() {
    this.props.fetchPosts();
  }

  renderGrids() {
    if (this.props.grids) {
      // console.log('this.props.posts in renderposts');
      // console.log(this.props.posts);
      return this.props.grids.map((grid) => {
        return (
          <PostTile key={post.id} id={post.id} type={post.cover_url} />
        );
      });
    } else {
      return 'loading';
    }
  }


  render() {
    return (
      <div id="PostList">
        {this.renderGrids()}
      </div>
    );
  }

}

const mapStateToProps = state => (
  {
    posts: state.posts.all,
  }
);

export default (connect(mapStateToProps, { fetchPosts })(Posts));
