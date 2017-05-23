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
          <img alt="" src="https://img.clipartfest.com/d768243d1716e20f370362fcb75d346b_balloon-clipart-balloon-images-free-clip-art_615-1044.png" />
          <div id="profileinfo">
            <div id="profilename">username here</div>
            <div id="profiletag">some profile info here</div>
            <button id="logout">logout</button>
          </div>
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
