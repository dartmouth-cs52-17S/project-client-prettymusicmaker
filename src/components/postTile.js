import React, { Component } from 'react';

class PostTile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const url = this.props.cover_url;
    const title = this.props.title;
    const id = this.props.id;
    const tags = this.props.tags;
    console.log(id);
    console.log(title);
    return (
      <div className="note_container">
        <p>{url}</p>
        <p>{title}</p>
        <p>{id}</p>
        <p>{tags}</p>
      </div>
    );
  }
}

export default PostTile;
