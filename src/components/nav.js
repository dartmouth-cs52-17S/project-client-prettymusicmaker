import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { signoutUser } from '../actions';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.renderNav = this.renderNav.bind(this);
  }

  // renderNav() {
  //   if (this.props.authenticated) {
  //     return (
  //       <NavLink exact to="/" onClick={() => this.props.signoutUser(this.props.history)}><button>log out</button></NavLink>
  //     );
  //   }
  //   return (
  //     <span />
  //   );
  // }

  // Icon version
  render() {
    if (this.props.authenticated) {
      return (
        <nav>
          <NavLink id="nav-button" exact to="/"><i className="fa fa-home" aria-hidden="true" /></NavLink>
          <NavLink id="nav-button" exact to="/profile"><i className="fa fa-user" aria-hidden="true" /></NavLink>
          <NavLink id="nav-button" exact to="/editor"><i className="fa fa-plus" aria-hidden="true" /></NavLink>
          <NavLink exact to="/" onClick={() => this.props.signoutUser(this.props.history)}><button>log out</button></NavLink>
        </nav>
      );
    } else {
      return (
        <span />
      );
    }
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
