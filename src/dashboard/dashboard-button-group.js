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
import PropTypes from 'prop-types';
import { Button,OverlayTrigger, Tooltip } from 'react-bootstrap';
import Icon from "../common/icon";

class DashboardButtonGroup extends React.Component {
  render() {
    const buttonStyle = {
      marginLeft: '12px',
      height: '44px', 
      width : '35px'
    };

    const iconStyle = {
      color: '#007bff',
      height: '25px', 
      width : '25px'
    }

    const buttons = [];
    let key = 0;

    if (this.props.fullscreen) {
      return null;
    }

    if (this.props.editing) {
      buttons.push(
        <OverlayTrigger key={key++} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"save"}`}> Save changes </Tooltip>} >
        <Button variant= 'light' size="lg" key={key} onClick={this.props.onSave} style={buttonStyle}>
          <Icon icon="save" style={iconStyle} /> 
        </Button>
        </OverlayTrigger>,
        <OverlayTrigger key={key++}  placement={'bottom'} overlay={<Tooltip id={`tooltip-${"cancel"}`}> Discard changes </Tooltip>} >
        <Button key={key} variant= 'light' size="lg" onClick={this.props.onCancel} style={buttonStyle}>
          <Icon icon="times" style={iconStyle}/>
        </Button>
        </OverlayTrigger>
      );
    } else {
      if (this.props.fullscreen !== true) {
        buttons.push(
          <OverlayTrigger key={key++} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"expand"}`}> Change to fullscreen view </Tooltip>} >
          <Button key={key} variant= 'light' size="lg" onClick={this.props.onFullscreen} style={buttonStyle}>
            <Icon icon="expand" style={iconStyle}/> 
          </Button>
          </OverlayTrigger>
        );
      }

      if (this.props.paused) {
        buttons.push(
          <OverlayTrigger key={key++} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"play"}`}> Continue simulation </Tooltip>} >
          <Button key={key} variant= 'light' size="lg" onClick={this.props.onUnpause} style={buttonStyle}>
            <Icon icon="play" style={iconStyle}/> 
          </Button>
          </OverlayTrigger>
        );
      } else {
        buttons.push(
          <OverlayTrigger key={key++} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"pause"}`}> Pause simulation </Tooltip>} >
          <Button key={key} variant= 'light' size="lg" onClick={this.props.onPause} style={buttonStyle}>
            <Icon icon="pause" style={iconStyle}/> 
          </Button>
          </OverlayTrigger>
        );
      }

      buttons.push(
        <OverlayTrigger key={key++} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"file"}`}> Add, edit or delete files of scenario </Tooltip>} >
        <Button key={key} variant= 'light' size="lg" onClick={this.props.onEditFiles} style={buttonStyle}>
          <Icon icon="file" style={iconStyle}/>
        </Button>
        </OverlayTrigger>
      );

      buttons.push(
        <OverlayTrigger key={key++} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"file"}`}> Add, edit or delete input signal </Tooltip>} >
        <Button key={key} variant= 'light' size="lg" onClick={this.props.onEditInputSignals} style={buttonStyle}>
          <Icon icon="sign-in-alt" style={iconStyle}/>
        </Button>
        </OverlayTrigger>
      );

      buttons.push(
        <OverlayTrigger key={key++} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"file"}`}> Add, edit or delete output signals </Tooltip>} >
        <Button key={key} variant= 'light' size="lg" onClick={this.props.onEditOutputSignals} style={buttonStyle}>
          <Icon icon="sign-out-alt" style={iconStyle}/>
        </Button>
        </OverlayTrigger>
      );

      buttons.push(
        <OverlayTrigger key={key++} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"layout"}`}> Add widgets and edit layout </Tooltip>} >
        <Button key={key} variant= 'light' size="lg" onClick={this.props.onEdit} style={buttonStyle}>
          <Icon icon="pen" style={iconStyle} /> 
        </Button>
        </OverlayTrigger>
      );

    }

    return <div className='section-buttons-group-right'>
      {buttons}
    </div>;
  }
}

DashboardButtonGroup.propTypes = {
  editing: PropTypes.bool,
  fullscreen: PropTypes.bool,
  paused: PropTypes.bool,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onFullscreen: PropTypes.func,
  onPause: PropTypes.func,
  onUnpause: PropTypes.func
};

export default DashboardButtonGroup;
