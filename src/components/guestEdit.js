import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { MusicPortion } from './musicPortion';
import { Splash } from './splash';
import { signinUser, signupUser } from '../actions';

class GuestEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignin: false,
    };
  }

  onSaveChange(event) {
    /* SPLASH SCREEN */
    this.showSignin = true;
  }

  returnSplash() { // eslint-disable-line
    return (
      <div>
        <Splash />
      </div>
    );
  }

  render() {
    return (
      <div>
        <p>Welcome. Make a ~new~ song.</p>
        <MusicPortion />
        {this.returnSplash()}
        <div className="Button">
          <span><button onClick={this.onSaveChange}>Save</button></span>
          <NavLink to="/"><button>Cancel</button></NavLink>
        </div>
      </div>
    );
  }
}

export default connect(null, { signinUser, signupUser })(GuestEdit);
