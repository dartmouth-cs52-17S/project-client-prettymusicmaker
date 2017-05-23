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
    this.setState({
      tempo: value,
    });
    this.props.musicPortionCallback(value);
  }

  render() {
    const { tempo } = this.state;
    return (
      <Slider
        min={5000}
        max={100}
        step={10}
        value={tempo}
        tooltip={this.state.tooltip}
        labels={{ 5000: 'slow', 1000: 'medium', 100: 'fast' }}
        orientation="horizontal"
        onChange={this.handleOnChange}
      />
    );
  }
}

export default TempoSlider;
