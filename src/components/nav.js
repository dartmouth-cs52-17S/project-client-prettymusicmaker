import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = (props) => {
  return (
    <div className="navbar">
      <NavLink exact to="/"><i className="fa fa-home fa-2x" aria-hidden="true" /></NavLink>
      <NavLink to="/posts/new"><input id="button_id" type="submit" value="Add" /></NavLink>
    </div>
  );
};

export default Nav;
