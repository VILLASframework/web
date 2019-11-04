/**
 * File: simulator-actionm.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 12.04.2018
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
import { Button, DropdownButton, DropdownItem } from 'react-bootstrap';

class SimulatorAction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAction: null
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.selectedAction == null) {
            if (nextProps.actions != null && nextProps.actions.length > 0) {
                this.setState({ selectedAction: nextProps.actions[0] });
            }
        }
    }
    
    setAction = id => {
        // search action
        for (let action of this.props.actions) {
            if (action.id === id) {
                this.setState({ selectedAction: action });
            }
        }
    }

    render() {
        const actionList = this.props.actions.map(action => (
            <DropdownItem key={action.id} eventKey={action.id} active={this.state.selectedAction === action.id}>
                {action.title}
            </DropdownItem>
        ));

        return <div>
            <DropdownButton title={this.state.selectedAction != null ? this.state.selectedAction.title : ''} id="action-dropdown" onSelect={this.setAction}>
                {actionList}
            </DropdownButton>

            <Button style={{ marginLeft: '5px' }} disabled={this.props.runDisabled} onClick={() => this.props.runAction(this.state.selectedAction)}>Run</Button>
        </div>;
    }
}

export default SimulatorAction;
