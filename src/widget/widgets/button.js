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

class WidgetButton extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pressed: false
    }
  }

  onPress(e) {
    console.log("button was pressed!");
    if (!this.props.widget.customProperties.toggle) {
      this.setState({ pressed: true });
      this.valueChanged(this.props.widget.customProperties.on_value);
    }
  }

  onRelease(e) {
    console.log("button was released!");
    let nextState = false;
    if (this.props.widget.customProperties.toggle) {
      nextState = !this.state.pressed;
    }

    this.setState({ pressed: nextState });
    this.valueChanged(nextState ? this.props.widget.customProperties.on_value : this.props.widget.customProperties.off_value);
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
