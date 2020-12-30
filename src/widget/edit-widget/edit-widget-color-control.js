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
import { FormGroup, OverlayTrigger, Tooltip , FormLabel, Button } from 'react-bootstrap';
import ColorPicker from './color-picker'
import Icon from "../../common/icon";

// schemeCategory20 no longer available in d3

class EditWidgetColorControl extends Component {

  constructor(props) {
    super(props);

    this.state = {
      widget: {},
      showColorPicker: false,
      originalColor: null
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget
    };
  }

  openColorPicker = () =>{
    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if (parts.length === 1){
      isCustomProperty = false;
    }
    let color = (isCustomProperty ? this.props.widget[parts[0]][parts[1]] : this.props.widget[this.props.controlId]);

    this.setState({showColorPicker: true, originalColor: color});
  }

  closeEditModal = (data) => {
    this.setState({showColorPicker: false})
    if(typeof data === 'undefined'){
      let parts = this.props.controlId.split('.');
      let isCustomProperty = true;
      if (parts.length === 1) {
        isCustomProperty = false;
      }

      let temp = this.state.widget;
      isCustomProperty ? temp[parts[0]][parts[1]] = this.state.originalColor : temp[this.props.controlId] = this.state.originalColor;
      this.setState({ widget: temp });
    }
  }

  render() {
    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if (parts.length === 1){
      isCustomProperty = false;
    }
    let color = (isCustomProperty ? this.props.widget[parts[0]][parts[1]] : this.props.widget[this.props.controlId]);
    let opacity = (isCustomProperty ? this.props.widget[parts[0]][parts[1] + "_opacity"] : this.props.widget[this.props.controlId + "_opacity"]);
    let style = {
      backgroundColor: color,
      opacity: opacity,
      width: '260px', 
      height: '40px'
    }

    let tooltipText = "Change color and opacity";
    if(this.props.disableOpacity){
      tooltipText = "Change border color";
    }

   
    return (
      <FormGroup>
        <FormLabel>{this.props.label}</FormLabel>

        <div className='section-buttons-group-right'>
        <OverlayTrigger key={0} placement={'right'} overlay={<Tooltip id={`tooltip-${"color"}`}> {tooltipText} </Tooltip>} >
        <Button key={2} style={style} onClick={this.openColorPicker.bind(this)}  >
          <Icon icon="paint-brush"/>
        </Button>
        </OverlayTrigger>
        </div>

        <ColorPicker show={this.state.showColorPicker} onClose={(data) => this.closeEditModal(data)} widget={this.state.widget} controlId={this.props.controlId} disableOpacity={this.props.disableOpacity}/>
      </FormGroup>

    )
  }
}

export default EditWidgetColorControl;
