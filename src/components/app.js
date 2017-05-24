import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
// import { withRouter } from 'react-router';
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
          <Route exact path="/" component={requireAuth(Profile)} />
          <Route path="/editor/:id" component={MusicPortion} />
          <Route path="/editor" component={MusicPortion} />
          <Route path="/profile" component={requireAuth(Profile)} />
          <Route path="/signin" component={Splash} />
          <Route path="/signup" component={Splash} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
