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

import Icon from '../common/icon';


class IconButton extends React.Component {

  render() {
    const altButtonStyle = {
      marginLeft: '10px',
    }

    const iconStyle = {
      height: '30px',
      width: '30px'
    }

    return <OverlayTrigger
      key={this.props.ikey}
      placement={'top'}
      overlay={<Tooltip id={`tooltip-${"add"}`}>{this.props.tooltip}</Tooltip>} >
      <Button
        variant='light'
        onClick={this.props.onClick}
        style={altButtonStyle}
      >
        <Icon
          icon={this.props.icon}
          classname={'icon-color'}
          style={iconStyle}
        />
      </Button>
    </OverlayTrigger>
  }
}

export default IconButton;
