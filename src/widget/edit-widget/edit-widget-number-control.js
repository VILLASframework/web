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
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';

class EditWidgetNumberControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        customProperties:{}
      }         
     };
  }
  
  static getDerivedStateFromProps(props, state){
    return{
      widget: props.widget   
     };
  } 

  render() {
    let step = 1;
    if(this.props.controlId ==='customProperties.background_color_opacity'){
      step = 0.1;
    }   
    return (
        <FormGroup controlId={this.props.controlId}>
          <FormLabel>{this.props.label}</FormLabel>
          <FormControl type="number" step={step} value={this.state.widget[this.props.controlId]} onChange={e => this.props.handleChange(e)} />
        </FormGroup>
    );
  }
}

export default EditWidgetNumberControl;
