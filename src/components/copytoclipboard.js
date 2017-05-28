import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

class Clipboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: `prettymusicmaker.surge.sh/editor/${this.props.linkToSong}`,
      copied: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onCopy = this.onCopy.bind(this);
  }

  onChange({ target: { value } }) {
    this.setState({ value, copied: false });
  }

  onClick({ target: { innerHTML } }) { // eslint-disable-line
    console.log(`Clicked on "${innerHTML}"!`); // eslint-disable-line
  }

  onCopy() {
    this.setState({ copied: true });
  }

  render() {
    return (
      <div>
        <div>
          <input onChange={this.onChange} size={20} value={this.state.value} disabled="disabled" />&nbsp;
          <CopyToClipboard onCopy={this.onCopy} text={this.state.value}>
            <button>copy</button>
          </CopyToClipboard>&nbsp;
        </div>
        <br />
      </div>
    );
  }
}


export default Clipboard;
