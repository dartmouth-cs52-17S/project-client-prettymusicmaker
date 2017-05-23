import React, { Component } from 'react';
import Slider from 'react-rangeslider';

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
        min={5}
        max={240}
        step={1}
        value={this.state.tempo}
        tooltip={this.state.tooltip}
        labels={{ 240: '240bpm', 1: '1bpm' }}
        orientation="vertical"
        onChange={this.handleOnChange}
      />
    );
  }
}

export default TempoSlider;
