import React, { Component } from 'react';
// import Draggable from 'react-draggable'; // The default
// import marked from 'marked';
// import Textarea from 'react-textarea-autosize';


class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sound: props.sound,
      activated: props.activated,
    };
  }


  render() {
    return (
      <div className="tile" />
    );
  }
}

export default Tile;
