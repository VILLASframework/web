/**
 * File: table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';

class Table extends Component {
  render() {
    // create sorted rows
    var rows = this.props.data.map(row => {
      // add cells by column keys
      var rowArray = [];

      for (var i = 0; i < this.props.columns.length; i++) {
        if (row[this.props.columns[i].key] != null) {
          rowArray.push(row[this.props.columns[i].key].toString());
        } else {
          rowArray.push("");
        }
      }

      return rowArray;
    });

    return (
      <table width={this.props.width} className="table">
        <thead>
          <tr>
            {this.props.columns.map(column => (
              <th key={column.key} width={column.width}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default Table;
