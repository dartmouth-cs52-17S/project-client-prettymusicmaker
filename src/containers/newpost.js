import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createNewPost } from '../actions';


class NewPost extends Component {
  constructor(props) {
    super(props);

    this.onTitleInputChange = this.onTitleInputChange.bind(this);
    this.onTagsInputChange = this.onTagsInputChange.bind(this);
    this.onContentInputChange = this.onContentInputChange.bind(this);
    this.onUrlInputChange = this.onUrlInputChange.bind(this);

    this.onCancelClicked = this.onCancelClicked.bind(this);
    this.onSubmitClicked = this.onSubmitClicked.bind(this);

    this.state = {
      title: 'no value given',
      content: 'no value given',
      tags: 'no value given',
      cover_url: '',
    };
  }

  // on change events
  onTitleInputChange(e) {
    e.preventDefault();
    this.setState({ title: e.target.value });
    console.log(e.target.value);
  }

  onTagsInputChange(e) {
    e.preventDefault();
    this.setState({ tags: e.target.value });
    console.log(e.target.value);
  }

  onContentInputChange(e) {
    e.preventDefault();
    this.setState({ content: e.target.value });
    console.log(e.target.value);
  }

  onUrlInputChange(e) {
    e.preventDefault();
    this.setState({ cover_url: e.target.value });
    console.log(e.target.value);
  }

  // button click handlers
  onCancelClicked(e) {
    e.preventDefault();
    // just go to main page
    this.props.history.push('/');
  }

  onSubmitClicked(e) {
    e.preventDefault();
    // trigger action to create new post
    this.props.createNewPost(this.state, this.props.history);
  }

  render() {
    return (
      <div className="newPostBoard">
        <div className="newPostTitle">
          <p>Create A New Post</p>
        </div>
        <div className="newPostContent">
          <input id="new_post_input_id" onChange={this.onTitleInputChange} placeholder="title" />
          <input id="new_post_input_id" onChange={this.onTagsInputChange} placeholder="tags" />
          <input id="new_post_input_id" onChange={this.onContentInputChange} placeholder="content" />
          <input id="new_post_input_id" onChange={this.onUrlInputChange} placeholder="cover_url" />
        </div>
        <div className="newPostButtonContainer">
          <input id="new_post_button1" onClick={this.onSubmitClicked} type="submit" value="Submit" />
          <input id="new_post_button2" onClick={this.onCancelClicked} type="submit" value="Cancel" />
        </div>
      </div>
    );
  }
}

// connects particular parts of redux state to props
const mapStateToProps = state => (
  {
    posts: state.posts.all,
  }
);

export default withRouter(connect(mapStateToProps, { createNewPost })(NewPost));
