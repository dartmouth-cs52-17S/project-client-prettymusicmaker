import React from 'react';
import AboutUs from '../containers/about';
import Nav from './nav';

// import Note from './note';

// eslint-disable-next-line react/prefer-stateless-function
const About = (props) => {
  return (
    <div>
      <Nav />
      <AboutUs />
    </div>
  );
};

export default About;
