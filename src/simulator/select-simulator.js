/**
 * File: selectSimulator.js
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
import { FormGroup, FormControl, FormLabel, Col } from 'react-bootstrap';
import _ from 'lodash';

import SimulatorStore from './simulator-store';

class SelectSimulator extends React.Component {
    static getStores() {
        return [ SimulatorStore ];
    }

    static calculateState() {
        return {
            simulators: SimulatorStore.getState(),
            selectedSimulator: ''
        };
    }

    static getDerivedStateFromProps(props, state){
      if (props.value === state.selectedSimulator) {
        return null; // no change
      }

      let selectedSimulator = props.value;
      if (selectedSimulator == null) {
        if (state.simulators.length > 0) {
          selectedSimulator = state.simulators[0].id;
        } else {
          selectedSimulator = '';
        }
      }

      return {
        selectedSimulator
      };
    }

    handleChange = event => {
        this.setState({ selectedSimulator: event.target.value });

        // send complete simulator to callback
        if (this.props.onChange != null) {
            const simulator = this.state.simulators.find(s => s.id === event.target.value);

            this.props.onChange(simulator);
        }
    };

    render() {

        const simulatorOptions = this.state.simulators.map(s =>
            <option key={s.id} value={s.id}>{_.get(s, 'properties.name') || _.get(s, 'rawProperties.name') || s.uuid}</option>
        );
        console.log("simulator options: ", simulatorOptions);

        return <FormGroup>
            <FormLabel sm={3} md={2}>
                Simulator
            </FormLabel>

            <Col sm={9} md={10}>
                <FormControl as="select" placeholder='Select simulator' value={this.state.selectedSimulator} onChange={(e) => this.handleChange(e)}>
                  {simulatorOptions}
                </FormControl>
            </Col>
        </FormGroup>;
    }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(SelectSimulator));
