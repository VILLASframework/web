/**
 * File: table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Table, Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

import TableColumn from './table-column';

class CustomTable extends Component {
  static defaultProps = {
    width: null
  };

  render() {
    // create sorted data for rows
    var rows = [];
    if (this.props.data) {
      rows = this.props.data.map((row, index) => {
        var array = [];

        for (var i = 0; i < this.props.children.length; i++) {
          // only handle table-column children
          if (this.props.children[i].type === TableColumn) {
            // add content to cell
            var cell = [];

            // add data to cell
            const dataKey = this.props.children[i].props.dataKey;
            if (dataKey && row[dataKey] != null) {
              // get content
              var content;
              const modifier = this.props.children[i].props.modifier;

              if (modifier) {
                content = modifier(row[dataKey]);
              } else {
                content = row[dataKey].toString();
              }

              // check if cell should be a link
              const linkKey = this.props.children[i].props.linkKey;
              if (linkKey && row[linkKey] != null) {
                cell.push(<Link to={this.props.children[i].props.link + row[linkKey]}>{content}</Link>);
              } else {
                cell.push(content);
              }
            }

            // add buttons
            if (this.props.children[i].props.editButton) {
              const onEdit = this.props.children[i].props.onEdit;
              cell.push(<Button bsClass='table-control-button' onClick={() => onEdit(index)}><Glyphicon glyph='pencil' /></Button>);
            }

            if (this.props.children[i].props.deleteButton) {
              const onDelete = this.props.children[i].props.onDelete;
              cell.push(<Button bsClass='table-control-button' onClick={() => onDelete(index)}><Glyphicon glyph='remove' /></Button>);
            }

            array.push(cell);
          }
        }

        return array;
      });
    }

    return (
      <Table width={this.props.width} striped hover>
        <thead>
          <tr>
            {this.props.children}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index}>
                  {cell.map((element, index) => (
                    <span key={index}>{element}</span>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default CustomTable;
