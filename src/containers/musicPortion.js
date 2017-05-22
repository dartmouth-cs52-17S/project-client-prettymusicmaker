import { connect } from 'react-redux';
import React, { Component } from 'react';
import Tone from 'tone';

import { ToneTypes, toggleTile, saveMusic, updateMusic, NUMROWS, NUMCOLS, DEFAULT_TILE_STATE } from '../actions';

import Nav from '../components/nav';

let intervalID = null; //eslint-disable-line
let noteArray = [];
let playing = false;

class MusicPortionContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tiles: DEFAULT_TILE_STATE,
      tempo: 350,
      synth: new Tone.Synth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.Synth).toMaster(),
      firstSave: true,
      playing: false,
    };
    this.onTileClick = this.onTileClick.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.renderColumn = this.renderColumn.bind(this);
    this.playGrid = this.playGrid.bind(this);
    this.createNoteArray = this.createNoteArray.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.stopPlaying = this.stopPlaying.bind(this);
  }

  componentWillMount() {
    const tempState = [
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
    ];

    const stateCopy = Object.assign({}, this.state);
    stateCopy.tiles = tempState;
    this.setState(stateCopy);
    // update the state in redux
    this.props.toggleTile(stateCopy);
  }

  // reset the notes to false when cancel is clicked
  onCancelClick(e) {
    // reset the clicked tiles
    const tempState = [
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
    ];
    const stateCopy = Object.assign({}, this.state);
    stateCopy.tiles = tempState;
    this.setState(stateCopy);
    // update the state in redux
    this.props.toggleTile(stateCopy);
  }

  onSaveClick(e) {
    // save the clicked tiles to server if it's the first save
    if (this.state.firstSave === true) {
      console.log('save clicked');
      this.props.saveMusic(this.state, this.props.history);
      this.state.firstSave = false;
    } else {
      console.log('updating song');
      this.props.updateMusic(this.state, this.props.history);
    }
  }

  onTileClick(event) {
    // play a note corresponding to the row (defined in ToneTypes) for the duration of an 8th note
    const stateCopy = Object.assign({}, this.state);
    if (!stateCopy.tiles[event.target.name][event.target.title]) {
      this.state.synth.triggerAttackRelease(ToneTypes[event.target.title], '8n');
      stateCopy.tiles[event.target.name][event.target.title] = true;
    } else {
      stateCopy.tiles[event.target.name][event.target.title] = false; // toggling whether tile is checked
    }
    this.setState(stateCopy);

    // update the state in redux at every tile click
    this.props.toggleTile(stateCopy);
  }

  createNoteArray(colIndex) {
    const tmpNoteArray = [];
    for (let rowIndex = 0; rowIndex < NUMROWS; rowIndex += 1) {
      if (this.state.tiles[colIndex][rowIndex]) { // if the tile at [col][row] is active
        tmpNoteArray.push(ToneTypes[rowIndex]); // add the tile corresponding to rowindex to Array
        document.getElementById(`label${colIndex}_${rowIndex}`).classList.add('glow');
      }
    }
    return tmpNoteArray;
  }

  stopPlaying() { //eslint-disable-line
    if (intervalID) {
      clearInterval(intervalID);
      this.state.polySynth.triggerRelease(noteArray);
      const element = document.getElementsByClassName('tileLabel');
      for (let i = 0; i < element.length; i += 1) {
        element[i].classList.remove('glow');
      }
      playing = false;
    } else {
      console.log('no song is playing');
    }
  }

  playGrid(play) {
    if (playing === false) {
      playing = true;
      let col = 0;
      noteArray = []; // declared in constants up top
      let prevArray = [];
      intervalID = setInterval(() => {
        if (col !== 0) {
          this.state.polySynth.triggerRelease(prevArray);
          const prevCol = col - 1;
          const element = document.getElementsByClassName(`col${prevCol}`);
          for (let i = 0; i < element.length; i += 1) {
            element[i].classList.remove('glow');
          }
        }
        if (col >= NUMCOLS) {
          col = 0;
        }
        noteArray = this.createNoteArray(col);
        this.state.polySynth.triggerAttack(noteArray);
        prevArray = noteArray;
        col += 1;
      }, this.state.tempo);
    }
  }


  renderGrid() {
    return this.state.tiles.map((col, colIndex) => {
      return (
        <div className="column">
          {this.renderColumn(col, colIndex)}
        </div>
      );
    });
  }


  renderColumn(col, colIndex) {
    return col.map((tile, rowIndex) => {
      return (
        <div className="checkbox_and_label">
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" onChange={this.onTileClick} checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex}`} id={`label${colIndex}_${rowIndex}`} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }

  render() {
    return (
      <div id="inputwindow">
        <Nav />
        <div className="saveBar">
          <div className="saveBarInner">
            <button onClick={this.onSaveClick}>Save</button>
            <button onClick={this.onCancelClick}>Clear</button>
          </div>
        </div>
        <div id="songheader">song name</div>
        <div className="grid">
          {this.renderGrid()}
          <button type="button" onClick={this.playGrid}>Play</button>
          <button type="button" onClick={this.stopPlaying}>Pause</button>
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

export default (connect(mapStateToProps, { toggleTile, saveMusic, updateMusic })(MusicPortionContainer));
