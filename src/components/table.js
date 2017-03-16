/**
 * File: table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Table, Button, Glyphicon, FormControl } from 'react-bootstrap';
import { Link } from 'react-router';

//import TableColumn from './table-column';

class CustomTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      editCell: [ -1, -1 ]
    };
  }

  static defaultProps = {
    width: null
  };

  onClick(event, row, column) {
    this.setState({ editCell: [ column, row ]});  // x, y
  }

  addCell(data, index, child) {
    // add data to cell
    const dataKey = child.props.dataKey;
    var cell = [];

    if (dataKey && data[dataKey] != null) {
      // get content
      var content;
      const modifier = child.props.modifier;

      if (modifier) {
        content = modifier(data[dataKey]);
      } else {
        content = data[dataKey].toString();
      }

      // check if cell should be a link
      const linkKey = child.props.linkKey;
      if (linkKey && data[linkKey] != null) {
        cell.push(<Link to={child.props.link + data[linkKey]}>{content}</Link>);
      } else if (child.props.clickable) {
        cell.push(<a onClick={() => child.props.onClick(index)}>{content}</a>);
      } else {
        cell.push(content);
      }
    }

    if (child.props.dataIndex) {
      cell.push(index);
    }

    // add buttons
    if (child.props.editButton) {
      cell.push(<Button bsClass='table-control-button' onClick={() => child.props.onEdit(index)}><Glyphicon glyph='pencil' /></Button>);
    }

    if (child.props.deleteButton) {
      cell.push(<Button bsClass='table-control-button' onClick={() => child.props.onDelete(index)}><Glyphicon glyph='remove' /></Button>);
    }

    return cell;
  }

  componentWillReceiveProps(nextProps) {
    // check if data exists
    if (nextProps.data == null) {
      this.setState({ rows: [] });
      return;
    }

    // create row data
    var rows = nextProps.data.map((data, index) => {
      // check if multiple columns
      if (Array.isArray(nextProps.children)) {
        var row = [];

        nextProps.children.forEach(child => {
          row.push(this.addCell(data, index, child));
        });

        return row;
      } else {
        // table only has a single column
        return [ this.addCell(data, index, nextProps.children) ];
      }
    });

    this.setState({ rows: rows });
  }

  render() {
    // get children
    var children = this.props.children;
    if (Array.isArray(this.props.children) === false) {
      children = [ children ];
    }

    return (
      <Table style={{ width: this.props.width}} striped hover bordered>
        <thead>
          <tr>
            {this.props.children}
          </tr>
        </thead>
        <tbody>
          {this.state.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} onClick={children[cellIndex].props.inlineEditable === true ? (event) => this.onClick(event, rowIndex, cellIndex) : () => {}}>
                  {(this.state.editCell[0] === cellIndex && this.state.editCell[1] === rowIndex ) ? (
                    <FormControl type="text" value={cell} onChange={(event) => children[cellIndex].props.onInlineChange(event, rowIndex, cellIndex)} />
                  ) : (
                    <span>
                      {cell.map((element, elementIndex) => (
                        <span key={elementIndex}>{element}</span>
                      ))}
                    </span>
                  )}
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
