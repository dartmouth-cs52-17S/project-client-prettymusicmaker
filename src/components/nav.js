import React from 'react';
import { NavLink } from 'react-router-dom';
// <NavLink to="/"><input id="button_id" type="submit" value="Home" /></NavLink>
const Nav = (props) => {
  return (
    <nav>
      <NavLink exact to="/"><i className="fa fa-home" aria-hidden="true" /></NavLink>
      <NavLink id="nav-button" exact to="/profile"><i className="fa fa-user" aria-hidden="true" /></NavLink>
      <NavLink id="nav-button" exact to="/editor"><i className="fa fa-plus" aria-hidden="true" /></NavLink>
    </nav>
  );
};

export default Nav;
