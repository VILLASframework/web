/**
 * File: action.js
 * Author: Steffen Vogel <stvogel@eonerc.rwth-aachen.de>
 * Date: 21.11.2018
 * Copyright: 2018, Institute for Automation of Complex Power Systems, EONERC
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

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Icon from '../../common/icon';
import LoginStore from '../../user/login-store';
import SimulatorStore from '../../simulator/simulator-store';
import AppDispatcher from '../../common/app-dispatcher';

class WidgetCustomAction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      simulator: null
    };
  }

  static getStores() {
    return [ SimulatorStore ];
  }

  componentWillReceiveProps(props) {
    if (props.simulationModel === null)
      return;

    this.setState({
      simulator: SimulatorStore.getState().find(s => s._id === props.simulationModel.simulator),
      sessionToken: LoginStore.getState().token
    });
  }

  onClick() {
    AppDispatcher.dispatch({
      type: 'simulators/start-action',
      simulator: this.state.simulator,
      data: this.props.widget.customProperties.actions,
      token: this.state.sessionToken
    });
  }

  render() {
    return <div className="widget-custom-action full">
      <Button className="full" disabled={this.state.simulator === null} onClick={(e) => this.onClick()}>
        <Icon icon={this.props.widget.customProperties.icon} /> <span dangerouslySetInnerHTML={{ __html: this.props.widget.name }} />
      </Button>
    </div>;
  }
}

export default WidgetCustomAction;
