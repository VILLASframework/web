/**
 * File: dialog-new-simulator.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

 import React, { Component } from 'react';
 import { Modal, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

 class NewSimulatorDialog extends Component {
   constructor(props) {
     super(props);

     this.state = {
       name: '',
       simulatorid: '1',
       endpoint: ''
     }

     this.closeModal = this.closeModal.bind(this);
     this.cancelModal = this.cancelModal.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.validateForm = this.validateForm.bind(this);
     this.resetState = this.resetState.bind(this);
   }

   valid: false

   closeModal() {
     this.props.onClose(this.state);
   }

   cancelModal() {
     this.props.onClose(null);
   }

   handleChange(e) {
     this.setState({ [e.target.id]: e.target.value });
   }

   resetState() {
     this.setState({ name: '', simulatorid: '1', endpoint: '' });
   }

   validateForm(target) {
     // check all controls
     var simulatorid = true;
     var endpoint = true;
     var name = true;

     if (this.state.name === '') {
       name = false;
     }

     // test if simulatorid is a number (in a string, not type of number)
     if (!/^\d+$/.test(this.state.simulatorid)) {
       simulatorid = false;
     }

     if (this.state.endpoint === '') {
       endpoint = false;
     }

     this.valid = simulatorid && endpoint && name;

     // return state to control
     if (target === 'name') return name ? "success" : "error";
     else if (target === 'simulatorid') return simulatorid ? "success" : "error";
     else return endpoint ? "success" : "error";
   }

   render() {
     return (
       <Modal show={this.props.show} onEnter={this.resetState}>
         <Modal.Header>
           <Modal.Title>New Simulator</Modal.Title>
         </Modal.Header>

         <Modal.Body>
           <form>
             <FormGroup controlId="name" validationState={this.validateForm('name')}>
               <ControlLabel>Name</ControlLabel>
               <FormControl type="text" placeholder="Enter name" value={this.state.name} onChange={this.handleChange} />
             </FormGroup>
             <FormGroup controlId="simulatorid" validationState={this.validateForm('simulatorid')}>
               <ControlLabel>Simulator ID</ControlLabel>
               <FormControl type="number" placeholder="Enter simulator ID" value={this.state.simulatorid} onChange={this.handleChange} />
             </FormGroup>
             <FormGroup controlId="endpoint" validationState={this.validateForm('endpoint')}>
               <ControlLabel>Endpoint</ControlLabel>
               <FormControl type="text" placeholder="Enter endpoint" value={this.state.endpoint} onChange={this.handleChange} />
             </FormGroup>
           </form>
         </Modal.Body>

         <Modal.Footer>
           <Button onClick={this.cancelModal}>Close</Button>
           <Button bsStyle="primary" onClick={this.closeModal} disabled={!this.valid}>Add</Button>
         </Modal.Footer>
       </Modal>
     );
   }
 }

 export default NewSimulatorDialog;
