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
import { Button, ButtonToolbar, DropdownButton, Dropdown, Tooltip, OverlayTrigger } from 'react-bootstrap';

class ICAction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAction: null
        };
    }

    static getDerivedStateFromProps(props, state){
      if (state.selectedAction == null) {
        if (props.actions != null && props.actions.length > 0) {
          return{
            selectedAction: props.actions[0]
          };
        }
      }
      return null
    }

    setAction = id => {
        // search action
        for (let action of this.props.actions) {
            if (action.id === id) {
                this.setState({ selectedAction: action });
            }
        }
    };

    render() {
      let showTooltip = this.state.selectedAction.id === '-1';
          
        const actionList = this.props.actions.map(action => (
            <Dropdown.Item key={action.id} eventKey={action.id} active={this.state.selectedAction === action.id}>
                {action.title}
            </Dropdown.Item>
        ));

        return <div>
        {showTooltip ? 
          <ButtonToolbar>
            <OverlayTrigger key={0} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"select"}`}> Select command for infrastructure component </Tooltip>} >
              <DropdownButton title={this.state.selectedAction != null ? this.state.selectedAction.title : ''} id="action-dropdown" onSelect={this.setAction}>
                {actionList}
              </DropdownButton>
            </OverlayTrigger>
            <OverlayTrigger key={1} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"send"}`}> Send command to infrastructure component </Tooltip>} >
              <Button style={{ marginLeft: '5px' }} disabled={this.props.runDisabled} onClick={() => this.props.runAction(this.state.selectedAction)}>Send command</Button>
            </OverlayTrigger>
          </ButtonToolbar>
          :
          <ButtonToolbar>
            <DropdownButton title={this.state.selectedAction != null ? this.state.selectedAction.title : ''} id="action-dropdown" onSelect={this.setAction}>
              {actionList}
            </DropdownButton>
            <Button style={{ marginLeft: '5px' }} disabled={this.props.runDisabled} onClick={() => this.props.runAction(this.state.selectedAction)}>Send command</Button>
          </ButtonToolbar>
        }
        </div>;
    }
}

export default ICAction;
