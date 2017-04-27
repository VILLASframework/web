/**
 * File: edit-widget-table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 14.03.2017
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
 import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

 class EditTableWidget extends Component {
   constructor(props) {
     super(props);

     this.state = {
       widget: {
         simulator: ''
       }
     };
   }

   componentWillReceiveProps(nextProps) {
     this.setState({ widget: nextProps.widget });
   }

   render() {
     return (
       <div>
         <FormGroup controlId="simulator">
           <ControlLabel>Simulator</ControlLabel>
           <FormControl componentClass="select" placeholder="Select simulator" value={this.state.widget.simulator} onChange={(e) => this.props.handleChange(e)}>
             {this.props.simulation.models.map((model, index) => (
               <option key={index} value={model.simulator}>{model.name}</option>
             ))}
           </FormControl>
         </FormGroup>
       </div>
     );
   }
 }

 export default EditTableWidget;
