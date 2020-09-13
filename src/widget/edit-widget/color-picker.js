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

  hexToRgb = (hex,opacity) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: opacity
    } : null;
  }

  handleChangeComplete = (color) => {
    
    let temp = this.state.widget;

    if(this.props.controlId === 'strokeStyle'){
      temp.customProperties.zones[this.props.zoneIndex]['strokeStyle'] = color.hex;
    }
    else{
    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;

    if (parts.length === 1){
      isCustomProperty = false;
    }

    isCustomProperty ? temp[parts[0]][parts[1]] = color.hex : temp[this.props.controlId] = color.hex;
    isCustomProperty ? temp[parts[0]][parts[1] + "_opacity"] = color.rgb.a : temp[this.props.controlId +"_opacity"] = color.rgb.a;
    }

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
    let disableOpacity = false;
    let hexColor;
    let opacity = 1;
    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if (parts.length === 1){
      isCustomProperty = false;
    }

    if((this.state.widget.type === "Box" && parts[1] === "border_color") || this.props.controlId === 'strokeStyle'){
      disableOpacity = true;
    }
    if(this.props.controlId === 'strokeStyle'){
      if(typeof this.state.widget.customProperties.zones[this.props.zoneIndex] !== 'undefined'){
    hexColor = this.state.widget.customProperties.zones[this.props.zoneIndex]['strokeStyle'];
      }
    }
    else{
    hexColor = isCustomProperty ? this.state.widget[parts[0]][parts[1]]: this.state.widget[this.props.controlId];
    opacity = isCustomProperty ? this.state.widget[parts[0]][parts[1] + "_opacity"]: this.state.widget[this.props.controlId + "_opacity"];

    }

    
    let rgbColor = this.hexToRgb(hexColor, opacity);



      return <Dialog show={this.props.show} title='Color Picker' buttonTitle='Save' onClose={(c) => this.onClose(c)} valid={true}>
          <form>
              <SketchPicker
                  color={rgbColor}
                  disableAlpha={disableOpacity} 
                  onChangeComplete={ this.handleChangeComplete }
                  width={"300"}
              />

          </form>
      </Dialog>;
  }
}

export default ColorPicker;
