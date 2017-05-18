import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchMusic } from '../actions';

// eslint-disable-next-line react/prefer-stateless-function
class Profile extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // fetch music on page load
  componentWillMount() {
    this.props.fetchMusic();
  }

  render() {
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
          <div className="songinfo">
            <div className="songtitle">Here is a song! Put title stuff here.</div>
            <button>edit</button>
            <button>share</button>
            <button>delete</button>
          </div>
          <div className="songinfo">
            <div className="songtitle">Here is a song! Put title stuff here.</div>
            <button>edit</button>
            <button>share</button>
            <button>delete</button>
          </div>
          <div className="songinfo">
            <div className="songtitle">Here is a song! Put title stuff here.</div>
            <button>edit</button>
            <button>share</button>
            <button>delete</button>
          </div>
          <div className="songinfo">
            <div className="songtitle">Here is a song! Put title stuff here.</div>
            <button>edit</button>
            <button>share</button>
            <button>delete</button>
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
  }
);

export default (connect(mapStateToProps, { fetchMusic })(Profile));
