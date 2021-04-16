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
import IconButton from '../common/icon-button';

const buttonStyle = {
  marginLeft: '12px',
  height: '44px',
  width: '35px',
};

const iconStyle = {
  height: '25px',
  width: '25px'
}

let buttonkey = 0;

class DashboardButtonGroup extends React.Component {

  getBtn(icon, tooltip, clickFn, locked = false) {
    if (locked) {
      return <IconButton
        key={buttonkey++}
        ikey={buttonkey}
        icon={icon}
        disabled={true}
        hidetooltip={true}
        tooltip={tooltip}
        tipPlacement={'bottom'}
        onClick={clickFn}
        buttonStyle={buttonStyle}
        iconStyle={iconStyle}
      />
    } else {
      return <IconButton
        key={buttonkey++}
        ikey={buttonkey}
        icon={icon}
        tooltip={tooltip}
        tipPlacement={'bottom'}
        onClick={clickFn}
        buttonStyle={buttonStyle}
        iconStyle={iconStyle}
      />
    }
  }

  render() {
    const buttons = [];
    buttonkey = 0;

    if (this.props.editing) {
      buttons.push(this.getBtn("save", "Save changes", this.props.onSave));
      buttons.push(this.getBtn("times", "Discard changes", this.props.onCancel));
    } else {
      if (this.props.fullscreen !== true) {
        buttons.push(this.getBtn("expand", "Change to fullscreen view", this.props.onFullscreen));
      } else {
        buttons.push(this.getBtn("compress", "Back to normal view", this.props.onFullscreen));
      }

      if (this.props.paused) {
        buttons.push(this.getBtn("play", "Continue simulation", this.props.onUnpause));
      } else {
        buttons.push(this.getBtn("pause", "Pause simulation", this.props.onPause));
      }

      if (this.props.fullscreen !== true) {
        let tooltip = this.props.locked ? "View files of scenario" : "Add, edit or delete files of scenario";
        buttons.push(this.getBtn("file", tooltip, this.props.onEditFiles));
        buttons.push(this.getBtn("sign-in-alt", "Add, edit or delete input signals", this.props.onEditInputSignals, this.props.locked));
        buttons.push(this.getBtn("sign-out-alt", "Add, edit or delete output signals", this.props.onEditOutputSignals, this.props.locked));
        buttons.push(this.getBtn("pen", "Add widgets and edit layout", this.props.onEdit, this.props.locked));
      }
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
