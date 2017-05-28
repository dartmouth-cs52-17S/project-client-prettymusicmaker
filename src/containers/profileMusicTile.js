import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { deleteMusic } from '../actions';
import CopyToClipboard from '../components/copytoclipboard';

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

class MusicTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.onDeleteClicked = this.onDeleteClicked.bind(this);
  }
  // delete a Song
  onDeleteClicked() {
    this.props.deleteMusic(this.props.id, this.props.history);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  renderModal() {
    if (this.state.modalIsOpen) {
      return (
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Cancel"
        >
          <div className="modalContent">
            <CopyToClipboard linkToSong={this.props.id} />
            <div className="modalButtons">
              <button onClick={this.closeModal}>close</button>
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

  render() {
    const id = this.props.id;
    return (
      <div className="songinfo">
        {this.renderModal()}
        <div className="songtitle">{this.props.title}</div>
        <NavLink to={`editor/${id}`}><button>open</button></NavLink>
        <button onClick={this.openModal}>share</button>
        <button onClick={this.onDeleteClicked}>delete</button>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
  }
);

export default withRouter(connect(mapStateToProps, { deleteMusic })(MusicTile));
