/**
 * File: simulationModel.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 10.08.2018
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
import { Button, Col, Form } from 'react-bootstrap';

import SimulationModelStore from '../stores/simulation-model-store';
import UserStore from '../stores/user-store';
import AppDispatcher from '../app-dispatcher';

import SelectSimulator from './select-simulator';
import SelectFile from './select-file';
import SignalMapping from '../components/signal-mapping';

class SimulationModel extends React.Component {
    static getStores() {
        return [ SimulationModelStore, UserStore ];
    }

    static calculateState(prevState, props) {
        const simulationModel = SimulationModelStore.getState().find(m => m._id === props.match.params.simulationModel);

        return {
            simulationModel: simulationModel || {},
            sessionToken: UserStore.getState().token
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

    }

    handleSimulatorChange = simulator => {
        console.log(simulator);
    }

    handleModelChange = file => {
        console.log(file);
    }

    handleConfigurationChange = file => {
        console.log(file);
    }

    handleOutputMappingChange = (length, signals) => {
        console.log(length);
        console.log(signals);
    }

    handleInputMappingChange = (length, signals) => {
        console.log(length);
        console.log(signals);
    }

    render() {
        const sectionStyle = {
            
        };

        return <div className='section'>
            <h1>{this.state.simulationModel.name}</h1>

            <Form horizontal onSubmit={this.submitForm}>
                <Col xs={12} sm={12} style={sectionStyle}>
                    <SelectSimulator onChange={this.handleSimulatorChange} value={this.state.simulationModel.simulator} />

                    <SelectFile type='model' name='Model' onChange={this.handleModelChange} value={this.state.simulationModel.model} />

                    <SelectFile type='configuration' name='Configuration' onChange={this.handleConfigurationChange} value={this.state.simulationModel.configuration} />
                </Col>

                <Col xs={12} sm={6} style={sectionStyle}>
                    <SignalMapping name='Output' length={this.state.simulationModel.outputLength} signals={this.state.simulationModel.outputMapping} onChange={this.handleOutputMappingChange} />
                </Col>

                <Col xs={12} sm={6} style={sectionStyle}>
                    <SignalMapping name='Input' length={this.state.simulationModel.inputLength} signals={this.state.simulationModel.inputMapping} onChange={this.handleInputMappingChange} />
                </Col>

                <div style={{ clear: 'both' }}></div>

                <Button bsStyle='primary' onClick={this.saveChanges}>Save</Button>
            </Form>
        </div>;
    }
}

export default Container.create(SimulationModel, { withProps: true });
