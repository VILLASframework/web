/**
 * File: table-column.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 06.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';

class TableColumn extends Component {
  static defaultProps = {
    title: '',
    modifier: null,
    width: null,
    editButton: false,
    deleteButton: false,
    link: '/',
    linkKey: ''
  };

  render() {
    return (
      <th width={this.props.width}>
        {this.props.title}
      </th>
    );
  }
}

export default TableColumn;
