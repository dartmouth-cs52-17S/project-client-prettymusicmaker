import React, { Component } from 'react';

class Column extends Component {

  constructor(props){
    super(props);
    this.state {
      tiles: props.tiles,
    };
  }

  render(){
    return (
      //render each tile mapped to own div, display and key by sound
      var TileColumn = this.props.tiles.map(function(tile) {
            return <div className="tile" key={tile.sound}>{tile.sound}</div>;
        });
        return <div>{TileColumn}</div>;
    )
  }
}
