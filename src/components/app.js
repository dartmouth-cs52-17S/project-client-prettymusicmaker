import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import FallBack from './fallback';
// import Nav from './nav';
import Column from './column';
import Profile from './profile';

const App = (props) => {
  return (
    <Router>
      <div className="navParent">

        <Switch>
          <Route path="/col" component={Column} />
          <Route path="/profile" component={Profile} />
          <Route exact path="/" component={FallBack} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
