import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import FallBack from './fallback';
import PostBoard from './posts';
import SignUpPage from './signup';
import SignInPage from './signin';
import newPost from './newpost';
import Nav from './nav';
import PostDisplay from './postDisplay';


const App = (props) => {
  return (
    <Router>
      <div className="navParent">
        <Nav />
        <Switch>
          <Route exact path="/" component={PostBoard} />
          <Route exact path="/signUp" component={SignUpPage} />
          <Route exact path="/signIn" component={SignInPage} />
          <Route path="/posts/new" component={newPost} />
          <Route path="/post/:postID" component={PostDisplay} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
