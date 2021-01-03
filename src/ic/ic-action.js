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
import { Button, ButtonToolbar, Dropdown } from 'react-bootstrap';
import TimePicker from 'react-bootstrap-time-picker'

class ICAction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAction: null,
            selectedDelay: 0
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

    setDelayForAction = time => {
      // time in int format: (hours * 3600 + minutes * 60 + seconds)
      this.setState({selectedDelay: time})
    }

    render() {

      let sendCommandDisabled = this.props.runDisabled || this.state.selectedAction == null || this.state.selectedAction.id === "-1"

        const actionList = this.props.actions.map(action => (
            <Dropdown.Item key={action.id} eventKey={action.id} active={this.state.selectedAction === action.id}>
                {action.title}
            </Dropdown.Item>
        ));

        return <div>
          {"Select delay for command execution (Format hh:mm, max 1h):"}
          <TimePicker
            format={24}
            initialValue={this.state.selectedDelay}
            value={this.state.selectedDelay}
            start={"00:00"}
            end={"01:00"}
            step={1}
            onChange={this.setDelayForAction}
          />
          <ButtonToolbar>
           <Dropdown onSelect={this.setAction}>
             <Dropdown.Toggle id={'action-dropdown'} style={{backgroundColor: '#527984', borderColor: '#527984'}}> {this.state.selectedAction != null ? this.state.selectedAction.title : ''}</Dropdown.Toggle>
             <Dropdown.Menu>
             {actionList}
             </Dropdown.Menu>
           </Dropdown>

            <Button style={{ marginLeft: '5px', backgroundColor: '#527984', borderColor: '#527984' }} disabled={sendCommandDisabled} onClick={() => this.props.runAction(this.state.selectedAction, this.state.selectedDelay)}>Send command</Button>

          </ButtonToolbar>
        </div>;
    }
}

export default ICAction;