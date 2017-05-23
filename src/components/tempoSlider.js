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
        min={100}
        max={5000}
        step={100}
        value={this.state.tempo}
        tooltip={this.state.tooltip}
        labels={{ 5000: '5000bpm', 100: '100bpm' }}
        orientation="vertical"
        onChange={this.handleOnChange}
      />
    );
  }
}

export default TempoSlider;
