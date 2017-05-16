import { connect } from 'react-redux';
import React, { Component } from 'react';
import { addNote } from '../actions';


// import Note from './note';

// eslint-disable-next-line react/prefer-stateless-function
class Column extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      notes: {},
    };
    this.onNoteClick = this.onNoteClick.bind(this);
  }

  onTitleChange(event) {
    this.setState({ title: event.target.value });
  }


  onNoteClick() {
    this.setState({ notes: 1 });
    console.log('in addNoteClick props is');
    console.log(this.props);
    // eslint-disable-next-line no-unused-vars
    // const noteToAdd = <Note id={100} note={noteInfo} />;
    // console.log('printing noteToAdd');
    // console.log(noteToAdd);
    this.props.addNote({ notes: 1 });
  }

  render() {
    return (
      <div id="inputwindow">
        <div id="inputdiv">
          <h1> Notes below here </h1>
          <input type="checkbox" className="note" onClick={this.onNoteClick} />
        </div>
      </div>

    );
  }
}

export default (connect(null, { addNote })(Column));

// export default NoteInput;
