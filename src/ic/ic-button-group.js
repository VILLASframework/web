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
import IconButton from '../common/buttons/icon-button';
import IconToggleButton from '../common/buttons/icon-toggle-button';


const buttonStyle = {
  marginLeft: '12px',
  height: '44px',
  width: '35px',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'inline-flex'
};

const iconStyle = {
  height: '20px',
  width: '20px'
}

let buttonkey = 0;

class ICButtonGroup extends React.Component {

  getBtn(icon, tooltip, clickFn, disabled = false) {
    return <IconButton
      key={buttonkey++}
      childKey={buttonkey++}
      icon={icon}
      disabled={disabled}
      tooltip={tooltip}
      tipPlacement={'bottom'}
      onClick={clickFn}
      buttonStyle={buttonStyle}
      iconStyle={iconStyle}
    />
  }

  getToggleBtn(checkedIcon, uncheckedIcon, tooltipChecked, tooltipUnchecked, clickFn, checked = false, disabled = false) {
    return <IconToggleButton
      index={buttonkey++}
      childKey={buttonkey++}
      key={buttonkey++}
      checked={checked}
      checkedIcon={checkedIcon}
      uncheckedIcon={uncheckedIcon}
      tooltipChecked={tooltipChecked}
      tooltipUnchecked={tooltipUnchecked}
      disabled={disabled}
      buttonStyle={buttonStyle}
      iconStyle={iconStyle}
      onChange={clickFn}
    />
  }

  render() {
    const buttons = [];
    buttonkey = 0;
    let disabled = this.props.disabled ? this.props.disabled : false;

    if (this.props.onReset) {
      buttons.push(this.getBtn("undo", "Reset", this.props.onReset, disabled));
    }

    if (this.props.onRecreate) {
      buttons.push(this.getBtn("redo", "Recreate", this.props.onRecreate, disabled));
    }

    if (this.props.onShutdown) {
      buttons.push(this.getBtn("power-off", "Shutdown", this.props.onShutdown, disabled));
    }

    if (this.props.onDelete) {
      buttons.push(this.getBtn("trash", "Delete", this.props.onDelete, disabled));
    }
    
    if (this.props.onStart) {
      buttons.push(this.getBtn("play", "Start", this.props.onStart, disabled));
    }

    if (this.props.onPauseResume) {
      buttons.push(this.getToggleBtn("pause", "pause", "click to resume", "click to pause", this.props.onPauseResume, this.props.paused, disabled));
    }

    if (this.props.onStop) {
      buttons.push(this.getBtn("stop", "Stop", this.props.onStop, disabled));
    }

    return <div className='section-buttons-group-center'>
      {buttons}
    </div>;
  }
}

ICButtonGroup.propTypes = {
  onReset: PropTypes.func,
  onShutdown: PropTypes.func,
  onDelete: PropTypes.func,
  onRecreate: PropTypes.func,
  onStart: PropTypes.func,
  onStop: PropTypes.func,
  onPauseResume: PropTypes.func
};

export default ICButtonGroup;
