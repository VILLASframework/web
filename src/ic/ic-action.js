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
import { Button, DropdownButton, Dropdown, InputGroup, FormControl } from 'react-bootstrap';

class ICAction extends React.Component {
  constructor(props) {
    super(props);

    let t = new Date()

    Number.prototype.pad = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    }

    let time = new Date();
    time.setMinutes(5 * Math.round(time.getMinutes() / 5 + 1))

    this.state = {
      selectedAction: null,
      time: time
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.selectedAction == null) {
      if (props.actions != null && props.actions.length > 0) {
        return {
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

  setTimeForAction = (time) => {
    this.setState({ time: new Date(time) })
  }

  render() {

    let sendCommandDisabled = this.props.runDisabled || this.state.selectedAction == null || this.state.selectedAction.id === "-1"

    let time = this.state.time.getFullYear().pad(4) + '-' +
               this.state.time.getMonth().pad(2) + '-' +
               this.state.time.getDay().pad(2) + 'T' +
               this.state.time.getHours().pad(2) + ':' +
               this.state.time.getMinutes().pad(2);

    const actionList = this.props.actions.map(action => (
      <Dropdown.Item key={action.id} eventKey={action.id} active={this.state.selectedAction === action.id}>
        {action.title}
      </Dropdown.Item>
    ));

    return <div className='solid-button'>
      <InputGroup>
        <InputGroup.Prepend>
          <DropdownButton
            variant="secondary"
            title={this.state.selectedAction != null ? this.state.selectedAction.title : ''}
            id="action-dropdown"
            onSelect={this.setAction}>
            {actionList}
          </DropdownButton>
          <FormControl
            type="datetime-local"
            variant="outline-secondary"
            value={time}
            onChange={this.setTimeForAction} />
        </InputGroup.Prepend>
        <Button
          variant="secondary"
          disabled={sendCommandDisabled}
          onClick={() => this.props.runAction(this.state.selectedAction, this.state.time)}>Run</Button>
      </InputGroup>
      <small className="text-muted">Select time for synced command execution</small>
    </div>;
  }
}

export default ICAction;
