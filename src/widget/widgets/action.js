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

import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import Icon from '../../common/icon';

class WidgetAction extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  onClick(e) {

  }

  render() {
    return <ButtonGroup>
            <Button onClick={this.onClick} ><Icon icon="play" /> Start</Button>
            <Button onClick={this.onClick} ><Icon icon="pause" /> Pause</Button>
            <Button onClick={this.onClick} ><Icon icon="stop" /> Stop</Button>
          </ButtonGroup>;
  }
}

export default WidgetAction;
