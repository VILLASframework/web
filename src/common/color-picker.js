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
import { Form } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import Dialog from './dialogs/dialog';

class ColorPicker extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      rgbColor: {},
    };
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {

    if(this.props.show !== prevProps.show){
      // update color if show status of color picker has changed
      this.setState({rgbColor: ColorPicker.hexToRgb(this.props.hexcolor,this.props.opacity)})
    }
  }

  static hexToRgb(hex,opacity) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: opacity
    } : null;
  }

  handleChangeComplete = (color) => {
    this.setState({rgbColor: color.rgb})
  };

  onClose = canceled => {
    if (canceled) {
      if (this.props.onClose != null) {
        this.props.onClose();
      }

      return;
    }

    if (this.props.onClose != null) {

      const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')

      let data = {
        hexcolor: rgbToHex(this.state.rgbColor.r, this.state.rgbColor.g,this.state.rgbColor.b),
        opacity: this.state.rgbColor.a,
      }

      this.props.onClose(data);
    }
  };

  render() {

    return <Dialog
      show={this.props.show}
      title='Color Picker'
      buttonTitle='Save'
      onClose={(c) => this.onClose(c)}
      valid={true}
      >
        <Form>
          <SketchPicker
              color={this.state.rgbColor}
              disableAlpha={this.props.disableOpacity}
              onChangeComplete={ this.handleChangeComplete }
              width={300}
          />
        </Form>
    </Dialog>;
  }
}

export default ColorPicker;
