import React from 'react';


import MusicPortionContainer from '../containers/musicPortion';

const MusicPortion = (props) => {
  // console.log('in music portion');
  // console.log(props);
  return (
    <div>
      <MusicPortionContainer mid={props} route={props.route} />
    </div>
  );
};

export default MusicPortion;

// import React, { Component } from 'react';
// import { withRouter } from 'react-router';
// import MusicPortionContainer from '../containers/musicPortion';
//
// class MusicPortion extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//
//   render() {
//     return (
//       <div>
//         <MusicPortionContainer mid={this.props} route={this.props.route} />
//       </div>
//     );
//   }
// }
//
// export default withRouter(MusicPortion);
