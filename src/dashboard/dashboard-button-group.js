/**
 * File: dashboard-button-group.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 31.05.2018
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
import { Button } from 'react-bootstrap';
import Icon from "../common/icon";

class DashboardButtonGroup extends React.Component {
  render() {
    const buttonStyle = {
      marginLeft: '8px'
    };

    const buttons = [];
    let key = 0;

    if (this.props.fullscreen) {
      return null;
    }

    if (this.props.editing) {
      buttons.push(
        <Button key={key++} onClick={this.props.onSave} style={buttonStyle}>
          <Icon icon="info" />
          <span class="glyphicon glyphicon-floppy-disk"></span> Save
        </Button>,
        <Button key={key++} onClick={this.props.onCancel} style={buttonStyle}>
          <Icon icon="info" />
          <span class="glyphicon glyphicon-remove" ></span> Cancel
        </Button>
      );
    } else {
      if (this.props.fullscreen !== true) {
        buttons.push(
          <Button key={key++} onClick={this.props.onFullscreen} style={buttonStyle}>
            <Icon icon="info" />
            <span className="glyphicon glyphicon-resize-full"></span> Fullscreen
          </Button>
        );
      }

      if (this.props.paused) {
        buttons.push(
          <Button key={key++} onClick={this.props.onUnpause} style={buttonStyle}>
            <Icon icon="info" />
            <span className="glyphicon glyphicon-play"></span> Live
          </Button>
        );
      } else {
        buttons.push(
          <Button key={key++} onClick={this.props.onPause} style={buttonStyle}>
            <Icon icon="info" />
            <span className="glyphicon glyphicon-pause"></span> Pause
          </Button>
        );
      }

      buttons.push(
        <Button key={key++} onClick={this.props.onEdit} style={buttonStyle}>
          <Icon icon="info" />
          <span className="glyphicon glyphicon-pencil"></span> Pause
        </Button>
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
