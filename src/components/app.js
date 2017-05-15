import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import FallBack from './fallback';
import Nav from './nav';


const App = (props) => {
  return (
    <Router>
      <div className="navParent">
        <Nav />
        <Switch>
          <Route exact path="/" component={FallBack} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
