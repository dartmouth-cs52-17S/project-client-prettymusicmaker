import { NavLink } from 'react-router-dom';
import React from 'react';


const NavBar = (props) => {
  return (
    <nav>
      <ul>
        <li><NavLink to="/" exact className="navlink">My Super Awesome Blog</NavLink></li>
        <li><NavLink to="/posts/new" className="navlink"><div id="newButton">new post</div></NavLink></li>
      </ul>
    </nav>
  );
};

export default NavBar;
