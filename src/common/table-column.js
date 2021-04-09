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

class TableColumn extends Component {
  static defaultProps = {
    title: '',
    modifier: null,
    width: null,
    editButton: false,
    showEditButton: null,
    deleteButton: false,
    showDeleteButton: null,
    exportButton: false,
    duplicateButton: false,
    isLocked: null,
    locked: false,
    link: '/',
    linkKey: '',
    dataIndex: false,
    inlineEditable: false,
    inputType: 'text',
    clickable: false,
    labelKey: null,
    checkbox: false,
    checkboxKey: '',
    checkboxDisabled: null,
    labelStyle: null,
    labelModifier: null,
    align: 'left'
  };

  render() {
    let style = {
      textAlign: this.props.align,
      width: this.props.width
    };

    return <th style={style}>
      {this.props.title}
    </th>;
  }
}

export default TableColumn;
