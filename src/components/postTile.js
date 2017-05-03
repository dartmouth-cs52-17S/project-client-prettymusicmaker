import React, { Component } from 'react';

class PostTile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const url = this.props.cover_url;
    const title = this.props.title;
    const tags = this.props.tags;

    return (
      <div className="postContainer">
        <img src={url} />
        <div className="postTitleBox1">
          <p>{title}</p>
        </div>
        <div className="postTitleBox2">
          <p>{tags}</p>
        </div>
      </div>
    );
  }
}

export default PostTile;
