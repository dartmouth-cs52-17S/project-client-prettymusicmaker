import { connect } from 'react-redux';
import React, { Component } from 'react';
import Tone from 'tone';
import { ToneTypes, toggleTile, saveMusic, updateMusic, NUMROWS, NUMCOLS, NOTELENGTH, DEFAULT_TILE_STATE } from '../actions';
import Nav from '../components/nav';


class MusicPortion extends Component {
  constructor(props) {
    console.log('in constructor');
    super(props);
    this.state = {
      id: '',
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
    const noteArray = [];
    for (let rowIndex = 0; rowIndex < NUMROWS; rowIndex += 1) {
      if (this.state.tiles[colIndex][rowIndex]) { // if the tile at [col][row] is active
        noteArray.push(ToneTypes[rowIndex]); // add the tile corresponding to rowindex to Array
        document.getElementById(`label${colIndex}_${rowIndex}`).classList.add('glow');
      }
    }
    return noteArray;
  }

  stopPlaying() {
    this.setState({ playing: false });
  }

  playGrid() {
    this.setState({ playing:true }); //eslint-disable-line
    // do { //eslint-disable-line
    for (let col = 0; col < NUMCOLS; col += 1) {
        // start attack
      let noteArray = [];
      setTimeout(() => {
        noteArray = this.createNoteArray(col);
        console.log(`triggering attack in col:${col} with NA ${noteArray}`);
        this.state.polySynth.triggerAttack(noteArray);
      }, col * this.state.tempo);

        // stop attack
      setTimeout(() => {
        console.log(`triggering release in col:${col} with NA ${noteArray}`);
        this.state.polySynth.triggerRelease(noteArray);
          // turn glow off after done playing
        const element = document.getElementsByClassName(`col${col}`);
        for (let i = 0; i < element.length; i += 1) {
          element[i].classList.remove('glow');
        }
        }, col * this.state.tempo + NOTELENGTH); // eslint-disable-line
    }
    // } while (true);
    // console.log('hi');
    // console.log(this.state.playing);
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
    id: state.id,
    tileArray: state.music.tiles,
  }
);

export default (connect(mapStateToProps, { toggleTile, saveMusic, updateMusic })(MusicPortion));
