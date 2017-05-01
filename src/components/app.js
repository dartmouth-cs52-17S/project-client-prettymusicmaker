import { BrowserRouter as Router, Route } from 'react-router-dom';
import React from 'react';
import Interface from './interface';

const App = (props) => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Interface} />
      </div>
    </Router>
  );
};

export default App;
