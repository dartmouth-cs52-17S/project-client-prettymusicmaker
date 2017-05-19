import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { signoutUser } from '../actions';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderSignIn = this.renderSignIn.bind(this);
  }

  renderSignIn() {
    if (this.props.authenticated) {
      console.log('authenticated!!');
      return (
        <NavLink exact to="/" onClick={() => this.props.signoutUser(this.props.history)}>log Out</NavLink>
      );
    }
    return (
      <span />
    );
  }

  // Icon version
  render() {
    return (
      <nav>
        <NavLink exact to="/" id="logo">prettymusicmaker</NavLink>
        <NavLink id="nav-button" exact to="/profile"><i className="fa fa-user" aria-hidden="true" /></NavLink>
        <NavLink id="nav-button" exact to="/editor"><i className="fa fa-plus" aria-hidden="true" /></NavLink>
        {this.renderSignIn()}
      </nav>
    );
  }
}

// Text-only version
// render() {
//   return (
//     <nav>
//       <NavLink exact to="/">home</NavLink>
//       <NavLink id="nav-button" exact to="/profile">profile</NavLink>
//       <NavLink id="nav-button" exact to="/editor">create</NavLink>
//       {this.renderSignIn()}
//     </nav>
//   );
// }

const mapStateToProps = state => (
  {
    authenticated: state.auth.authenticated,
  });

export default withRouter(connect(mapStateToProps, { signoutUser })(Nav));
