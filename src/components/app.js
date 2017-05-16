import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import FallBack from './fallback';
import Nav from './nav';
import Column from './column';


const App = (props) => {
  return (
    <Router>
      <div className="navParent">
        <Nav />
        <Switch>
          <Route exact path="/" component={FallBack} />
          <Route component={FallBack} />
          <Route path="/col" component={Column} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
