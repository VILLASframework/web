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

import { ToggleButton, ButtonGroup, Tooltip, OverlayTrigger } from 'react-bootstrap';

import Icon from './icon';


class IconToggleButton extends React.Component {

  render() {
    const altButtonStyle = {
      marginLeft: '10px',
    }

    return <OverlayTrigger
      key={this.props.ikey}
      placement={'top'}
      overlay={
        <Tooltip id={`tooltip-${"add"}`}>
          {this.props.checked ?
            this.props.tooltipChecked
            :
            this.props.tooltipUnchecked
          }
        </Tooltip>} >
      <ButtonGroup toggle>
        <ToggleButton
          variant='light'
          type='checkbox'
          onChange={this.props.onChange}
          style={altButtonStyle}
          disabled={this.props.disabled}
          checked={this.props.checked}
        >
          {this.props.checked ?
            <Icon
              icon={this.props.checkedIcon}
              classname={'icon-color'}
            />
            :
            <Icon
              icon={this.props.uncheckedIcon}
              classname={'icon-color'}
            />
          }
        </ToggleButton>
      </ButtonGroup>
    </OverlayTrigger>
  }
}

export default IconToggleButton;
