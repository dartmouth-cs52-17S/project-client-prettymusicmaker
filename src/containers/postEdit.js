import React, { Component } from 'react';
import { connect } from 'react-redux';
import marked from 'marked';
import { withRouter, NavLink } from 'react-router-dom';
import { deletePost, fetchPost, updatePost } from '../actions';


class PostEdit extends Component {
  constructor(props) {
    super(props);

    this.onDeleteClicked = this.onDeleteClicked.bind(this);
    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onEditClicked = this.onEditClicked.bind(this);
    this.renderFunc = this.renderFunc.bind(this);

    // edit functions
    this.onEditTitle = this.onEditTitle.bind(this);
    this.onEditContent = this.onEditContent.bind(this);
    this.onEditTags = this.onEditTags.bind(this);
    this.onEditURL = this.onEditURL.bind(this);

    this.state = {
      title: '',
      tags: '',
      content: '',
      cover_url: '',
      isEditing: false,
    };
  }

  // fetch the current post
  componentDidMount() {
    this.props.fetchPost(this.props.match.params.postID);
  }

  // delete the post
  onDeleteClicked(e) {
    e.preventDefault();
    this.props.deletePost(this.props.match.params.postID, this.props.history);
  }

  // edit the post
  onEditClicked(e) {
    e.preventDefault();
    this.setState({ isEditing: true, title: this.props.post.title, tags: this.props.post.tags, content: this.props.post.content, cover_url: this.props.post.cover_url });
  }

  // save the post
  onSaveClicked(e) {
    e.preventDefault();
    this.setState({ isEditing: false });
    this.props.updatePost(this.state, this.props.match.params.postID);
  }

  // change the state in edits
  onEditTitle(e) {
    e.preventDefault();
    this.setState({ title: e.target.value });
  }

  onEditContent(e) {
    e.preventDefault();
    this.setState({ content: e.target.value });
  }

  onEditTags(e) {
    e.preventDefault();
    this.setState({ tags: e.target.value });
  }

  onEditURL(e) {
    e.preventDefault();
    this.setState({ cover_url: e.target.value });
  }

  renderFunc() {
    if (this.state.isEditing) {
      console.log(this.state);
      return (
        <div className="mainContentArea">
          <div className="contentArea">
            <textarea id="textarea1" onChange={this.onEditTitle} value={this.state.title} />
            <textarea id="textarea2" onChange={this.onEditContent} value={this.state.content} />
            <textarea id="textarea2" onChange={this.onEditURL} value={this.state.cover_url} />
            <textarea id="textarea3" onChange={this.onEditTags} value={this.state.tags} />
          </div>
          <input id="saveButton" onClick={this.onSaveClicked} type="submit" value="Save" />
        </div>
      );
    } else {
      // props
      const { title, content, tags } = this.props.post;

      return (
        <div className="mainContentArea">
          <div className="contentArea">
            <p id="editTitle">{title}</p>
            <div id="editContent" dangerouslySetInnerHTML={{ __html: marked(content || '') }} />
            <p id="editTags">{tags}</p>
          </div>
          <input id="editButton" onClick={this.onEditClicked} type="submit" value="Edit" />
        </div>
      );
    }
  }

  render() {
    if (!this.props.post) {
      return <div>Loading...</div>;
    }
    const url = this.props.post.cover_url;
    return (
      <div className="editMainContainer">
        <div className="deletePostHeader">
          <NavLink id="back" exact to="/"><p>Back To Index</p></NavLink>
          <input id="deleteButton" onClick={this.onDeleteClicked} type="submit" value="Delete" />
        </div>
        <div className="editImageContainer">
          <img src={url} alt="Can't show resource. No valid URL found." />
        </div>
        {this.renderFunc()}
      </div>
    );
  }
}

// connects particular parts of redux state to props
const mapStateToProps = state => (
  {
    post: state.posts.post,
  }
);

export default withRouter(connect(mapStateToProps, { deletePost, fetchPost, updatePost })(PostEdit));
