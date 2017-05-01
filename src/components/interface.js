import React from 'react';
import Counter from '../containers/counter';
import Controls from '../containers/controls';

const Interface = (props) => {
  return (
    <div>
      <Controls />
      <Counter />
    </div>
  );
};

export default Interface;
