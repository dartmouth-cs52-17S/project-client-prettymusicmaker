import { connect } from 'react-redux';
import React, { Component } from 'react';
// import update from 'react-addons-update'; // ES6

import { addTile } from '../actions';


// import Note from './note';

// eslint-disable-next-line react/prefer-stateless-function
class MusicPortion extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    console.log('in constructor');
    super(props);
    this.state = {
      tiles: [[false, true], [false, true]],
    };
    this.onTileClick = this.onTileClick.bind(this);
    this.renderTiles = this.renderTiles.bind(this);
    this.renderColumn = this.renderColumn.bind(this);
  }

  onTileClick(event) {
    // this.setState({ tiles: event.target.value });
    console.log('in addNoteClick props is');
    console.log(this.props);
    console.log('e.t is :');
    console.log(event.target);


    const stateCopy = Object.assign({}, this.state);
    stateCopy.tiles[event.target.title][event.target.name] = !stateCopy.tiles[event.target.title][event.target.name]; // toggling whether tile is checked
    this.setState(stateCopy);
  }

  renderColumn(col, rowIndex) {
    return col.map((tile, colIndex) => {
      return (
        <input type="checkbox" title={rowIndex} name={colIndex} className="tile" onChange={this.onTileClick} checked={tile} />
      );
    });
  }

  renderTiles() {
    // if (this.state.1) {
    // console.log('this.props.posts in renderposts');
    // console.log(this.state.tiles);
    return this.state.tiles.map((col, rowIndex) => {
      return (
        <div className="column">
          {this.renderColumn(col, rowIndex)}
        </div>
      );
    });
  }


  render() {
    return (
      <div id="inputwindow">
        <h1> Notes below here </h1>
        <div className="musicPortion">
          {this.renderTiles()}
        </div>
      </div>

    );
  }
}

export default (connect(null, { addTile })(MusicPortion));

// export default NoteInput;
