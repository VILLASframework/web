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
      color: null
    };
  }

  static getDerivedStateFromProps(props, state){
    let parts = props.controlId.split('.');
    let isCustomProperty = true;
    if (parts.length === 1){
      isCustomProperty = false;
    }
    let color = (isCustomProperty ? props.widget[parts[0]][parts[1]] : props.widget[props.controlId]);

    return {
      color: color
    };
  }

  handleChangeComplete = (color) => {
    this.setState({ color: color.hex });
  };

  onClose = canceled => {
    if (canceled) {
      if (this.props.onClose != null) {
        this.props.onClose();
      }

      return;
    }

    if (this.valid && this.props.onClose != null) {
      this.props.onClose(this.state.color);
    }
  };

  render() {
      return <Dialog show={this.props.show} title='Color Picker' buttonTitle='Save' onClose={(c) => this.onClose(c)} valid={true}>
          <form>
              <SketchPicker
                  color={this.state.color}
                  onChangeComplete={ this.handleChangeComplete }
                  width={"300"}
              />

          </form>
      </Dialog>;
  }
}

export default ColorPicker;
