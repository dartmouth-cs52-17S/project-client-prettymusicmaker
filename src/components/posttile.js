import React, { Component } from 'react';
// import Draggable from 'react-draggable'; // The default
// import marked from 'marked';
// import Textarea from 'react-textarea-autosize';


class PostTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      cover_url: props.cover_url,
      title: props.title,
      tags: props.tags,
    };
    console.log('tile contructor props');
    console.log(props);
  }


  render() {
    console.log('this.state in render post tile');
    console.log(this.state);
    return (
      <div className="PostTile">
        <img alt="Cover" className="Cover_Url" src={this.state.cover_url} />
        <div className="PostTileText">
          <h1>{this.state.title}</h1>
          {this.state.tags}
        </div>
      </div>
    );
  }
}

export default PostTile;
