import ReactDOM from 'react-dom';
import React from 'react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import App from './components/app';


import './style.scss';
import reducers from './reducers';

// import App from './components/app';

// map posts array to keys


// import ReactDOM from 'react-dom';
// this creates the store with the reducers, and does some other stuff to initialize devtools
const store = createStore(reducers, {}, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('main'));
