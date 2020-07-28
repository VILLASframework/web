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
import { scaleOrdinal } from 'd3-scale';
import {schemeCategory10} from 'd3-scale-chromatic';
import ColorPicker from './color-picker'
import Icon from "../../common/icon";

// schemeCategory20 no longer available in d3

class EditWidgetColorControl extends Component {

  static get ColorPalette() {
    let colorCount = 0;
    const colors = [];
    const colorScale = scaleOrdinal(schemeCategory10);
    while (colorCount < 10) { colors.push(colorScale(colorCount)); colorCount++; }
    colors.unshift('#000', '#FFF'); // include black and white

    return colors;
  }

  constructor(props) {
    super(props);

    this.state = {
      widget: {},
      showColorPicker: false
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget
    };
  }

  openColorPicker = () =>{
    this.setState({showColorPicker: true})
  }

  closeEditModal = (data) => {
    this.setState({showColorPicker: false})
    if(data){
    this.props.handleChange({target: { id: this.props.controlId, value: data}});
    }
  }

  render() {
    const currentColor = this.state.widget[this.props.controlId];
   
    return (
      <FormGroup>
        <FormLabel>{this.props.label}</FormLabel>

        <div className='section-buttons-group-right'>
        <OverlayTrigger key={0} placement={'right'} overlay={<Tooltip id={`tooltip-${"color"}`}> Change color </Tooltip>} >
        <Button key={2} style={{ width: '260px', height: '40px', color:{currentColor} }} onClick={this.openColorPicker.bind(this)}  >
          <Icon icon="paint-brush"/>
        </Button>
        </OverlayTrigger>
        </div>

        <ColorPicker show={this.state.showColorPicker} onClose={(data) => this.closeEditModal(data)} widget={this.state.widget} controlId={this.props.controlId} />
      </FormGroup>

    )
  }
}

export default EditWidgetColorControl;
