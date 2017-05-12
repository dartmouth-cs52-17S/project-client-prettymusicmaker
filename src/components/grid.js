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

class Grid extends Component {
  constructor(props) {
    super(props);
    this.renderColumns = this.renderColumns.bind(this);
  }

  // componentDidMount() {
  //   this.props.fetchPosts();
  // }

  renderPosts() {
    if (this.props.posts) {
      console.log('this.props.posts in renderposts');
      console.log(this.props.posts);
      return this.props.posts.map((post) => {
        return (
          <NavLink to={`/posts/${post.id}`}><PostTile key={post.id} id={post.id} cover_url={post.cover_url} title={post.title} tags={post.tags} content={post.content} /> </NavLink>
        );
      });
    } else {
      return 'loading';
    }
  }


  render() {
    return (
      <div id="PostList">
        {this.renderPosts()}
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
