import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signupUser } from '../actions';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSignUpClicked = this.onSignUpClicked.bind(this);

    this.state = {
      email: '',
      password: '',
    };
  }

  // update the value of the email sign up state variable
  onChangeEmail(e) {
    e.preventDefault();
      // set it automatically to lowercase
    this.setState({ email: e.target.value.toLowerCase() });
  }

  // update the password variable
  onChangePassword(e) {
    e.preventDefault();
      // set it automatically to lowercase
    this.setState({ password: e.target.value });
  }

  // sign up click handler
  onSignUpClicked(e) {
    e.preventDefault();
    // triggern the sign up action
    this.props.signupUser(this.state, this.props.history);
  }

  render() {
    return (
      <div className="newPostBoard">
        <div className="newPostTitle">
          <p>Sign up today</p>
        </div>
        <div className="signUpContainer">
          <input id="new_post_input_id" onChange={this.onChangeEmail} placeholder="Email:" />
          <input id="new_post_input_id" onChange={this.onChangePassword} type="password" placeholder="Password:" />
          <input id="new_post_button1" onClick={this.onSignUpClicked} type="submit" value="Sign Up" />
        </div>
      </div>
    );
  }
}

// connects particular parts of redux state to props
const mapStateToProps = state => (
  {
    auth: state.auth.authenticated,
  }
);

export default withRouter(connect(mapStateToProps, { signupUser })(SignUp));
