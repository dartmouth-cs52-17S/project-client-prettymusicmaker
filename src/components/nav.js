import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { signoutUser } from '../actions';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.signoutandstop = this.signoutandstop.bind(this);
    this.stopmusic = this.stopmusic.bind(this);
    this.clearTiles = this.clearTiles.bind(this);
    this.rendersignoutandstop = this.rendersignoutandstop.bind(this);
    this.rendersignout = this.rendersignout.bind(this);
  }

  stopmusic() {
    this.props.stop();
  }

  signoutandstop() {
    this.props.signoutUser(this.props.history);
    this.props.stop();
  }

  clearTiles() {
    this.props.clear();
    this.props.stop();
  }

  rendersignoutandstop() {
    if (this.props.authenticated) {
      return (
        <NavLink exact to="/" onClick={() => this.signoutandstop()}><button>log out</button></NavLink>
      );
    } else {
      return (
        <span />
      );
    }
  }

  rendersignout() {
    if (this.props.authenticated) {
      return (
        <NavLink exact to="/" onClick={() => this.props.signoutUser(this.props.history)}><button>log out</button></NavLink>
      );
    } else {
      return (
        <span />
      );
    }
  }

  // Icon version
  render() {
    if (this.props.stop) {
      return (
        <nav>
          <NavLink id="nav-button" exact to="/about"><div className="navicons" onClick={() => this.props.stop()}>about</div></NavLink>
          <NavLink id="nav-button" exact to="/profile"><div className="navicons" onClick={() => this.props.stop()}>home</div></NavLink>
          <NavLink id="nav-button" exact to="/editor"><div className="navicons" onClick={this.clearTiles}>create</div></NavLink>
          {this.rendersignoutandstop()}
        </nav>
      );
    } else {
      return (
        <nav>
          <NavLink id="nav-button" exact to="/about"><div className="navicons">about</div></NavLink>
          <NavLink id="nav-button" exact to="/profile"><div className="navicons">home</div></NavLink>
          <NavLink id="nav-button" exact to="/editor"><div className="navicons">create</div></NavLink>
          {this.rendersignout()}
        </nav>
      );
    }
  }
}

const mapStateToProps = state => (
  {
    authenticated: state.auth.authenticated,
  });

export default withRouter(connect(mapStateToProps, { signoutUser })(Nav));
