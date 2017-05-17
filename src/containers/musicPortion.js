import { connect } from 'react-redux';
import React, { Component } from 'react';
import Tone from 'tone';
import { ToneTypes, toggleTile } from '../actions';
// import update from 'react-addons-update'; // ES6

// MUST INDEX INTO 2d ARRAY with [COL][ROW]
// import Note from './note';
// const synth = new Tone.Synth().toMaster();
// const synth = new Tone.PluckSynth().toMaster();
// const synth = new Tone.FMSynth().toMaster();
const synth = new Tone.MembraneSynth().toMaster();


// eslint-disable-next-line react/prefer-stateless-function
class MusicPortion extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    console.log('in constructor');
    super(props);
    this.state = {
      tiles: [[false, false], [true, true]],
    };
    this.onTileClick = this.onTileClick.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.renderColumn = this.renderColumn.bind(this);
    this.playGrid = this.playGrid.bind(this);
    this.triggerSynth = this.triggerSynth.bind(this);
  }
  //eslint-disable-next-line
  triggerSynth(time) {
// the time is the sample-accurate time of the event
    console.log('IN TRIGGERSYNTG');
    synth.triggerAttackRelease('C2', '8n', time);
  }

  onTileClick(event) {
    // this.setState({ tiles: event.target.value });
    console.log('in addNoteClick props is');
    console.log(this.props);
    console.log('e.t is :');
    console.log(event.target);
    // create a synth and connect it to the master output (your speakers)

    // play a note corresponding to the row (defined in ToneTypes) for the duration of an 8th note
    // synth.triggerAttackRelease(ToneTypes[event.target.title], '8n', 1);
    // synth.triggerAttackRelease('C4', '4n', '8n');
    // synth.triggerAttackRelease('E4', '8n', '4n + 8n');
    // Tone.Transport.schedule(this.triggerSynth(), '10s');
    const loop = new Tone.Loop((time) => {
      synth.triggerAttackRelease('C1', '8n', time);
    }, '4n');

    // play the loop between 0-2m on the transport
    loop.start(0).stop('2m');
    Tone.Transport.start('+0.1');

    const stateCopy = Object.assign({}, this.state);
    stateCopy.tiles[event.target.name][event.target.title] = !stateCopy.tiles[event.target.name][event.target.title]; // toggling whether tile is checked
    this.setState(stateCopy);

    this.props.toggleTile(this.state);
  }

  playGrid() {
    // play
    return this.state.tiles.map((col, colIndex) => {
      return (
        <div className="column">
          {this.playColumn(col, colIndex)}
        </div>
      );
    });
  }

//eslint-disable-next-line
  playColumn(col, colIndex) {
    return col.map((tile, rowIndex) => {
      return (
        synth.triggerAttackRelease(ToneTypes[rowIndex], '8n', colIndex)
      );
    });
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
          <button type="button" onClick={this.playGrid}>Play</button>
        </div>
      </div>

    );
  }
}

export default (connect(null, { toggleTile })(MusicPortion));

// export default NoteInput;
