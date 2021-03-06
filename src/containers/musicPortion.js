import { connect } from 'react-redux';
import React, { Component } from 'react';
import Tone from 'tone';
import Modal from 'react-modal';

//eslint-disable-next-line
import { fetchOneMusic, ToneTypes, toggleTile, saveMusic, updateMusic, NUMROWS, NUMCOLS, NOTELENGTH, DEFAULT_TILE_STATE, DEFAULT_BASS_ROW, DEFAULT_SNARE_ROW, DEFAULT_HH_ROW  } from '../actions';
import Nav from '../components/nav';
import TempoSlider from '../components/tempoSlider';
import Splash from '../components/splash';

let intervalID = null; //eslint-disable-line
let noteArray = [];
let part = null;
let position = null;
const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0,.6)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    border: 'none',
    outline: 'none',
  },
};
const drumCompress = new Tone.Compressor({
  threshold: -30,
  ratio: 6,
  attack: 0.3,
  release: 0.1,
}).toMaster();
const distortion = new Tone.Distortion({
  distortion: 0.4,
  wet: 0.4,
});
const hats = new Tone.Sampler({ //eslint-disable-line
  url: '/audio/hh.mp3',
  volume: -10,
  envelope: {
    attack: 0.001,
    decay: 0.02,
    sustain: 0.01,
    release: 0.01,
  },
}).chain(distortion, drumCompress);
const hh = new Tone.Sampler({ //eslint-disable-line
  url: '/audio/hh.mp3',
  volume: -10,
}).toMaster();

const kick = new Tone.Sampler({ //eslint-disable-line
  url: '/audio/kick.mp3',
  volume: -10,
}).toMaster();

const snare = new Tone.Sampler({ //eslint-disable-line
  url: '/audio/snare.mp3',
  volume: -10,
}).toMaster();


class MusicPortion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Untitled song',
      id: this.props.mid.location.pathname.split('/')[2],
      tiles: DEFAULT_TILE_STATE,
      bassRow: DEFAULT_BASS_ROW,
      snareRow: DEFAULT_SNARE_ROW,
      hhRow: DEFAULT_HH_ROW,
      synthID: 0,
      tempo: 210,
      synth: new Tone.Synth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.Synth).toMaster(),
      bass: new Tone.MembraneSynth().toMaster(),
      snare: new Tone.Sampler({ //eslint-disable-line
        url: '/audio/snare.mp3',
      }).toMaster(),
      hh: new Tone.Sampler({ //eslint-disable-line
        url: '/audio/hho.mp3',
      }).toMaster(),
      firstSave: true,
      playing: false,
      modalIsOpen: false,
      signinModalIsOpen: false,
    };

    this.onTileClick = this.onTileClick.bind(this);
    this.onBassTileClick = this.onBassTileClick.bind(this);
    this.onSnareTileClick = this.onSnareTileClick.bind(this);
    this.onHHTileClick = this.onHHTileClick.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.renderColumn = this.renderColumn.bind(this);
    this.playGrid = this.playGrid.bind(this);
    this.createNoteArray = this.createNoteArray.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.stopPlaying = this.stopPlaying.bind(this);
    this.onSliderCallback = this.onSliderCallback.bind(this);
    this.changeFMSynth = this.changeFMSynth.bind(this);
    this.changePluckSynth = this.changePluckSynth.bind(this);
    this.changeAMSynth = this.changeAMSynth.bind(this);
    this.changeSynth = this.changeSynth.bind(this);
    this.changeDuoSynth = this.changeDuoSynth.bind(this);
    this.changeMembraneSynth = this.changeMembraneSynth.bind(this);
    this.glowTiles = this.glowTiles.bind(this);
    this.resumePlaying = this.resumePlaying.bind(this);
    this.renderPlayPause = this.renderPlayPause.bind(this);
    this.renderBassRow = this.renderBassRow.bind(this);
    this.renderSnareRow = this.renderSnareRow.bind(this);
    this.renderHHRow = this.renderHHRow.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.dragSelectTile = this.dragSelectTile.bind(this);
    this.clickSelectFirstTile = this.clickSelectFirstTile.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.onUpdateClick = this.onUpdateClick.bind(this);
    this.clearTiles = this.clearTiles.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.renderSaveBar = this.renderSaveBar.bind(this);
    this.openSigninModal = this.openSigninModal.bind(this);
    this.closeSigninModal = this.closeSigninModal.bind(this);
    this.renderSigninModal = this.renderSigninModal.bind(this);
    this.togglePlaying = this.togglePlaying.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  componentWillMount() {
    if (this.props.mid.location.pathname !== '/editor') {
      this.props.fetchOneMusic(this.props.mid.location.pathname.split('/')[2]);
    } else {
      this.clearTiles();
    }
  }

  // get the props immediately
  componentWillReceiveProps(nextprops) {
    if (nextprops.oneMusic) {
      this.setState({
        title: nextprops.oneMusic.title,
        tiles: nextprops.oneMusic.music,
        bassRow: nextprops.oneMusic.bass,
        snareRow: nextprops.oneMusic.snare,
        hhRow: nextprops.oneMusic.hh,
      });
    }
  }

  onResetClick(e) {
    // stop and restart the music
    this.stopPlaying();
    this.props.fetchOneMusic(this.props.mid.location.pathname.split('/')[2]);
    this.closeModal();
  }

  onUpdateClick(e) {
    this.props.updateMusic(this.state.id, this.state, this.props.history);
  }

  onSliderCallback(newTempo) { //eslint-disable-line
    Tone.Transport.bpm.value = newTempo;
    this.setState({ tempo: newTempo });
  }

  onTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  // reset the notes to false when cancel is clicked
  onCancelClick(e) {
    this.clearTiles();
    this.stopPlaying();
    this.closeModal();
  }

  onSaveClick(e) {
    this.props.saveMusic(this.state, this.props.mid.history);
    this.stopPlaying();
  }

  onBassTileClick(event) {
    // play a note corresponding to the row (defined in ToneTypes) for the duration of an 8th note
    const stateCopy = Object.assign({}, this.state);
    if (!stateCopy.bassRow[event.target.name]) {
      this.state.bass.triggerAttackRelease('C1', '8n');
      stateCopy.bassRow[event.target.name] = true;
    } else {
      stateCopy.bassRow[event.target.name] = false; // toggling whether tile is checked
    }
    this.setState(stateCopy);
    // noteArray = this.createNoteArray(); // update playback
    if (this.state.playing) {
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
    // update the state in redux at every tile click
    this.props.toggleTile(stateCopy);
  }

  onSnareTileClick(event) {
    // play a note corresponding to the row (defined in ToneTypes) for the duration of an 8th note
    const stateCopy = Object.assign({}, this.state);
    if (!stateCopy.snareRow[event.target.name]) {
      this.state.snare.triggerAttackRelease(0, '8n');
      stateCopy.snareRow[event.target.name] = true;
    } else {
      stateCopy.snareRow[event.target.name] = false; // toggling whether tile is checked
    }
    this.setState(stateCopy);
    // noteArray = this.createNoteArray(); // update playback
    if (this.state.playing) {
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
    // update the state in redux at every tile click
    this.props.toggleTile(stateCopy);
  }

  onHHTileClick(event) {
    // play a note corresponding to the row (defined in ToneTypes) for the duration of an 8th note
    const stateCopy = Object.assign({}, this.state);
    if (!stateCopy.hhRow[event.target.name]) {
      this.state.hh.triggerAttackRelease(0, '8n');
      stateCopy.hhRow[event.target.name] = true;
    } else {
      stateCopy.hhRow[event.target.name] = false; // toggling whether tile is checked
    }
    this.setState(stateCopy);
    // noteArray = this.createNoteArray(); // update playback
    if (this.state.playing) {
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
    // update the state in redux at every tile click
    this.props.toggleTile(stateCopy);
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
    // noteArray = this.createNoteArray(); // update playback
    if (this.state.playing) {
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
    // update the state in redux at every tile click
    this.props.toggleTile(stateCopy);
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }


  clearTiles() {
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
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false],
    ];
    const bassTempState = [false, false, false, false, false, false, false, false, false, false, false, false];
    const stateCopy = Object.assign({}, this.state);
    stateCopy.tiles = tempState;
    stateCopy.title = 'Untitled song';
    stateCopy.bassRow = [...bassTempState];
    stateCopy.snareRow = [...bassTempState];
    stateCopy.hhRow = [...bassTempState];
    this.setState(stateCopy);
    // update the state in redux
    this.props.toggleTile(stateCopy);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  openSigninModal() {
    this.setState({ signinModalIsOpen: true });
  }

  closeSigninModal() {
    this.setState({ signinModalIsOpen: false });
  }

  stopPlaying() { //eslint-disable-line
    Tone.Transport.stop();
    this.setState({ playing: false });
    setTimeout(() => {
      const element = document.getElementsByClassName('tileLabel');
      for (let i = 0; i < element.length; i += 1) {
        element[i].classList.remove('glow');
      }
    }, 200);
  }

  // only for use during intialization of previously created song
  initializeSynthAndBpm(synthID, bpm) {
    this.setState({ tempo: bpm });
    switch (synthID) { // eslint-disable-line
      case 0:
        this.changeSynth();
        break;
      case 1:
        this.changePluckSynth();
        break;
      case 2:
        this.changeFMSynth();
        break;
      case 3:
        this.changeAMSynth();
        break;
      case 4:
        this.changeMembraneSynth();
        break;
      case 5:
        this.changeDuoSynth();
        break;
    }
  }

  changePluckSynth() {
    this.state.synth.dispose();
    this.state.polySynth.dispose();
    // play a note corresponding to the row (defined in ToneTypes) for the duration of an 8th note
    const stateCopy = Object.assign({}, this.state);
    stateCopy.synth = new Tone.PluckSynth().toMaster();
    stateCopy.polySynth = new Tone.PolySynth(10, Tone.PluckSynth).toMaster();
    stateCopy.synthID = 1;
    this.setState(stateCopy);
    if (this.state.playing) {
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
  }

  changeFMSynth() {
    this.state.synth.dispose();
    this.state.polySynth.dispose();
    const stateCopy = Object.assign({}, this.state);
    stateCopy.synth = new Tone.FMSynth().toMaster();
    stateCopy.polySynth = new Tone.PolySynth(10, Tone.FMSynth).toMaster();
    stateCopy.synthID = 2;
    this.setState(stateCopy);
    if (this.state.playing) {
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
  }

  changeAMSynth() {
    this.state.synth.dispose();
    this.state.polySynth.dispose();
    const stateCopy = Object.assign({}, this.state);
    stateCopy.synth = new Tone.AMSynth().toMaster();
    stateCopy.polySynth = new Tone.PolySynth(10, Tone.AMSynth).toMaster();
    stateCopy.synthID = 3;
    this.setState(stateCopy);
    if (this.state.playing) {
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
  }

  changeSynth() {
    this.state.synth.dispose();
    this.state.polySynth.dispose();
    const stateCopy = Object.assign({}, this.state);
    stateCopy.synth = new Tone.Synth().toMaster();
    stateCopy.polySynth = new Tone.PolySynth(10, Tone.Synth).toMaster();
    stateCopy.synthID = 0;
    this.setState(stateCopy);
    if (this.state.playing) {
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
  }

  changeMembraneSynth() {
    this.state.synth.dispose();
    this.state.polySynth.dispose();
    const stateCopy = Object.assign({}, this.state);
    stateCopy.synth = new Tone.MembraneSynth().toMaster();
    stateCopy.polySynth = new Tone.PolySynth(10, Tone.MembraneSynth).toMaster();
    stateCopy.synthID = 4;
    this.setState(stateCopy);
    if (this.state.playing) {
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
  }

  changeDuoSynth() {
    this.state.synth.dispose();
    this.state.polySynth.dispose();
    const stateCopy = Object.assign({}, this.state);
    stateCopy.synth = new Tone.DuoSynth().toMaster();
    stateCopy.polySynth = new Tone.PolySynth(10, Tone.DuoSynth).toMaster();
    stateCopy.synthID = 5;
    this.setState(stateCopy);
    if (this.state.playing) {
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
  }

  togglePlaying(event) {
    if (event.key == 'Space') { //eslint-disable-line
      if (this.state.playing) {
        this.stopPlaying();
      } else {
        this.playGrid();
      }
    }
  }

  // only called when a tile is added during playback
  resumePlaying() { // eslint-disable-line
    if (part) {
      part.dispose();
      part = null;
    }
    noteArray = this.createNoteArray();
    part = new Tone.Part((time, event) => {
      // the events will be given to the callback with the time they occur
      if (event.note === 'C1') {
        // this.state.bass.triggerAttackRelease(event.note, event.dur, time);
        this.state.bass.triggerAttackRelease('C1', '8n', time);
      } else if (event.note === 'D1') {
        this.state.snare.triggerAttackRelease(0, '8n', time);
      } else if (event.note === 'E1') {
        this.state.hh.triggerAttackRelease(0, '8n', time);
      } else if (event.note === 'F1') { // trigger hh
        // do nothing
      } else {
        this.state.polySynth.triggerAttackRelease(event.note, event.dur, time);
      }
      Tone.Draw.schedule(() => {
        this.glowTiles(event.time.split('*')[0]);
      }, time);
    }, noteArray);
    part.start(0);
    part.loop = true;
    part.loopEnd = '3m';
    Tone.Transport.bpm.value = this.state.tempo;
    Tone.Transport.start(Tone.now(), position);
  }

  createNoteArray() {
    const melody = [];
    for (let colIndex = 0; colIndex < NUMCOLS; colIndex += 1) {
      let noteAdded = false;
      for (let rowIndex = 0; rowIndex < NUMROWS; rowIndex += 1) {
        if (this.state.tiles[colIndex][rowIndex]) { // if the tile at [col][row] is active
          const note = {};
          note.time = `${colIndex}*4n`;
          note.note = `${ToneTypes[rowIndex]}`;
          note.dur = '8n';
          melody.push(note); // add the tile corresponding to rowindex to Array
          noteAdded = true;
        }
      }
      if (this.state.bassRow[colIndex]) { // if the tile at [col][row] is active
        const bassNote = {};
        bassNote.time = `${colIndex}*4n`;
        bassNote.note = 'C1';
        bassNote.dur = '8n';
        melody.push(bassNote); // add the tile corresponding to rowindex to Array
        noteAdded = true;
      }
      if (this.state.snareRow[colIndex]) { // if the tile at [col][row] is active
        const snareNote = {};
        snareNote.time = `${colIndex}*4n`;
        snareNote.note = 'D1';
        snareNote.dur = '8n';
        melody.push(snareNote); // add the tile corresponding to rowindex to Array
        noteAdded = true;
      }
      if (this.state.hhRow[colIndex]) { // if the tile at [col][row] is active
        const hhNote = {};
        hhNote.time = `${colIndex}*4n`;
        hhNote.note = 'E1';
        hhNote.dur = '8n';
        melody.push(hhNote); // add the tile corresponding to rowindex to Array
        noteAdded = true;
      }
      if (!noteAdded) {
        const emptyNote = {};
        emptyNote.time = `${colIndex}*4n`;
        emptyNote.note = 'F1';
        emptyNote.dur = '8n';
        melody.push(emptyNote);
      }
    }
    return melody;
  }

  glowTiles(colIndex) { //eslint-disable-line
    const element = document.getElementsByClassName('tileLabel');
    for (let i = 0; i < element.length; i += 1) {
      element[i].classList.remove('glow');
    }
    for (let rowIndex = 0; rowIndex < NUMROWS + 3; rowIndex += 1) {
      if (document.getElementById(`${colIndex}_${rowIndex}`) && rowIndex < NUMROWS && this.state.tiles[colIndex][rowIndex]) {
        document.getElementById(`${colIndex}_${rowIndex}`).classList.add('glow');
      } else if (document.getElementById(`${colIndex}_${rowIndex}`) && rowIndex === NUMROWS && this.state.bassRow[colIndex]) {
        document.getElementById(`${colIndex}_${rowIndex}`).classList.add('glow');
      } else if (document.getElementById(`${colIndex}_${rowIndex}`) && rowIndex === NUMROWS + 1 && this.state.snareRow[colIndex]) {
        document.getElementById(`${colIndex}_${rowIndex}`).classList.add('glow');
      } else if (document.getElementById(`${colIndex}_${rowIndex}`) && rowIndex === NUMROWS + 2 && this.state.hhRow[colIndex]) {
        document.getElementById(`${colIndex}_${rowIndex}`).classList.add('glow');
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
      part = new Tone.Part((time, event) => {
        // the events will be given to the callback with the time they occur
        if (event.note === 'C1') { // trigger bass
          this.state.bass.triggerAttackRelease('C1', '8n', time);
        } else if (event.note === 'D1') { // trigger snare
          this.state.snare.triggerAttackRelease(0, '8n', time);
        } else if (event.note === 'E1') { // trigger hh
          this.state.hh.triggerAttackRelease(0, '8n', time);
        } else if (event.note === 'F1') { // trigger hh
          // do nothing
        } else {
          this.state.polySynth.triggerAttackRelease(event.note, event.dur, time);
        }
        Tone.Draw.schedule(() => {
          this.glowTiles(event.time.split('*')[0]);
        }, time);
      }, noteArray);
      part.start(0);
      part.loop = true;
      part.loopEnd = '3m';
      Tone.Transport.bpm.value = this.state.tempo;
      Tone.Transport.start('+0.1');
    }
  }

  dragSelectTile(event) { //eslint-disable-line
    if (event.buttons) {
      const row = event.target.id.split('_')[1];
      event.target.name = event.target.id.split('_')[0]; //eslint-disable-line
      event.target.title = row; //eslint-disable-line
      /* eslint-disable eqeqeq */
      if (row < NUMROWS) { this.onTileClick(event); }
      if (row == NUMROWS) { this.onBassTileClick(event); }
      if (row == NUMROWS + 1) { this.onSnareTileClick(event); }
      if (row == NUMROWS + 2) { this.onHHTileClick(event); }
      /* eslint-enable eqeqeq */
    }
  }

  clickSelectFirstTile(event) {
    const row = event.target.id.split('_')[1];
    // col
    event.target.name = event.target.id.split('_')[0]; // eslint-disable-line
    // row
    event.target.title = row; //eslint-disable-line
    /* eslint-disable eqeqeq */
    if (row < NUMROWS) { this.onTileClick(event); }
    if (row == NUMROWS) { this.onBassTileClick(event); }
    if (row == NUMROWS + 1) { this.onSnareTileClick(event); }
    if (row == NUMROWS + 2) { this.onHHTileClick(event); }
    /* eslint-enable eqeqeq */
  }

  renderGrid() {
    if (!this.props.oneMusic && !this.props.tileArray) {
      return <div>Loading Music...</div>;
    } else if (this.props.oneMusic) {
      return this.props.oneMusic.music.map((col, colIndex) => {
        return (
          <div className="column" key={`col_${colIndex}`}>
            {this.renderColumn(col, colIndex)}
          </div>
        );
      });
    }
    return this.state.tiles.map((col, colIndex) => {
      return (
        <div className="column" key={`grid_${colIndex}`}>
          {this.renderColumn(col, colIndex)}
        </div>
      );
    });
  }

/* eslint-disable max-len */
  renderColumn(col, colIndex) {
    return col.map((tile, rowIndex) => {
      return (
        <div className="checkbox_and_label" key={`col_${colIndex}_${rowIndex}`}>
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex}`} id={`${colIndex}_${rowIndex}`} onMouseDown={this.clickSelectFirstTile} onMouseOver={this.dragSelectTile} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }

  renderBassRow() {
    const rowIndex = NUMROWS;
    return this.state.bassRow.map((tile, colIndex) => {
      return (
        <div className="checkbox_and_label" key={`bass_${colIndex}_${rowIndex}`}>
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex} bass`} id={`${colIndex}_${rowIndex}`} onMouseDown={this.clickSelectFirstTile} onMouseOver={this.dragSelectTile} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }

  renderSnareRow() {
    const rowIndex = NUMROWS + 1;
    return this.state.snareRow.map((tile, colIndex) => {
      return (
        <div className="checkbox_and_label" key={`snare_${colIndex}_${rowIndex}`}>
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex} bass`} id={`${colIndex}_${rowIndex}`} onMouseDown={this.clickSelectFirstTile} onMouseOver={this.dragSelectTile} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }

  renderHHRow() {
    const rowIndex = NUMROWS + 2;
    return this.state.hhRow.map((tile, colIndex) => {
      return (
        <div className="checkbox_and_label" key={`hh_${colIndex}_${rowIndex}`}>
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex} bass`} id={`${colIndex}_${rowIndex}`} onMouseDown={this.clickSelectFirstTile} onMouseOver={this.dragSelectTile} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }
  /* eslint-enable */

  renderPlayPause() {
    if (this.state.playing) {
      return (
        <div id="play"><i className="fa fa-stop" aria-hidden="true" type="button" onClick={this.stopPlaying} onKeyPress={this.togglePlaying} /></div>
      );
    } else {
      return (
        <div id="play"><i className="fa fa-play" aria-hidden="true" type="button" onClick={this.playGrid} onKeyPress={this.togglePlaying} /></div>
      );
    }
  }

  renderModal() {
    if (this.props.mid.location.pathname !== '/editor') {
      if (this.state.modalIsOpen) {
        return (
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Cancel"
          >
            <div className="modalContent">
              <div><p>are you sure you want to revert to your original music?</p></div>
              <div className="modalButtons">
                <button onClick={this.closeModal}>close</button>
                <button onClick={this.onResetClick}>yes</button>
              </div>
            </div>
          </Modal>
        );
      } else {
        return (
          <span />
        );
      }
    } else if (this.state.modalIsOpen) {
      return (
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Cancel"
        >
          <div className="modalContent">
            <div><p>are you sure you want to clear your tiles?</p></div>
            <div className="modalButtons">
              <button onClick={this.closeModal}>close</button>
              <button onClick={this.onCancelClick}>yes</button>
            </div>
          </div>
        </Modal>
      );
    } else {
      return (
        <span />
      );
    }
  }

  renderButton() {
    if (this.props.mid.location.pathname !== '/editor') {
      return (
        <button onClick={this.onUpdateClick}>update</button>
      );
    } else {
      return (
        <button onClick={this.onSaveClick}>save</button>
      );
    }
  }
/* eslint-disable jsx-a11y/no-static-element-interactions */
  renderSaveBar() {
    if (this.props.authenticated) {
      return (
        <div className="saveBar">
          <input id="title" onChange={this.onTitleChange} value={this.state.title} />
          {this.renderButton()}
          <button onClick={this.openModal}>revert</button>
          {this.renderModal()}
          {this.renderPlayPause()}
        </div>
      );
    } else {
      return (
        <div className="saveBar">
          {this.state.title}
          {this.renderSigninModal()}
          {this.renderPlayPause()}<div id="guestsave">Want to save changes? <span id="guestsignin" onClick={this.openSigninModal}>Sign in</span></div>
        </div>
      );
    }
  }
/* eslint-enable */

  renderSigninModal() {
    if (this.state.signinModalIsOpen) {
      return (
        <Modal
          isOpen={this.state.signinModalIsOpen}
          onRequestClose={this.closeSigninModal}
          style={customStyles}
          contentLabel="Cancel"
        >
          <Splash />
        </Modal>
      );
    } else {
      return (
        <span />
      );
    }
  }

  /* eslint-disable jsx-a11y/no-static-element-interactions */
  render() {
    return (
      <div>
        <Nav stop={this.stopPlaying} clear={this.clearTiles} />
        {this.renderSaveBar()}
        <div className="grid">
          <div id="melodyGrid">
            <div className="melodyGridLR" id="synthCol">
              <input type="radio" name="synthToggle" id="synthButton" onClick={this.changeSynth} defaultChecked />
              <label className="synthLabel" htmlFor="synthButton" >classic</label>
              <input type="radio" name="synthToggle" id="pluckSynthButton" onClick={this.changePluckSynth} />
              <label className="synthLabel" htmlFor="pluckSynthButton" >pluck</label>
              <input type="radio" name="synthToggle" id="FMSynthButton" onClick={this.changeFMSynth} />
              <label className="synthLabel" htmlFor="FMSynthButton" >FM</label>
              <input type="radio" name="synthToggle" id="AMSynthButton" onClick={this.changeAMSynth} />
              <label className="synthLabel" htmlFor="AMSynthButton" >AM</label>
              <input type="radio" name="synthToggle" id="membraneSynthButton" onClick={this.changeMembraneSynth} />
              <label className="synthLabel" htmlFor="membraneSynthButton" >membrane</label>
              <input type="radio" name="synthToggle" id="duoSynthButton" onClick={this.changeDuoSynth} />
              <label className="synthLabel" htmlFor="duoSynthButton" >duo</label>
            </div>
            {this.renderGrid()}
            <div className="melodyGridLR">
              <TempoSlider currentTempo={this.state.tempo} min={60} max={400} musicPortionCallback={this.onSliderCallback} />
            </div>
          </div>
          <div id="baseSection">
            <div className="bassRow">
              {this.renderBassRow()}
            </div>
            <div className="bassRow">
              {this.renderSnareRow()}
            </div>
            <div className="bassRow">
              {this.renderHHRow()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// get access to tiles as tileArray
const mapStateToProps = state => (
  {
    tileArray: state.music.tiles,
    oneMusic: state.music.oneMusic,
    authenticated: state.auth.authenticated,
  }
);

export default connect(mapStateToProps, { fetchOneMusic, toggleTile, saveMusic, updateMusic })(MusicPortion);
