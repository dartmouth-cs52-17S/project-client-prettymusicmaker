import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';
import Posts from '../containers/renderposts';
// import PostTile from '../components/posttile';
import Post from '../components/post';
import NewPost from '../components/newpost';
import NavBar from './navbar';

class App extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Switch>
            <Route exact path="/" component={Posts} />
            <Route path="/posts/new" component={NewPost} />
            <Route path="/posts/:postID" component={Post} />
            <Route render={() => (<div>post not found </div>)} />
          </Switch>
        </div>
      </Router>
    );
  }


}

export default App;
