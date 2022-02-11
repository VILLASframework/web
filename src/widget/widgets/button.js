/**
 * This file is part of VILLASweb.
 *
 * VILLASweb is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * VILLASweb is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with VILLASweb. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import AppDispatcher from '../../common/app-dispatcher';

class WidgetButton extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pressed: props.widget.customProperties.pressed
    }
  }

  componentDidMount() {
    let widget = this.props.widget
    widget.customProperties.simStartedSendValue = false
    widget.customProperties.pressed = false

    AppDispatcher.dispatch({
      type: 'widgets/start-edit',
      token: this.props.token,
      data: widget
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // a simulaton was started, make an update
    if (this.props.widget.customProperties.simStartedSendValue) {
      let widget = this.props.widget
      widget.customProperties.simStartedSendValue = false
      AppDispatcher.dispatch({
        type: 'widgets/start-edit',
        token: this.props.token,
        data: widget
      });

      // send value, don't change widget
      this.props.onInputChanged(widget.customProperties.off_value, '', false, false);
    }
  }

  static getDerivedStateFromProps(props, state){
    return {
      pressed: props.widget.customProperties.pressed
    }
  }

  onPress(e) {
    if (e.button === 0 && !this.props.widget.customProperties.toggle) {
      this.valueChanged(this.props.widget.customProperties.on_value, true);
    }
  }

  onRelease(e) {
    if (e.button === 0) {
      let nextState = false;
      if (this.props.widget.customProperties.toggle) {
        nextState = !this.state.pressed;
      }
      this.valueChanged(nextState ? this.props.widget.customProperties.on_value : this.props.widget.customProperties.off_value, nextState);
    }
  }

  valueChanged(newValue, pressed) {
    if (this.props.onInputChanged) {
      this.props.onInputChanged(newValue, 'pressed', pressed, true);
    }
  }

  render() {
    let opacity = this.props.widget.customProperties.background_color_opacity
    const buttonStyle = {
      backgroundColor: this.props.widget.customProperties.background_color,
      borderColor: this.props.widget.customProperties.border_color,
      color: this.props.widget.customProperties.font_color,
      opacity: this.state.pressed ? (opacity + 1)/4 : opacity,
    };

    return (
      <div className="button-widget full">
          <Button
            className="full"
            style={buttonStyle}
            active={ this.state.pressed }
            disabled={ this.props.editing }
            onMouseDown={ (e) => this.onPress(e) }
            onMouseUp={ (e) => this.onRelease(e) }>
            {this.props.widget.name}
          </Button>
      </div>
    );
  }
}

export default WidgetButton;
