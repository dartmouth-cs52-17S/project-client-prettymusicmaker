import React from 'react';
import Prof from '../containers/profile';
import Nav from './nav';

// import Note from './note';

// eslint-disable-next-line react/prefer-stateless-function
const Profile = (props) => {
  return (
    <div>
      <Nav />
      <Prof />
    </div>
  );
};

export default Profile;
