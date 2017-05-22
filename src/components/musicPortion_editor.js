import React from 'react';

import MusicPortionEditorContainer from '../containers/musicPortion_editor';

const MusicPortionEditor = (props) => {
  return (
    <div>
      <MusicPortionEditorContainer mid={props} />
    </div>
  );
};

export default MusicPortionEditor;
