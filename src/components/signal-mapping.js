/**
 * File: signalMapping.js
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
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import validator from 'validator';

import Table from './table';
import TableColumn from './table-column';

class SignalMapping extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            length: props.length,
            signals: props.signals
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.length === this.state.length && nextProps.signals === this.state.signals) {
            return;
        }

        this.setState({ length: nextProps.length, signals: nextProps.signals });
    }

    validateLength(){
        const valid = validator.isInt(this.state.length + '', { min: 1, max: 100 });

        return valid ? 'success' : 'error';
    }

    handleLengthChange = event => {
        const length = event.target.value;

        // update signals to represent length
        const signals = this.state.signals;
        
        if (this.state.length < length) {
            while (signals.length < length) {
                signals.push({ name: 'Signal', type: 'Type' });
            }
        } else {
            signals.splice(length, signals.length - length);
        }

        // save updated state
        this.setState({ length, signals });

        if (this.props.onChange != null) {
            this.props.onChange(length, signals);
        }
    }

    handleMappingChange = (event, row, column) => {
        const signals = this.state.signals;

        if (column === 1) {
            signals[row].name = event.target.value;
        } else if (column === 2) {
            signals[row].type = event.target.value;
        }

        this.setState({ signals });

        if (this.props.onChange != null) {
            this.props.onChange(this.state.length, signals);
        }
    }

    render() {
        return <div>
            <FormGroup validationState={this.validateLength()}>
                <ControlLabel>{this.props.name} Length</ControlLabel>
                <FormControl type='number' placeholder='Enter length' min='1' value={this.state.length} onChange={this.handleLengthChange} />
                <FormControl.Feedback />
            </FormGroup>

            <FormGroup>
                <ControlLabel>{this.props.name} Mapping</ControlLabel>
                <HelpBlock>Click <i>name</i> or <i>type</i> cell to edit</HelpBlock>
                <Table data={this.props.signals}>
                    <TableColumn title='ID' width='60' dataIndex />
                    <TableColumn title='Name' dataKey='name' inlineEditable onInlineChange={this.handleMappingChange} />
                    <TableColumn title='Type' dataKey='type' inlineEditable onInlineChange={this.handleMappingChange} />
                </Table>
            </FormGroup>
        </div>;
    }
}

SignalMapping.propTypes = {
    name: PropTypes.string,
    length: PropTypes.number,
    signals: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired
        })
    ),
    onChange: PropTypes.func
};

export default SignalMapping;
