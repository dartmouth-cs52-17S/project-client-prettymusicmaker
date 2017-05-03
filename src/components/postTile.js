import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class PostTile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const url = this.props.cover_url;
    const title = this.props.title;
    const tags = this.props.tags;
    const id = this.props.id;

    return (
      <NavLink className="postContainer" to={`/post/${id}`}>
        <div className="imageContainer">
          <img src={url} alt="Can't show resource. No valid URL found." />
        </div>
        <div className="postTitleBox1">
          <p>{title}</p>
        </div>
        <div className="postTitleBox2">
          <p>{tags}</p>
        </div>
      </NavLink>
    );
  }
}

export default PostTile;
