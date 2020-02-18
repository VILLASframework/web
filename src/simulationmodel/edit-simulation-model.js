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
import SelectFile from "../file/select-file";

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
            selectedModelFileID:0

        };
    }


    onClose(canceled) {
        if (canceled === false) {
            if (this.valid) {
                let data = this.props.simulationModel;
                if (this.state.name !== '' && this.props.simulationModel.name !== this.state.name) {
                    data.name = this.state.name;
                }
                if (this.state.simulatorID !== '' && this.props.simulationModel.simulatorID !== parseInt(this.state.simulatorID)) {
                    data.simulatorID = parseInt(this.state.simulatorID, 10);
                }
                if(this.state.startParameters !==  {} && this.props.simulationModel.startParameters !== this.state.startParameters){
                    data.startParameters = this.state.startParameters;
                }
                if (parseInt(this.state.selectedModelFileID, 10) !== 0 &&
                  this.props.simulationModel.selectedModelFileID !== parseInt(this.state.selectedModelFileID)) {
                  data.selectedModelFileID = parseInt(this.state.selectedModelFileID, 10);
                }

                //forward modified simulation model to callback function
                this.props.onClose(data)
            }
        } else {
            this.props.onClose();
        }
    }

    handleChange(e) {
        this.setState({ [e.target.id]: e.target.value });
        this.valid = this.isValid()
    }

    handleParameterChange(data) {
      if (data) {
        this.setState({startParameters: data});
      }


      this.valid = this.isValid()
    }

    handleSelectedModelFileChange(newFileID){
      console.log("Model file change to: ", newFileID);
      this.setState({selectedModelFileID: newFileID})

      this.valid = this.isValid()
    }

    isValid() {
      // input is valid if at least one element has changed from its initial value
      return this.state.name !== ''
        || this.state.simulatorID !== ''
        || this.state.startParameters !== {}
        || this.state.selectedFile != null
        || this.state.configuration != null
        || this.state.selectedModelFileID !== 0;
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


                    <SelectFile type='model' name='Simulation Model File' onChange={(e) => this.handleSelectedModelFileChange(e)} value={this.state.selectedModelFileID} objectID={this.props.simulationModel.id}/>


                  {/*<SelectFile type='configuration' name='Configuration' onChange={(e) => this.handleChange(e)} value={this.state.configuration} />*/}





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
