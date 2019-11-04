/**
 * File: button.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 29.03.2017
 * Copyright: 2018, Institute for Automation of Complex Power Systems, EONERC
 *
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

class WidgetButton extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pressed: false
    }
  }

  onPress(e) {
    if (!this.props.widget.toggle) {
      this.setState({ pressed: true });
      this.valueChanged(this.props.widget.on_value);
    }
  }

  onRelease(e) {
    let nextState = false;
    if (this.props.widget.toggle) {
      nextState = !this.state.pressed;
    }

    this.setState({ pressed: nextState });
    this.valueChanged(nextState ? this.props.widget.on_value : this.props.widget.off_value);
  }

  valueChanged(newValue) {
    if (this.props.onInputChanged)
      this.props.onInputChanged(newValue);
  }

  render() {
    return (
      <div className="button-widget full">
          <Button className="full" active={ this.state.pressed } disabled={ this.props.editing } onMouseDown={ (e) => this.onPress(e) } onMouseUp={ (e) => this.onRelease(e) }>{this.props.widget.name}</Button>
      </div>
    );
  }
}

export default WidgetButton;
