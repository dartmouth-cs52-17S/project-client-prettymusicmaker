import { connect } from 'react-redux';
import React, { Component } from 'react';

import { toggleTile } from '../actions';

class MusicPortion extends Component {
  constructor(props) {
    console.log('in constructor');
    super(props);
    this.state = {
      tiles: [[false, false], [false, false]],
    };
    this.onTileClick = this.onTileClick.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.renderColumn = this.renderColumn.bind(this);
    this.playLoop = this.playLoop.bind(this);
  }

  onTileClick(event) {
    console.log('in addNoteClick props is');
    console.log(this.props);
    console.log('e.t is :');
    console.log(event.target);


    const stateCopy = Object.assign({}, this.state);
    stateCopy.tiles[event.target.title][event.target.name] = !stateCopy.tiles[event.target.title][event.target.name]; // toggling whether tile is checked
    this.setState(stateCopy);

    // update the state in redux at every tile click
    this.props.toggleTile(this.state);
  }
  playLoop() {
    // play
    console.log(this.props.tileArray);
  }

  renderGrid() {
    return this.state.tiles.map((col, rowIndex) => {
      return (
        <div className="column">
          {this.renderColumn(col, rowIndex)}
        </div>
      );
    });
  }


  renderColumn(col, rowIndex) {
    return col.map((tile, colIndex) => {
      return (
        <input type="checkbox" title={rowIndex} name={colIndex} className="tile" onChange={this.onTileClick} checked={tile} />
      );
    });
  }

  render() {
    return (
      <div id="inputwindow">
        <h1> Notes below here </h1>
        <div className="musicPortion">
          {this.renderGrid()}
          <button type="button" onClick={this.playLoop}>Play</button>
        </div>
      </div>

    );
  }
}

// get access to tiles as tileArray
const mapStateToProps = state => (
  {
    tileArray: state.music.tiles,
  }
);

export default (connect(mapStateToProps, { toggleTile })(MusicPortion));
