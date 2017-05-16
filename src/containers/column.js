import { connect } from 'react-redux';
import React, { Component } from 'react';
import { addTile } from '../actions';


// import Note from './note';

// eslint-disable-next-line react/prefer-stateless-function
class Column extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    console.log('in constructor');
    super(props);
    this.state = {
      notes: {},
    };
    this.onTileClick = this.onTileClick.bind(this);
  }

  onTileClick() {
    this.setState({ notes: event.target.value });
    console.log('in addNoteClick props is');
    console.log(this.props);
    console.log('e.t.v is :');
    console.log(event.target.value);
    // eslint-disable-next-line no-unused-vars
    // const noteToAdd = <Note id={100} note={noteInfo} />;
    // console.log('printing noteToAdd');
    // console.log(noteToAdd);
    this.props.addTile({ notes: 1 });
  }

  render() {
    return (
      <div id="inputwindow">
        <div id="inputdiv">
          <h1> Notes below here </h1>
          <input type="checkbox" className="tile" onClick={this.onTileClick} />
        </div>
      </div>

    );
  }
}

export default (connect(null, { addTile })(Column));

// export default NoteInput;
