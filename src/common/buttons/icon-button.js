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

import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';

import Icon from '../icon';


class IconButton extends React.Component {

  render() {
    let btn = <Button
      variant={this.props.variant ? this.props.variant : 'light'}
      disabled={this.props.disabled}
      onClick={this.props.onClick}
      style={this.props.buttonStyle}
    >
      <Icon
        icon={this.props.icon}
        classname={'icon-color'}
        style={this.props.iconStyle}
      />
    </Button>

    let button;
    if (!this.props.tooltip || this.props.hidetooltip) {
      button = btn;
    } else {
      button = <OverlayTrigger
        key={this.props.childKey}
        placement={this.props.tipPlacement ? this.props.tipPlacement : 'top'}
        overlay={<Tooltip id={`tooltip-${this.props.childKey}`}>{this.props.tooltip}</Tooltip>} >
       {btn}
      </OverlayTrigger>
    }

    return button;
  }
}

export default IconButton;
