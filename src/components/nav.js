import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = (props) => {
  return (
    <div className="navbar">
      <NavLink exact to="/"><i className="fa fa-home fa-2x" aria-hidden="true" /></NavLink>
      <NavLink to="/"><input id="button_id" type="submit" value="Home" /></NavLink>
    </div>
  );
};

export default Nav;
