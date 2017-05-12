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
    this.state.type=props.type;
    this.renderColumns = this.renderColumns.bind(this);
  }


  renderColumns() {
    if (this.props.columns) {
      // console.log('this.props.posts in renderposts');
      // console.log(this.props.posts);
      return this.props.columns.map((col) => {
        return (
          <Column key={col.id} id={col.id} tiles={col.tiles} />
        );
      });
    } else {
      return 'loading';
    }
  }


  render() {
    return (
      <div id="PostList">
        {this.renderColumns()}
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
