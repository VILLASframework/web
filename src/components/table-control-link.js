/**
 * File: table-control-link.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

class ControlLinkTable extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    linkRoot: PropTypes.string.isRequired
  };

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
                <td key={index}>
                  {index === 0 ? (
                    <Link to={this.props.linkRoot + '/' + row[0]}>{cell}</Link>
                  ) : (
                    {cell}
                  )}
                </td>
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

export default ControlLinkTable;
