/**
 * File: simulationModel.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 10.05.2018
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

import React from 'react';
import { Container } from 'flux/utils';
import { Button, Col, Form, FormLabel, FormGroup } from 'react-bootstrap';

import SimulationModelStore from './simulation-model-store';
import LoginStore from '../user/login-store';
import AppDispatcher from '../common/app-dispatcher';

import SelectFile from '../file/select-file';
import EditSignalMapping from '../signal/edit-signal-mapping';
import EditableHeader from '../common/editable-header';
import ParametersEditor from '../common/parameters-editor';
import SimulatorStore from "../simulator/simulator-store";
import SignalStore from "../signal/signal-store";
import FileStore from "../file/file-store"


class SimulationModel extends React.Component {
    static getStores() {
        return [ SimulationModelStore, LoginStore ];
    }

    static calculateState(prevState, props) {

      // get selected simulation model
      const sessionToken = LoginStore.getState().token;

      let simulationModel = SimulationModelStore.getState().find(m => m.id === parseInt(props.match.params.simulationModel, 10));
      if (simulationModel == null) {
        AppDispatcher.dispatch({
          type: 'simulationModels/start-load',
          data: props.match.params.simulationModel,
          token: sessionToken
        });
      }

      // signals and files of simulation model
      // TODO add direction of signals to find operation
      let inputSignals = SignalStore.getState().find(sig => sig.simulationModelID === parseInt(props.match.params.simulationModel, 10));
      let outputSignals = SignalStore.getState().find(sig => sig.simulationModelID === parseInt(props.match.params.simulationModel, 10));


      let files = FileStore.getState().find(f => f.simulationModelID === parseInt(props.match.params.simulationModel, 10));


        return {
          simulationModel,
          inputSignals,
          outputSignals,
          files,
          sessionToken,
          simulators: SimulatorStore.getState(),
          selectedFile: null,

        };
    }

    componentDidMount() {
      //load selected simulationModel
      AppDispatcher.dispatch({
        type: 'simulationModels/start-load',
        data: this.state.simulationModel.id,
        token: this.state.sessionToken
      });

      // load input signals for selected simulation model
      AppDispatcher.dispatch({
        type: 'signals/start-load',
        token: this.state.sessionToken,
        param: '?direction=in&modelID=' + this.state.simulationModel.id,
      });

      // load output signals for selected simulation model
      AppDispatcher.dispatch({
        type: 'signals/start-load',
        token: this.state.sessionToken,
        param: '?direction=out&modelID=' + this.state.simulationModel.id,
      });

      // load files for selected simulation model
      AppDispatcher.dispatch({
        type: 'files/start-load',
        token: this.state.sessionToken,
        param: '?objectType=model&objectID=' + this.state.simulationModel.id,
      });

      // load simulators
      AppDispatcher.dispatch({
        type: 'simulators/start-load',
        token: this.state.sessionToken,
      });
    }

    submitForm = event => {
        event.preventDefault();
    }

    saveChanges = () => {
        AppDispatcher.dispatch({
            type: 'simulationModels/start-edit',
            data: this.state.simulationModel,
            token: this.state.sessionToken
        });

        this.props.history.push('/scenarios/' + this.state.simulationModel.scenarioID);
    }

    discardChanges = () => {
        this.props.history.push('/scenarios/' + this.state.simulationModel.scenarioID);
    }

    handleSimulatorChange = simulator => {
        const simulationModel = this.state.simulationModel;

        simulationModel.simulator = simulator;

        this.setState({ simulationModel });
    }

    handleModelChange = file => {
        console.log(file);
    }

    handleConfigurationChange = file => {
        console.log(file);
    }

    handleOutputMappingChange = (length, signals) => {
        const simulationModel = this.state.simulationModel;

        simulationModel.outputMapping = signals;
        simulationModel.outputLength = length;

        this.setState({ simulationModel });
    }

    handleInputMappingChange = (length, signals) => {
        const simulationModel = this.state.simulationModel;

        simulationModel.inputMapping = signals;
        simulationModel.inputLength = length;

        this.setState({ simulationModel });
    }

    handleTitleChange = title => {
        const simulationModel = this.state.simulationModel;

        simulationModel.name = title;

        this.setState({ simulationModel });
    }

    handleStartParametersChange = startParameters => {
        const simulationModel = this.state.simulationModel;

        simulationModel.startParameters = startParameters;

        this.setState({ simulationModel });
    }

    render() {
        const buttonStyle = {
            marginRight: '10px'
        };
        console.log("OutputSignals: ", this.state.outputSignals);
        let outputSignals = null;
        if  (this.state.outputSignals != null){
          outputSignals = Object.keys(this.state.outputSignals).map(key => {return this.state.outputSignals[key]});
          console.log("OutputSignals Array", outputSignals);
        }
        let inputSignals = null;
        console.log("InputSignals: ", this.state.inputSignals);
        if  (this.state.inputSignals != null){
          inputSignals = Object.keys(this.state.inputSignals).map(key => {return this.state.inputSignals[key]});
          console.log("InputSignals Array", inputSignals);
        }


        return <div className='section'>
            <EditableHeader title={this.state.simulationModel.name} onChange={this.handleTitleChange} />

            <Form onSubmit={this.submitForm}>
                <FormGroup as={Col} xs={12} sm={12}>

                    <SelectFile type='model' name='Model' onChange={this.handleModelChange} value={this.state.selectedFile} />

                    <SelectFile type='configuration' name='Configuration' onChange={this.handleConfigurationChange} value={this.state.simulationModel.configuration} />

                    <div>
                        <FormLabel sm={3} md={2}>
                            Start Parameters
                        </FormLabel>

                        <Col sm={9} md={10}>
                            <ParametersEditor content={this.state.simulationModel.startParameters} onChange={this.handleStartParametersChange} />
                        </Col>
                    </div>

                </FormGroup>

                <Col xs={12} sm={6}>
                    <EditSignalMapping name='Output' length={this.state.simulationModel.outputLength} signals={outputSignals} onChange={this.handleOutputMappingChange} />
                </Col>

                <Col xs={12} sm={6}>
                    <EditSignalMapping name='Input' length={this.state.simulationModel.inputLength} signals={inputSignals} onChange={this.handleInputMappingChange} />
                </Col>

                <div style={{ clear: 'both' }}></div>

                <Button onClick={this.discardChanges} style={buttonStyle}>Cancel</Button>
                <Button onClick={this.saveChanges} style={buttonStyle}>Save</Button>
            </Form>
        </div>;
    }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(SimulationModel), { withProps: true });
