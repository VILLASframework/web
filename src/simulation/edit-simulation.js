/**
 * File: new-simulation.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
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
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';

import Dialog from '../common/dialogs/dialog';
import ParametersEditor from '../common/parameters-editor';

class EditSimulationDialog extends React.Component {
    valid = true;

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            _id: '',
            startParameters: {}
        };
    }

    onClose = canceled => {
        if (canceled) {
            if (this.props.onClose != null) {
                this.props.onClose();
            }

            return;
        }

        if (this.valid && this.props.onClose != null) {
            this.props.onClose(this.state);
        }
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    }

    resetState = () => {
        this.setState({
            name: this.props.simulation.name,
            _id: this.props.simulation._id,
            startParameters: this.props.simulation.startParameters || {}
        });
    }

    handleStartParametersChange = startParameters => {
        this.setState({ startParameters });
    }

    validateForm(target) {
        let name = true;

        if (this.state.name === '') {
            name = false;
        }

        this.valid = name;

        // return state to control
        if (target === 'name') return name ? 'success' : 'error';
    }

    render() {
        return <Dialog show={this.props.show} title='Edit Simulation' buttonTitle='Save' onClose={this.onClose} onReset={this.resetState} valid={true}>
            <form>
                <FormGroup controlId='name' validationState={this.validateForm('name')}>
                    <FormLabel>Name</FormLabel>
                    <FormControl type='text' placeholder='Enter name' value={this.state.name} onChange={this.handleChange} />
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup controlId='startParameters'>
                    <FormLabel>Start Parameters</FormLabel>

                    <ParametersEditor content={this.state.startParameters} onChange={this.handleStartParametersChange} />
                </FormGroup>
            </form>
        </Dialog>;
    }
}

export default EditSimulationDialog;
