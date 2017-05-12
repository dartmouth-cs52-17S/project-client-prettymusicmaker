import React, { Component } from 'react';
import { connect } from 'react-redux';
import marked from 'marked';
import Textarea from 'react-textarea-autosize';


import { fetchPost, deletePost, updatePost } from '../actions';

// import Draggable from 'react-draggable'; // The default
// import marked from 'marked';
// import Textarea from 'react-textarea-autosize';


class Post extends Component {
  constructor(props) {
    super(props);
    if (props.post) {
      console.log('in constructor if');
      console.log(props);
      this.state = {
        id: props.post.id,
        cover_url: props.post.cover_url,
        title: props.post.title,
        tags: props.post.tags,
        content: props.post.content,
        editContent: false,
        editTitle: false,
        editTag: false,
        editCover: false,
      };
    } else {
      this.state = {
        id: '',
        cover_url: '',
        title: '',
        tags: '',
        content: '',
        editContent: false,
        editTitle: false,
        editTag: false,
        editCover: false,
      };
    }
    this.deletePost = this.deletePost.bind(this);

    this.renderPostBody = this.renderPostBody.bind(this);
    this.renderPostTitle = this.renderPostTitle.bind(this);
    this.renderPostTag = this.renderPostTag.bind(this);
    this.renderPostCover = this.renderPostCover.bind(this);

    this.toggleEditTitle = this.toggleEditTitle.bind(this);
    this.toggleEditContent = this.toggleEditContent.bind(this);
    this.toggleEditTag = this.toggleEditTag.bind(this);
    this.toggleEditCover = this.toggleEditCover.bind(this);

    this.handleBlurTitle = this.handleBlurTitle.bind(this);
    this.handleBlurContent = this.handleBlurContent.bind(this);
    this.handleBlurTag = this.handleBlurTag.bind(this);
    this.handleBlurCover = this.handleBlurCover.bind(this);
  }

  componentDidMount() {
    this.props.fetchPost(this.props.match.params.postID);
  }

  componentWillReceiveProps(nextprops) {
    this.setState({
      id: nextprops.post.id,
      cover_url: nextprops.post.cover_url,
      title: nextprops.post.title,
      tags: nextprops.post.tags,
      content: nextprops.post.content,
    });
  }

  deletePost() {
    console.log('ID HERE');
    console.log(this.state.id);
    this.props.deletePost(this.state.id, this.props.history);
  }

  toggleEditTitle() {
    this.setState({ editTitle: !this.state.editTitle });
  }
  toggleEditContent() {
    this.setState({ editContent: !this.state.editContent });
  }
  toggleEditTag() {
    this.setState({ editTag: !this.state.editTag });
  }
  toggleEditCover() {
    this.setState({ editCover: !this.state.editCover });
  }

  handleBlurTitle() {
    this.toggleEditTitle();
    this.props.updatePost(this.state);
  }
  handleBlurContent() {
    this.toggleEditContent();
    this.props.updatePost(this.state);
  }
  handleBlurTag() {
    this.toggleEditTag();
    this.props.updatePost(this.state);
  }
  handleBlurCover() {
    this.toggleEditCover();
    this.props.updatePost(this.state);
  }

/*eslint-disable*/
  renderPostTitle() {
    if (this.state.editTitle) {
      return (
        <div>
          <Textarea rows={1}
            value={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}
            onBlur={this.handleBlurTitle}
            autoFocus
            className="onerow"
          />
        </div>
      );
    } else {
      return (
        <div className="PostTitle">
          <h1 role="button" onClick={this.toggleEditTitle}>{this.state.title}</h1>
        </div>
      );
    }
  }
  renderPostBody() {
    if (this.state.editContent) {
      return (
        <div className="PostBody">
          <Textarea rows={5}
            value={this.state.content}
            onChange={e => this.setState({ content: e.target.value })}
            onBlur={this.handleBlurContent}
            autoFocus
          />
        </div>
      );
    } else {
      return (
        <div className="PostBody">
          <div role="button" onClick={this.toggleEditContent} dangerouslySetInnerHTML={{ __html: marked(this.state.content || '') }} />
        </div>
      );
    }
  }

  renderPostTag() {
    if (this.state.editTag) {
      return (
        <div>
          <Textarea rows={1}
            value={this.state.tags}
            onChange={e => this.setState({ tags: e.target.value })}
            onBlur={this.handleBlurTag}
            autoFocus
            className="onerow"
          />
        </div>
      );
    } else {
      return (
        <div className="PostTag">
          <div role="button" onClick={this.toggleEditTag}>{this.state.tags}</div>
        </div>
      );
    }
  }
  renderPostCover() {
    if (this.state.editCover) {
      return (
        <div className="PostCover">
          <Textarea rows={5}
            value={this.state.cover_url}
            onChange={e => this.setState({ cover_url: e.target.value })}
            onBlur={this.handleBlurCover}
            autoFocus
          />
        </div>
      );
    } else {
      return (
        <div className="PostCover">
          <img alt="Cover" role="button" className="Cover_Url" onClick={this.toggleEditCover} src={this.state.cover_url} />
        </div>
      );
    }
  }
  /* eslint-enable*/


  render() {
    return (
      <div className="SinglePostWindow">
        <div className="PostAndButton">
          <button type="button" onClick={this.deletePost}>Delete Post</button>
          <div className="SinglePost">
            {this.renderPostCover()}
            <div className="PostContent">
              {this.renderPostTitle()}
              {this.renderPostBody()}
              {this.renderPostTag()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    post: state.posts.post,
  }
);

export default (connect(mapStateToProps, { fetchPost, deletePost, updatePost })(Post));
