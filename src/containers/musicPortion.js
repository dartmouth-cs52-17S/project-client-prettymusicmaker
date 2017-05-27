import { connect } from 'react-redux';
import React, { Component } from 'react';
import Tone from 'tone';
import Modal from 'react-modal';

//eslint-disable-next-line
import { fetchOneMusic, ToneTypes, toggleTile, saveMusic, updateMusic, NUMROWS, NUMCOLS, NOTELENGTH, DEFAULT_TILE_STATE, DEFAULT_BASS_ROW, DEFAULT_SNARE_ROW, DEFAULT_HH_ROW  } from '../actions';
import Nav from '../components/nav';
import TempoSlider from '../components/tempoSlider';

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
    backgroundColor: 'rgba(255, 255, 255,0)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    border: '2px solid #0c1e1f',
    borderRadius: '6px',
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
      tempo: 120,
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
    };

    if (this.props.mid.location.pathname !== '/editor/') {
      console.log(this);
    }

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
    this.onResetClick = this.onResetClick.bind(this);
    this.onUpdateClick = this.onUpdateClick.bind(this);
    this.clearTiles = this.clearTiles.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.renderSaveBar = this.renderSaveBar.bind(this);

    console.log(this.state.title);
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
    setTimeout(() => { this.playGrid(); }, 100);
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
    console.log('bass tile clicked');
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
      // }
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
      // }
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

  clearTiles() {
    // reset the clicked tiles
    console.log('CLEAR CALLDE');
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

  stopPlaying() { //eslint-disable-line
    Tone.Transport.stop();
    const element = document.getElementsByClassName('tileLabel');
    for (let i = 0; i < element.length; i += 1) {
      element[i].classList.remove('glow');
    }
    console.log('stopped tone');
    console.log(Tone.Transport.state);
    this.setState({ playing: false });
  }

  changePluckSynth() {
    this.stopPlaying();
    this.setState({
      synth: new Tone.PluckSynth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.PluckSynth).toMaster(),
    });
    setTimeout(() => { this.playGrid(); }, 100);
  }

  changeFMSynth() {
    this.stopPlaying();
    this.setState({
      synth: new Tone.FMSynth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.FMSynth).toMaster(),
    });
    setTimeout(() => { this.playGrid(); }, 100);
  }

  changeAMSynth() {
    this.stopPlaying();
    this.setState({
      synth: new Tone.AMSynth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.AMSynth).toMaster(),
    });
    setTimeout(() => { this.playGrid(); }, 100);
  }

  changeSynth() {
    this.stopPlaying();
    this.setState({
      synth: new Tone.Synth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.Synth).toMaster(),
    });
    setTimeout(() => { this.playGrid(); }, 100);
  }

  changeMembraneSynth() {
    this.stopPlaying();
    this.setState({
      synth: new Tone.MembraneSynth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.MembraneSynth).toMaster(),
    });
    setTimeout(() => { this.playGrid(); }, 100);
  }

  changeDuoSynth() {
    this.stopPlaying();
    this.setState({
      synth: new Tone.DuoSynth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.DuoSynth).toMaster(),
    });
    setTimeout(() => { this.playGrid(); }, 100);
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
    part.loopEnd = '3m';
    Tone.Transport.bpm.value = this.state.tempo;
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
      const bassNote = {};
      if (this.state.bassRow[colIndex]) { // if the tile at [col][row] is active
        bassNote.time = `${colIndex}*4n`;
        bassNote.note = 'C1';
        bassNote.dur = '8n';
        melody.push(bassNote); // add the tile corresponding to rowindex to Array
      }
      const snareNote = {};
      if (this.state.snareRow[colIndex]) { // if the tile at [col][row] is active
        snareNote.time = `${colIndex}*4n`;
        snareNote.note = 'D1';
        snareNote.dur = '8n';
        melody.push(snareNote); // add the tile corresponding to rowindex to Array
      }
      const hhNote = {};
      if (this.state.hhRow[colIndex]) { // if the tile at [col][row] is active
        hhNote.time = `${colIndex}*4n`;
        hhNote.note = 'E1';
        hhNote.dur = '8n';
        melody.push(hhNote); // add the tile corresponding to rowindex to Array
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
      if (rowIndex < NUMROWS && this.state.tiles[colIndex][rowIndex]) {
        document.getElementById(`${colIndex}_${rowIndex}`).classList.add('glow');
        console.log('added glow');
      } else if (rowIndex === NUMROWS && this.state.bassRow[colIndex]) {
        document.getElementById(`${colIndex}_${rowIndex}`).classList.add('glow');
        console.log('added glow');
      } else if (rowIndex === NUMROWS + 1 && this.state.snareRow[colIndex]) {
        document.getElementById(`${colIndex}_${rowIndex}`).classList.add('glow');
        console.log('added glow');
      } else if (rowIndex === NUMROWS + 2 && this.state.hhRow[colIndex]) {
        document.getElementById(`${colIndex}_${rowIndex}`).classList.add('glow');
        console.log('added glow');
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
      console.log('notearray');
      console.log(noteArray);
      part = new Tone.Part((time, event) => {
        // the events will be given to the callback with the time they occur
        if (event.note === 'C1') {
          // this.state.bass.triggerAttackRelease(event.note, event.dur, time);
          this.state.bass.triggerAttackRelease('C1', '8n', time);
        } else if (event.note === 'D1') {
          this.state.snare.triggerAttackRelease(0, '8n', time);
        } else if (event.note === 'E1') {
          this.state.hh.triggerAttackRelease(0, '8n', time);
        } else {
          this.state.polySynth.triggerAttackRelease(event.note, event.dur, time);
        }
        console.log('colindex is');
        console.log(event.time.split('*')[0]);
        Tone.Draw.schedule(() => {
          this.glowTiles(event.time.split('*')[0]);
        }, time);
        // console.log('in callback');
      }, noteArray);
      part.start(0);
      part.loop = true;
      part.loopEnd = '3m';
      Tone.Transport.bpm.value = this.state.tempo;
      Tone.Transport.start('+0.1');
    }
  }

  dragSelectTile(event) { //eslint-disable-line
    // console.log(event);
    if (event.buttons) {
      event.target.name = event.target.id.split('_')[0]; //eslint-disable-line
      event.target.title = event.target.id.split('_')[1]; //eslint-disable-line
      this.onTileClick(event);
    }
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

/* eslint-disable max-len*/
  renderColumn(col, colIndex) {
    return col.map((tile, rowIndex) => {
      return (
        <div className="checkbox_and_label" key={`col_${colIndex}_${rowIndex}`}>
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" onChange={this.onTileClick} checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex}`} id={`${colIndex}_${rowIndex}`} onMouseOver={this.dragSelectTile} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }
  /* eslint-enable*/


  renderBassRow() {
    const rowIndex = NUMROWS;
    return this.state.bassRow.map((tile, colIndex) => {
      return (
        <div className="checkbox_and_label" key={`bass_${colIndex}_${rowIndex}`}>
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" onChange={this.onBassTileClick} checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex} bass`} id={`${colIndex}_${rowIndex}`} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }

  renderSnareRow() {
    const rowIndex = NUMROWS + 1;
    return this.state.snareRow.map((tile, colIndex) => {
      return (
        <div className="checkbox_and_label" key={`snare_${colIndex}_${rowIndex}`}>
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" onChange={this.onSnareTileClick} checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex} bass`} id={`${colIndex}_${rowIndex}`} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }

  renderHHRow() {
    const rowIndex = NUMROWS + 2;
    return this.state.hhRow.map((tile, colIndex) => {
      return (
        <div className="checkbox_and_label" key={`hh_${colIndex}_${rowIndex}`}>
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" onChange={this.onHHTileClick} checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex} bass`} id={`${colIndex}_${rowIndex}`} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }

  renderPlayPause() {
    if (this.state.playing) {
      return (
        <div id="play"><i className="fa fa-pause" aria-hidden="true" type="button" onClick={this.stopPlaying} /></div>
      );
    } else {
      return (
        <div id="play"><i className="fa fa-play" aria-hidden="true" type="button" onClick={this.playGrid} /></div>
      );
    }
  }

  renderModal() {
    if (this.props.mid.location.pathname !== '/editor') {
      if (this.state.modalIsOpen) {
        return (
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
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
          onAfterOpen={this.afterOpenModal}
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

  renderSaveBar() {
    // if (this.props.authenticated) {
    if (this.props.mid.location.pathname !== '/editor') {
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
          <input id="title" onChange={this.onTitleChange} value={this.state.title} />
          {this.renderButton()}
          <button onClick={this.openModal}>clear</button>
          {this.renderModal()}
          {this.renderPlayPause()}
        </div>
      );
    }
  }

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
  }
);

export default connect(mapStateToProps, { fetchOneMusic, toggleTile, saveMusic, updateMusic })(MusicPortion);
