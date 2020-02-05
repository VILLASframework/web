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
import {FormGroup, FormControl, FormLabel} from 'react-bootstrap';
import _ from 'lodash';

import Dialog from '../common/dialogs/dialog';
import ParametersEditor from '../common/parameters-editor';
//import SelectFile from "../file/select-file";

class EditSimulationModelDialog extends React.Component {
    valid = false;

    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null,
            name: '',
            simulatorID: '',
            configuration: null,
            startParameters: {},

        };
    }


    onClose(canceled) {
        if (canceled === false) {
            if (this.valid) {
                let data = this.props.simulationModel;
                if (this.state.name !== '' && this.props.simulationModel.name !== this.state.name) {
                    console.log("name update");
                    data.name = this.state.name;
                }
                if (this.state.simulatorID !== '' && this.props.simulationModel.simulatorID !== parseInt(this.state.simulatorID)) {
                    console.log("SimulatorID update");
                    data.simulatorID = parseInt(this.state.simulatorID, 10);
                }
                if(this.state.startParameters !==  {} && this.props.simulationModel.startParameters !== this.state.startParameters){
                    console.log("Start Parameters update");
                    data.startParameters = this.state.startParameters;
                }
                // TODO selectedFile and configuration?!

                //forward modified simulation model to callback function
                this.props.onClose(data)
            }
        } else {
            this.props.onClose();
        }
    }

    handleChange(e) {
        this.setState({ [e.target.id]: e.target.value });

        // input is valid if at least one element has changed from its initial value
        this.valid = this.state.name !== '' || this.state.simulatorID !== ''|| this.state.startParameters !== {} || this.state.selectedFile != null || this.state.configuration != null;
    }

    handleParameterChange(data) {
      if (data) {
        console.log("Start parameter change")
        this.setState({startParameters: data});
      }

      // input is valid if at least one element has changed from its initial value
      this.valid = this.state.name !== '' || this.state.simulatorID !== ''|| this.state.startParameters !== {} || this.state.selectedFile != null || this.state.configuration != null;
    }

    resetState() {
        //this.setState({});
    }

    render() {
        const simulatorOptions = this.props.simulators.map(s =>
            <option key={s.id} value={s.id}>{_.get(s, 'properties.name') || _.get(s, 'rawProperties.name') || s.uuid}</option>
        );

        return (
            <Dialog show={this.props.show} title="Edit Simulation Model" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
                <form>
                    <FormGroup controlId="name">
                        <FormLabel column={false}>Name</FormLabel>
                        <FormControl type="text" placeholder={this.props.simulationModel.name} value={this.state.name} onChange={(e) => this.handleChange(e)} />
                        <FormControl.Feedback />
                    </FormGroup>

                    <FormGroup controlId="simulatorID">
                      <FormLabel column={false}> Simulator </FormLabel>
                      <FormControl as="select" placeholder='Select simulator' value={this.state.simulatorID} onChange={(e) => this.handleChange(e)}>
                        {simulatorOptions}
                      </FormControl>
                    </FormGroup>

                      {/*
                        <SelectFile type='model' name='Model' onChange={(e) => this.handleChange(e)}
                                    value={this.state.selectedFile}/>
                        < SelectFile type='configuration' name='Configuration' onChange={(e) => this.handleChange(e)} value={this.state.configuration} />
                      */}



                    <FormGroup controlId='startParameters'>
                        <FormLabel> Start Parameters </FormLabel>
                        <ParametersEditor content={this.props.simulationModel.startParameters} onChange={(data) => this.handleParameterChange(data)} />
                    </FormGroup>
                </form>
            </Dialog>
        );
    }
}

export default EditSimulationModelDialog;
