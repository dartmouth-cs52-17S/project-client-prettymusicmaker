import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import FallBack from './fallback';
import Splash from './splash';
import MusicPortion from './musicPortion';
import Profile from './profile';
import requireAuth from '../containers/requireAuth';

const App = (props) => {
  return (
    <Router>
      <div className="navParent">
        <Switch>
          <Route exact path="/" component={Splash} />
          <Route path="/editor" component={requireAuth(MusicPortion)} />
          <Route path="/profile" component={Profile} />
          <Route path="/signin" component={Splash} />
          <Route path="/signup" component={Splash} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
