import { connect } from 'react-redux';
import React, { Component } from 'react';
import Tone from 'tone';
import { ToneTypes, toggleTile, saveMusic, NUMROWS, NUMCOLS, NOTELENGTH, DEFAULT_TILE_STATE } from '../actions';
import Nav from '../components/nav';

// import update from 'react-addons-update'; // ES6

// MUST INDEX INTO 2d ARRAY with [COL][ROW]
// import Note from './note';
// const synth = new Tone.Synth().toMaster();
//eslint-disable-next-line
// const syntha = new Tone.PluckSynth().toMaster();
// const synth = new Tone.FMSynth().toMaster();
// const synth = new Tone.Synth().toMaster();
// const polySynth = new Tone.PolySynth(NUMROWS, Tone.Synth).toMaster();


class MusicPortion extends Component {
  constructor(props) {
    console.log('in constructor');
    super(props);
    this.state = {
      tiles: DEFAULT_TILE_STATE,
      tempo: 1000,
      synth: new Tone.Synth().set({
        volume: -4,
        oscillator: {
          type: 'triangle17',
        },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.2,
          release: 1.7,
        },
      }).toMaster(),

      polySynth: new Tone.PolySynth(10, Tone.SimpleSynth).set({
        volume: -4,
        oscillator: {
          type: 'triangle17',
        },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.2,
          release: 1.7,
        },
      }).toMaster(),
    };
    this.onTileClick = this.onTileClick.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.renderColumn = this.renderColumn.bind(this);
    this.playGrid = this.playGrid.bind(this);
    this.createNoteArray = this.createNoteArray.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
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
    // save the clicked tiles to server
    console.log('save clicked');
    this.props.saveMusic(this.state, this.props.history);
  }

  onTileClick(event) {
    // play a note corresponding to the row (defined in ToneTypes) for the duration of an 8th note
    this.state.synth.triggerAttackRelease(ToneTypes[event.target.title], '8n');

    const stateCopy = Object.assign({}, this.state);
    stateCopy.tiles[event.target.name][event.target.title] = !stateCopy.tiles[event.target.name][event.target.title]; // toggling whether tile is checked
    this.setState(stateCopy);

    // update the state in redux at every tile click
    this.props.toggleTile(stateCopy);
  }

  createNoteArray(colIndex) {
    const noteArray = [];
    for (let rowIndex = 0; rowIndex < NUMROWS; rowIndex += 1) {
      if (this.state.tiles[colIndex][rowIndex]) { // if the tile at [col][row] is active
        noteArray.push(ToneTypes[rowIndex]); // add the note corresponding to rowindex to noteArray
      }
    }
    return noteArray;
  }


  playGrid() {
    for (let col = 0; col < NUMCOLS; col += 1) {
      const noteArray = this.createNoteArray(col);

      // start attack
      setTimeout(() => {
        console.log(`triggering attack in col:${col} with NA ${noteArray}`);
        this.state.polySynth.triggerAttack(noteArray);
      }, col * this.state.tempo);

      // stop attack
      setTimeout(() => {
        console.log(`triggering release in col:${col} with NA ${noteArray}`);
        this.state.polySynth.triggerRelease(noteArray);
      }, col * this.state.tempo + NOTELENGTH); // eslint-disable-line
    }
  }


  renderGrid() {
    // if (this.state.1) {
    // console.log('this.props.posts in renderposts');
    // console.log(this.state.tiles);
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
          <label className={`tileLabel ${rowIndex}`} htmlFor={`tile${colIndex}_${rowIndex}`} />
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
            <button onClick={this.onCancelClick}>Cancel</button>
          </div>
        </div>
        <div id="songheader">song name</div>
        <div className="grid">
          {this.renderGrid()}
          <button type="button" onClick={this.playGrid}>Play</button>
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

export default (connect(mapStateToProps, { toggleTile, saveMusic })(MusicPortion));
