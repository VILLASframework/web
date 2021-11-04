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

class EditWidgetCheckboxList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedIDs: [],
    }
  }

  static getDerivedStateFromProps(props) {
    return {
      checkedIDs: props.widget.customProperties.checkedIDs
    };
  }

  handleCheckboxChange(e){
    let checkedIDs = this.props.widget.customProperties.checkedIDs
    let currentID = parseInt(e.target.id, 10)
    let index = checkedIDs.indexOf(currentID)
    if (index === -1) {
      checkedIDs.push(currentID)  
    } else {
      checkedIDs.splice(index, 1)
    }
    this.props.handleChange({target: { id: this.props.controlId, value: checkedIDs} })
  }

  render() {

    let checkboxList = []
    if (this.props.list) {
      this.props.list.forEach((item) => {
        checkboxList.push(<Form.Check
          type={"checkbox"}
          id={item.id}
          key={item.id}
          label={item.name}
          defaultChecked={this.state.checkedIDs.includes(parseInt(item.id, 10))}
          onChange={e => this.handleCheckboxChange(e)}
          />)
      })
    }

    return <Form.Group style={this.props.style}>
      <Form.Label>{this.props.label}</Form.Label>
      {checkboxList}
    </Form.Group>;
  }
}

export default EditWidgetCheckboxList;
