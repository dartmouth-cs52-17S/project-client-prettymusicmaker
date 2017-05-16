import React from 'react';
import { NavLink } from 'react-router-dom';
// <NavLink to="/"><input id="button_id" type="submit" value="Home" /></NavLink>
const Nav = (props) => {
  return (
    <nav className="navbar">
      <NavLink exact to="/"><i className="fa fa-home fa-2x" aria-hidden="true" /></NavLink>
      <ul>
        <NavLink id="nav-button" exact to="/profile"><i className="fa fa-user" aria-hidden="true" /></NavLink>
        <NavLink id="nav-button" exact to="/col"><i className="fa fa-plus" aria-hidden="true" /></NavLink>
      </ul>
    </nav>
  );
};

export default Nav;
