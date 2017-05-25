import React from 'react';


import MusicPortionContainer from '../containers/musicPortion';

const MusicPortion = (props) => {
  return (
    <div>
      <MusicPortionContainer mid={props} route={props.route} />
    </div>
  );
};

export default MusicPortion;
