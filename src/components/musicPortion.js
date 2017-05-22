import React from 'react';
import MusicPortionContainer from '../containers/musicPortion';

// import Note from './note';

// eslint-disable-next-line react/prefer-stateless-function
const MusicPortion = (props) => {
  return (
    <div>
      <MusicPortionContainer mid={props} />
    </div>
  );
};

export default MusicPortion;
