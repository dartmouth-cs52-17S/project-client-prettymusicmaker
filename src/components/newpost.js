import { connect } from 'react-redux';
import React, { Component } from 'react';
import { createPost } from '../actions';


// import Note from './note';

// eslint-disable-next-line react/prefer-stateless-function
class NoteInput extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      tags: '',
      content: '',
      cover_url: '',
    };
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onTagChange = this.onTagChange.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.onCoverUrlChange = this.onCoverUrlChange.bind(this);
    this.addPostClick = this.addPostClick.bind(this);
  }

  onTitleChange(event) {
    this.setState({ title: event.target.value });
  }
  onTagChange(event) {
    this.setState({ tags: event.target.value });
  }
  onContentChange(event) {
    this.setState({ content: event.target.value });
  }
  onCoverUrlChange(event) {
    this.setState({ cover_url: event.target.value });
  }

  addPostClick() {
    const noteInfo = {
      title: this.state.title,
      tags: this.state.tags,
      content: this.state.content,
      cover_url: this.state.cover_url,
    };
    // eslint-disable-next-line no-unused-vars
    // const noteToAdd = <Note id={100} note={noteInfo} />;
    // console.log('printing noteToAdd');
    // console.log(noteToAdd);
    this.props.createPost(noteInfo, this.props.history);
  }

  render() {
    return (
      <div id="inputwindow">
        <div id="inputdiv">
          <h1> Create a new post! </h1>
          <input className="inputbar" onChange={this.onTitleChange} value={this.state.title} placeholder="Note Title" />
          <input className="inputbar" onChange={this.onTagChange} value={this.state.tags} placeholder="Note Tags" />
          <input className="inputbar" onChange={this.onContentChange} value={this.state.content} placeholder="Note Content" />
          <input className="inputbar" onChange={this.onCoverUrlChange} value={this.state.cover_url} placeholder="Note cover url" />
          <button type="button" onClick={this.addPostClick}>Submit</button>
        </div>
      </div>

    );
  }
}

export default (connect(null, { createPost })(NoteInput));

// export default NoteInput;
