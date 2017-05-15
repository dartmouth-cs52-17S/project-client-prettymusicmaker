import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';

import HeaderBar from './headerbar';
import MusicPortion from './musicportion';

const FallBack = (props) => {
  return <div>URL Not Found</div>;
};

const Main = (props) => {
  return (
    <Router>
      <div>
        <HeaderBar />
        <Switch>
          <Route exact path="/" component={MusicPortion} />
          <Route render={() => (<div>page not found </div>)} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
