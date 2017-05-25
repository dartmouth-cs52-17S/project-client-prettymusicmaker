import { connect } from 'react-redux';
import React, { Component } from 'react';
import Tone from 'tone';
import Modal from 'react-modal';

//eslint-disable-next-line
import { fetchOneMusic, ToneTypes, toggleTile, saveMusic, updateMusic, NUMROWS, NUMCOLS, NOTELENGTH, DEFAULT_TILE_STATE, DEFAULT_BASS_ROW } from '../actions';
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
class MusicPortion extends Component {
  constructor(props) {
    console.log('in constructor');
    super(props);
    this.state = {
      title: 'Untitled',
      id: this.props.mid.location.pathname.split('/')[2],
      tiles: DEFAULT_TILE_STATE,
      bassRow: DEFAULT_BASS_ROW,
      snareRow: DEFAULT_BASS_ROW,
      kickRow: DEFAULT_BASS_ROW,
      tempo: 120,
      synth: new Tone.Synth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.Synth).toMaster(),
      bass: new Tone.MembraneSynth().toMaster(),
      firstSave: true,
      playing: false,
      modalIsOpen: false,
    };

    if (this.props.mid.location.pathname !== '/editor/') {
      console.log(this);
    }

    this.onTileClick = this.onTileClick.bind(this);
    this.onBassTileClick = this.onBassTileClick.bind(this);
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
    this.renderKickRow = this.renderKickRow.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.dragSelectTile = this.dragSelectTile.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.onUpdateClick = this.onUpdateClick.bind(this);
    this.clearTiles = this.clearTiles.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.soundTest = this.soundTest.bind(this);
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
      });
    }
  }

  onResetClick(e) {
    this.props.fetchOneMusic(this.props.mid.location.pathname.split('/')[2]);
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
    this.setState({ modalIsOpen: false });
    this.clearTiles();
    this.stopPlaying();
  }

  onSaveClick(e) {
    this.props.saveMusic(this.state, this.props.mid.history);
  }
  onBassTileClick(event) {
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
      console.log('thinks its plkaying');
      position = Tone.Transport.position;
      Tone.Transport.stop();
      this.resumePlaying();
    }
    // update the state in redux at every tile click
    this.props.toggleTile(stateCopy);
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
    stateCopy.title = '';
    stateCopy.bassRow = bassTempState;
    stateCopy.snareRow = bassTempState;
    stateCopy.kickRow = bassTempState;
    this.setState(stateCopy);
    // update the state in redux
    this.props.toggleTile(stateCopy);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }
  afterOpenModal() {
  // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
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
      polySynth: new Tone.PolySynth(10, Tone.PluckSynth).toMaster(),
    });
  }

  changeFMSynth() {
    this.setState({
      synth: new Tone.FMSynth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.FMSynth).toMaster(),
    });
  }

  changeAMSynth() {
    this.setState({
      synth: new Tone.AMSynth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.AMSynth).toMaster(),
    });
  }

  changeSynth() {
    this.setState({
      synth: new Tone.Synth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.Synth).toMaster(),
    });
  }

  changeMembraneSynth() {
    this.setState({
      synth: new Tone.MembraneSynth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.MembraneSynth).toMaster(),
    });
  }

  changeDuoSynth() {
    this.setState({
      synth: new Tone.DuoSynth().toMaster(),
      polySynth: new Tone.PolySynth(10, Tone.DuoSynth).toMaster(),
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
      part.loopEnd = '3m';
      Tone.Transport.bpm.value = this.state.tempo;
      Tone.Transport.start('+0.1');
      // 0.5026041666666666
    }
  }

  dragSelectTile(event) { //eslint-disable-line
    console.log(event);
    if (event.buttons) {
      event.target.name = event.target.id.split('_')[0]; //eslint-disable-line
      event.target.title = event.target.id.split('_')[1]; //eslint-disable-line
      this.onTileClick(event);
    }
  }

  soundTest() { //eslint-disable-line
    // const snare = new Tone.NoiseSynth({
    //   volume: -5,
    //   envelope: {
    //     attack: 0.001,
    //     decay: 0.2,
    //     sustain: 0,
    //   },
    //   filterEnvelope: {
    //     attack: 0.001,
    //     decay: 0.1,
    //     sustain: 0,
    //   },
    // }).toMaster();
    // snare.triggerAttackRelease();
    // const drumCompress = new Tone.Compressor({
    //   threshold: -30,
    //   ratio: 6,
    //   attack: 0.3,
    //   release: 0.1,
    // }).toMaster();
    // const distortion = new Tone.Distortion({
    //   distortion: 0.4,
    //   wet: 0.4,
    // });
    // const hats = new Tone.Sampler({ //eslint-disable-line
    //   url: 'src/audio/hh.mp3',
    //   volume: -10,
    //   envelope: {
    //     attack: 0.001,
    //     decay: 0.02,
    //     sustain: 0.01,
    //     release: 0.01,
    //   },
    // }).chain(distortion, drumCompress);
    // hats.triggerAttackRelease(0, '8n');
    const player = new Tone.Player({ //eslint-disable-line
      url: './hh.mp3',
      autostart: true,
    }).toMaster();
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

  /* eslint-disable max-len*/
  // renderBassColumns(wholeCol, colIndex) {
  //   col=wholeCol[]
  //   return col.map((tile, rowIndex) => {
  //     return (
  //       <div className="checkbox_and_label" key={`bass_${colIndex}_${rowIndex}`}>
  //         <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" onChange={this.onTileClick} checked={tile} />
  //         <label className={`tileLabel row${rowIndex} col${colIndex}`} id={`${colIndex}_${rowIndex}`} onMouseOver={this.dragSelectTile} htmlFor={`tile${colIndex}_${rowIndex}`} />
  //       </div>
  //     );
  //   });
  // }
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
    return this.state.bassRow.map((tile, colIndex) => {
      return (
        <div className="checkbox_and_label" key={`snare_${colIndex}_${rowIndex}`}>
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" onChange={this.onBassTileClick} checked={tile} />
          <label className={`tileLabel row${rowIndex} col${colIndex} bass`} id={`${colIndex}_${rowIndex}`} htmlFor={`tile${colIndex}_${rowIndex}`} />
        </div>
      );
    });
  }

  renderKickRow() {
    const rowIndex = NUMROWS + 2;
    return this.state.bassRow.map((tile, colIndex) => {
      return (
        <div className="checkbox_and_label" key={`kick_${colIndex}_${rowIndex}`}>
          <input type="checkbox" id={`tile${colIndex}_${rowIndex}`} title={rowIndex} name={colIndex} className="tileInput" onChange={this.onBassTileClick} checked={tile} />
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
              <div><p>Are you sure you want to reset your music?</p></div>
              <div className="modalButtons">
                <button onClick={this.closeModal}>close</button>
                <button onClick={this.onResetClick}>Yes, reset</button>
              </div>
            </div>
          </Modal>
        );
      } else {
        return (
          <div><button onClick={this.openModal}>Reset</button></div>
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
            <div><p>are you sure you want to clear the editor?</p></div>
            <div className="modalButtons">
              <button onClick={this.closeModal}>cancel</button>
              <button onClick={this.onCancelClick}>yes, clear</button>
            </div>
          </div>
        </Modal>
      );
    } else {
      return (
        <button onClick={this.openModal}>clear</button>
      );
    }
  }

  renderButton() {
    if (this.props.mid.location.pathname !== '/editor') {
      return (
        <button onClick={this.onUpdateClick}>Update</button>
      );
    } else {
      return (
        <button onClick={this.onSaveClick}>Save</button>
      );
    }
  }


  render() {
    return (
      <div>
        <Nav stop={this.stopPlaying} />
        <div className="saveBar">
          <input id="title" onChange={this.onTitleChange} value={this.state.title} placeholder={this.state.title} />
          <button onClick={this.onSaveClick}>save</button>
          {this.renderModal()}
          {this.renderPlayPause()}
          {/* <button onClick={this.soundTest}>sound test</button> */}
        </div>
        <div id="songheader">song name</div>
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
              {this.renderKickRow()}
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
