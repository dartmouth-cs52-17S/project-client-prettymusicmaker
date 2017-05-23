import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMusic } from '../actions';
import MusicTile from './profileMusicTile';


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderSongs = this.renderSongs.bind(this);
  }

  // fetch music on page load
  componentDidMount() {
    this.props.fetchMusic();
  }

  // having componentDidUpdate calls renderSongs over and over again....
  // componentDidUpdate() {
  //   this.props.fetchMusic();
  // }

  // render the songs
  renderSongs() {
    return this.props.musicObjects.map((music) => {
      return (
        <MusicTile key={music.id} id={music.id} title={music.title} />
      );
    });
  }

  render() {
    if (!this.props.musicObjects) {
      return <div>Loading Music...</div>;
    }
    return (
      <div id="profilepage">
        <div id="profilebar">
          <div id="profilename">{this.props.musicObjects[0].author}</div>
        </div>
        <div id="songlist">
          {this.renderSongs()}
        </div>
      </div>
    );
  }
}

// get access to tiles as tileArray
const mapStateToProps = state => (
  {
    musicObjects: state.music.allMusic,
  }
);

export default connect(mapStateToProps, { fetchMusic })(Profile);
