import { NavLink } from 'react-router-dom';
import React from 'react';

const HeaderBar = (props) => {
  return (
    <nav>
      <ul>
        <li><NavLink to="/" exact className="navlink">My Super Awesome Blog</NavLink></li>
      </ul>
    </nav>
  );
};

export default HeaderBar;
