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
        min={60}
        max={400}
        step={1}
        value={this.state.tempo}
        tooltip={this.state.tooltip}
        labels={{ 400: '400bpm', 60: '60bpm' }}
        orientation="vertical"
        onChange={this.handleOnChange}
      />
    );
  }
}

export default TempoSlider;
