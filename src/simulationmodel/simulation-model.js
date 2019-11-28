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
import { Button, Col, Form, FormLabel } from 'react-bootstrap';

import SimulationModelStore from './simulation-model-store';
import LoginStore from '../user/login-store';
import AppDispatcher from '../common/app-dispatcher';

import SelectSimulator from '../simulator/select-simulator';
import SelectFile from '../file/select-file';
import SignalMapping from './signal-mapping';
import EditableHeader from '../common/editable-header';
import ParametersEditor from '../common/parameters-editor';

class SimulationModel extends React.Component {
    static getStores() {
        return [ SimulationModelStore, LoginStore ];
    }

    static calculateState(prevState, props) {
        const simulationModel = SimulationModelStore.getState().find(m => m.id === props.match.params.simulationModel);

        return {
            simulationModel: simulationModel || {},
            sessionToken: LoginStore.getState().token
        };
    }

    componentWillMount() {
        AppDispatcher.dispatch({
            type: 'simulationModels/start-load',
            data: this.props.match.params.simulationModel,
            token: this.state.sessionToken
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

        return <div className='section'>
            <EditableHeader title={this.state.simulationModel.name} onChange={this.handleTitleChange} />

            <Form horizontal onSubmit={this.submitForm}>
                <Col xs={12} sm={12}>
                    <SelectSimulator onChange={this.handleSimulatorChange} value={this.state.simulationModel.simulator} />

                    <SelectFile disabled type='model' name='Model' onChange={this.handleModelChange} value={this.state.simulationModel.model} />

                    <SelectFile disabled type='configuration' name='Configuration' onChange={this.handleConfigurationChange} value={this.state.simulationModel.configuration} />

                    <div>
                        <Col componentClass={FormLabel} sm={3} md={2}>
                            Start Parameters
                        </Col>

                        <Col sm={9} md={10}>
                            <ParametersEditor content={this.state.simulationModel.startParameters} onChange={this.handleStartParametersChange} />
                        </Col>
                    </div>

                </Col>

                <Col xs={12} sm={6}>
                    <SignalMapping name='Output' length={this.state.simulationModel.outputLength} signals={this.state.simulationModel.outputMapping} onChange={this.handleOutputMappingChange} />
                </Col>

                <Col xs={12} sm={6}>
                    <SignalMapping name='Input' length={this.state.simulationModel.inputLength} signals={this.state.simulationModel.inputMapping} onChange={this.handleInputMappingChange} />
                </Col>

                <div style={{ clear: 'both' }}></div>

                <Button onClick={this.discardChanges} style={buttonStyle}>Cancel</Button>
                <Button bsStyle='primary' onClick={this.saveChanges} style={buttonStyle}>Save</Button>
            </Form>
        </div>;
    }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(SimulationModel), { withProps: true });
