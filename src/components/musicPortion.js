import React from 'react';
// import React, { Component } from 'react';

import MusicPortionContainer from '../containers/musicPortion';

const MusicPortion = (props) => {
  return (
    <div>
      <MusicPortionContainer mid={props} />
    </div>
  );
};

export default MusicPortion;
