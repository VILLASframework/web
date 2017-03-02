/**
 * File: table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

class ControlTable extends Component {
  render() {
    // create sorted rows
    var rows = this.props.data.map(row => {
      // add cells by column keys
      var rowArray = [ row._id ];

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
            <th width="70px"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.filter((element, index) => {
                return index !== 0;
              }).map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
              <td>
                <Button bsClass="table-control-button" onClick={() => this.props.onEdit(row[0])}><Glyphicon glyph="pencil" /></Button>
                <Button bsClass="table-control-button" onClick={() => this.props.onDelete(row[0])}><Glyphicon glyph="remove" /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default ControlTable;
