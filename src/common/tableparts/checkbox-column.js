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
import { Form } from 'react-bootstrap';
import TableColumn from './table-column';


class CheckboxColumn extends Component {
  static defaultProps = {
    columnType: 'checkbox',
    checkboxDisabled: null,
    enableCheckAll: false,
  };

  render() {
    let style = {
      textAlign: this.props.align,
      width: this.props.width
    };

    if (this.props.enableCheckAll) {
      return <th style={style}>
        <Form.Check
          className="table-control-checkbox"
          checked={this.props.allChecked}
          onChange={(e) => this.props.onCheckAll(e)}
        />
      </th>;

    }
    return <TableColumn
      align={this.props.align}
      width={this.props.width}
      title={this.props.title}
    />;
  }
}

export default CheckboxColumn;
