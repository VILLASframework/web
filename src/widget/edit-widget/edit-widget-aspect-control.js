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
import { Form } from 'react-bootstrap';

class EditWidgetAspectControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {}
    };
  }

  static getDerivedStateFromProps(props, state){
    return{
      widget: props.widget
    };
  }

  render() {
    let parts = this.props.controlId.split('.');
    let isCustomProperty = true;
    if (parts.length === 1){
      isCustomProperty = false;
    }

    return (
      <Form.Group>
        <Form.Check
          type='checkbox'
          id={this.props.controlId}
          checked={isCustomProperty ?  this.state.widget[parts[0]][parts[1]] : this.state.widget[this.props.controlId]}
          label={"Lock Aspect Ratio"}
          onChange={e => this.props.handleChange(e)}
        />
      </Form.Group>
    );
  }
}

export default EditWidgetAspectControl;
