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

import React from 'react';
import { SketchPicker } from 'react-color';
import Dialog from '../../common/dialogs/dialog';


class ColorPicker extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      widget: {}
    };
  }

  static getDerivedStateFromProps(props, state){

    return {
      widget: props.widget
    };
  }

  handleChangeComplete = (color) => {
    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if (parts.length === 1){
      isCustomProperty = false;
    }

    let temp = this.state.widget;
    isCustomProperty ? temp[parts[0]][parts[1]] = color.hex : temp[this.props.controlId] = color.hex;
    this.setState({ widget: temp });
  };

  onClose = canceled => {
    if (canceled) {
      if (this.props.onClose != null) {
        this.props.onClose();
      }

      return;
    }

    if (this.valid && this.props.onClose != null) {
      this.props.onClose(this.state.widget);
    }
  };

  render() {
    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if (parts.length === 1){
      isCustomProperty = false;
    }
      return <Dialog show={this.props.show} title='Color Picker' buttonTitle='Save' onClose={(c) => this.onClose(c)} valid={true}>
          <form>
              <SketchPicker
                  color={isCustomProperty ? this.state.widget[parts[0]][parts[1]]: this.state.widget[this.props.controlId]}
                  onChangeComplete={ this.handleChangeComplete }
                  width={"300"}
              />

          </form>
      </Dialog>;
  }
}

export default ColorPicker;
