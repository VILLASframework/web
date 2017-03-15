/**
 * File: edit-widget-table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 14.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

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
