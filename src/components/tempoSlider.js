import React, { Component } from 'react';
import Slider from 'react-rangeslider';
// import 'react-rangeslider/lib/index.css';

class TempoSlider extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tempo: this.props.currentTempo,
      tooltip: true,
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(value) {
    console.log(value);
    this.setState({
      tempo: value,
    });
    this.props.musicPortionCallback(value);
  }

  render() {
    return (
      <Slider
        min={60}
        max={400}
        step={1}
        value={this.state.tempo}
        tooltip={this.state.tooltip}
        labels={{ 400: '400 bpm', 60: '60 bpm', 210: '210 bpm' }}
        orientation="vertical"
        onChange={this.handleOnChange}
      />
    );
  }
}

export default TempoSlider;
