import { connect } from 'react-redux';
import React, { Component } from 'react';
import Tone from 'tone';
//eslint-disable-next-line
import { ToneTypes, toggleTile, saveMusic, updateMusic, NUMROWS, NUMCOLS, NOTELENGTH, DEFAULT_TILE_STATE, DEFAULT_BASS_ROW } from '../actions';
import { ToneTypes, toggleTile, saveMusic, updateMusic, NUMROWS, NUMCOLS, DEFAULT_TILE_STATE } from '../actions';
import Nav from '../components/nav';
import TempoSlider from '../components/tempoSlider'; // eslint-disable-line

let intervalID = null; //eslint-disable-line
let noteArray = [];
let part = null;
let position = null;

class MusicPortion extends Component {
  constructor(props) {
    console.log('in constructor');
    super(props);
    this.state = {
      tiles: DEFAULT_TILE_STATE,
      bassRow: DEFAULT_BASS_ROW,
      tempo: 350,
      synth: new Tone.Synth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.Synth).toMaster(),
      bass: new Tone.MembraneSynth().toMaster(),
      firstSave: true,
      playing: false,
    };
    this.onTileClick = this.onTileClick.bind(this);
    this.onBassTileClick = this.onBassTileClick.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.renderColumn = this.renderColumn.bind(this);
    this.playGrid = this.playGrid.bind(this);
    this.createNoteArray = this.createNoteArray.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.stopPlaying = this.stopPlaying.bind(this);
    // this.onTitleChange = this.onTitleChange.bind(this);
    // this.onSliderCallback = this.onSliderCallback.bind(this);
    this.changeFMSynth = this.changeFMSynth.bind(this);
    this.changePluckSynth = this.changePluckSynth.bind(this);
    this.changeAMSynth = this.changeAMSynth.bind(this);
    this.changeMetalSynth = this.changeMetalSynth.bind(this);
    this.changeMonoSynth = this.changeMonoSynth.bind(this);
    this.changeMembraneSynth = this.changeMembraneSynth.bind(this);
    this.glowTiles = this.glowTiles.bind(this);
    this.resumePlaying = this.resumePlaying.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.renderBassRow = this.renderBassRow.bind(this);
  }

  // let intervalID

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
    const bassTempState = [false, false, false, false, false, false, false, false];
    const stateCopy = Object.assign({}, this.state);
    stateCopy.tiles = tempState;
    stateCopy.bassRow = bassTempState;
    this.setState(stateCopy);
    // update the state in redux
    this.props.toggleTile(stateCopy);
  }

  onSliderCallback(newTempo) {
    this.setState({
      tempo: newTempo,
    });
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
    const bassTempState = [false, false, false, false, false, false, false, false];

    const stateCopy = Object.assign({}, this.state);
    stateCopy.tiles = tempState;
    stateCopy.bassRow = bassTempState;
    this.setState(stateCopy);
    // update the state in redux
    this.props.toggleTile(stateCopy);
    this.stopPlaying();
  }

  onSaveClick(e) {
    // save the clicked tiles to server if it's the first save
    this.props.saveMusic(this.state, this.props.mid.history);
  }
  onBassTileClick(event) {
    // console.log('tile clicked');
    // console.log(event);
    // play a note corresponding to the row (defined in ToneTypes) for the duration of an 8th note
    const stateCopy = Object.assign({}, this.state);
    if (!stateCopy.bassRow[event.target.name]) {
      this.state.bass.triggerAttackRelease('C1', '8n');
      // }
      stateCopy.bassRow[event.target.name] = true;
    } else {
      stateCopy.bassRow[event.target.name] = false; // toggling whether tile is checked
    }
    this.setState(stateCopy);
    // noteArray = this.createNoteArray(); // update playback
    if (this.state.playing) {
      console.log('thinks its plkaying');
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
    // update the state in redux at every tile click
    console.log('b4 toggletile');
    this.props.toggleTile(stateCopy);
    console.log('after toggletile');
  }

  onTileClick(event) {
    // console.log('tile clicked');
    // console.log(event);
    // play a note corresponding to the row (defined in ToneTypes) for the duration of an 8th note
    const stateCopy = Object.assign({}, this.state);
    if (!stateCopy.tiles[event.target.name][event.target.title]) {
      // if (event.target.title === NUMROWS - 1) { // if its in the bass row
      //   this.state.bass.triggerAttackRelease('C1', '8n');
      // } else {
      this.state.synth.triggerAttackRelease(ToneTypes[event.target.title], '8n');
      // }
      stateCopy.tiles[event.target.name][event.target.title] = true;
    } else {
      stateCopy.tiles[event.target.name][event.target.title] = false; // toggling whether tile is checked
    }
    this.setState(stateCopy);
    // noteArray = this.createNoteArray(); // update playback
    if (this.state.playing) {
      console.log('thinks its plkaying');
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
    // update the state in redux at every tile click
    this.props.toggleTile(stateCopy);
  }

  stopPlaying() { //eslint-disable-line
    Tone.Transport.stop();
    // part = part.stop();
    const element = document.getElementsByClassName('tileLabel');
    for (let i = 0; i < element.length; i += 1) {
      element[i].classList.remove('glow');
    }
    console.log('stopped tone');
    console.log(Tone.Transport.state);
    this.setState({ playing: false });
    console.log(part.progress);
  }

  changePluckSynth() {
    this.setState({
      synth: new Tone.PluckSynth().toMaster(),
      polySynth: new Tone.PluckSynth().toMaster(),
    });
  }

  changeFMSynth() {
    this.setState({
      synth: new Tone.FMSynth().toMaster(),
      polySynth: new Tone.FMSynth().toMaster(),
    });
  }

  changeAMSynth() {
    this.setState({
      synth: new Tone.AMSynth().toMaster(),
      polySynth: new Tone.AMSynth().toMaster(),
    });
  }

  changeMetalSynth() {
    this.setState({
      synth: new Tone.MetalSynth().toMaster(),
      polySynth: new Tone.MetalSynth().toMaster(),
    });
  }

  changeMembraneSynth() {
    this.setState({
      synth: new Tone.MembraneSynth().toMaster(),
      polySynth: new Tone.MembraneSynth().toMaster(),
    });
  }

  changeMonoSynth() {
    this.setState({
      synth: new Tone.MonoSynth().toMaster(),
      polySynth: new Tone.MonoSynth().toMaster(),
    });
  }

  // only called when a tile is added during playback
  resumePlaying() { // eslint-disable-line
    // part = Tone.Transport.start();
    if (part) {
      part.dispose();
      part = null;
    }
    console.log('in resumeplaying');
    noteArray = this.createNoteArray();
    part = new Tone.Part((time, event) => {
      console.log(time);
      console.log(event);
      // the events will be given to the callback with the time they occur
      this.state.polySynth.triggerAttackRelease(event.note, event.dur, time);
      Tone.Draw.schedule(() => {
        this.glowTiles(event.time.split('*')[0]);
      }, time);
      // console.log('in callback');
    }, noteArray.melody);
    part.start(0);
    part.loop = true;
    part.loopEnd = '2m';
    Tone.Transport.start(Tone.now(), position);
  }


  createNoteArray() {
    const melody = [];
    for (let colIndex = 0; colIndex < NUMCOLS; colIndex += 1) {
      for (let rowIndex = 0; rowIndex < NUMROWS; rowIndex += 1) {
        const note = {};
        if (this.state.tiles[colIndex][rowIndex]) { // if the tile at [col][row] is active
          note.time = `${colIndex}*4n`;
          note.note = `${ToneTypes[rowIndex]}`;
          note.dur = '8n';
          melody.push(note); // add the tile corresponding to rowindex to Array
        }
      }
      const note = {};
      if (this.state.bassRow[colIndex]) { // if the tile at [col][row] is active
        note.time = `${colIndex}*4n`;
        note.note = 'C1';
        note.dur = '8n';
        melody.push(note); // add the tile corresponding to rowindex to Array
      }
    }
    return melody;
  }

  glowTiles(colIndex) { //eslint-disable-line
    const element = document.getElementsByClassName('tileLabel');
    for (let i = 0; i < element.length; i += 1) {
      element[i].classList.remove('glow');
    }
    for (let rowIndex = 0; rowIndex < NUMROWS; rowIndex += 1) {
      if (this.state.tiles[colIndex][rowIndex]) {
        document.getElementById(`label${colIndex}_${rowIndex}`).classList.add('glow');
      }
    }
  }

  playGrid() { //eslint-disable-line
    if (!this.state.playing) {
      if (part) {
        part.dispose();
        part = null;
      }
      this.setState({ playing: true });
      noteArray = this.createNoteArray();
      console.log(noteArray);
      part = new Tone.Part((time, event) => {
        console.log(time);
        console.log(event);
        // the events will be given to the callback with the time they occur
        if (event.note === 'C1') {
          this.state.bass.triggerAttackRelease(event.note, event.dur, time);
        } else {
          this.state.polySynth.triggerAttackRelease(event.note, event.dur, time);
        }
        Tone.Draw.schedule(() => {
          this.glowTiles(event.time.split('*')[0]);
        }, time);
        // console.log('in callback');
      }, noteArray);
      part.start(0);
      part.loop = true;
      part.loopEnd = '2m';
      Tone.Transport.start('+0.1');
      // 0.5026041666666666
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

  renderBassRow() {
    const rowIndex = NUMROWS;
    return this.state.bassRow.map((tile, colIndex) => {
      return (
        <div className="checkbox_and_label">
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" onChange={this.onBassTileClick} checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex} bass`} id={`label${colIndex}_${rowIndex}`} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }

  renderPlayPause() {
    if (this.state.playing) {
      return (
        <button type="button" onClick={this.stopPlaying}>Pause</button>
      );
    } else {
      return (<button type="button" onClick={this.playGrid}>Play</button>);
    }
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
          <div id="melodyGrid">
            {this.renderGrid()}
          </div>
          <div id="bassRow">
            {this.renderBassRow()}
          </div>
          <div className="optionsCol">
            <div>
              <button type="button" onClick={this.playGrid}>Play</button>
              <button type="button" onClick={this.stopPlaying}>Pause</button>
            </div>
            <div className="synthRow">
              <button type="button" onClick={this.changePluckSynth}>Pluck Synth</button>
              <button type="button" onClick={this.changeFMSynth}>FMSynth</button>
              <button type="button" onClick={this.changeAMSynth}>AMSynth</button>
              <button type="button" onClick={this.changeMetalSynth}>Metal Synth</button>
              <button type="button" onClick={this.changeMembraneSynth}>Membrane Synth</button>
              <button type="button" onClick={this.changeMonoSynth}>Mono Synth</button>
            </div>
          </div>
          <TempoSlider currentTempo={this.state.tempo} musicPortionCallback={this.onSliderCallback} />
          {this.renderPlayPause()}
        </div>
      </div>
    );
  }
}

// ADD FOLLOWING LINE TO ADD SLIDER
//

// get access to tiles as tileArray
const mapStateToProps = state => (
  {
    tileArray: state.music.tiles,
  }
);

export default (connect(mapStateToProps, { toggleTile, saveMusic, updateMusic })(MusicPortion));
