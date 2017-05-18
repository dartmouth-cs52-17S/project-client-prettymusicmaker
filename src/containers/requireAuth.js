import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function (ComposedComponent) {
  class RequireAuth extends Component {
    // your various component lifecycle methods
    componentWillMount() {
      if (!this.props.authenticated) {
        this.props.history.push('/signin');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.props.history.push('/signin');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }

  // mapStateToProps
  const mapStateToProps = state => (
    {
      authenticated: state.auth.authenticated,
    }
);

  return connect(mapStateToProps, null)(RequireAuth);
}
