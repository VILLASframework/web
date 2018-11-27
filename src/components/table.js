/**
 * File: table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 02.03.2017
 *
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
import _ from 'lodash';
import { Table, Button, FormControl, Label, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Icon from './icon';

class CustomTable extends Component {
  constructor(props) {
    super(props);

    this.activeInput = null;

    this.state = {
      rows: this.getRows(props),
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
    let content = null;

    if ('dataKeys' in child.props) {
      for (let key of child.props.dataKeys) {
        if (_.get(data, key) != null) {
          content = _.get(data, key);
          break;
        }
      }
    } else if ('dataKey' in child.props) {
      content = _.get(data, child.props.dataKey);
    }

    const modifier = child.props.modifier;
    if (modifier && content != null) {
      content = modifier(content);
    }

    let cell = [];
    if (content != null) {
      content = content.toString();

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

    // add label to content
    const labelKey = child.props.labelKey;
    if (labelKey && data[labelKey] != null) {
      var labelContent = data[labelKey];

      if (child.props.labelModifier) {
        labelContent = child.props.labelModifier(labelContent, data);
      }

      cell.push(<span>&nbsp;<Label bsClass={child.props.labelStyle(data[labelKey], data)}>{labelContent.toString()}</Label></span>);
    }

    if (child.props.dataIndex) {
      cell.push(index);
    }

    // add buttons
    if (child.props.editButton) {
      cell.push(<Button bsClass='table-control-button' onClick={() => child.props.onEdit(index)} disabled={child.props.onEdit == null}><Icon icon='edit' /></Button>);
    }

    if (child.props.deleteButton) {
      cell.push(<Button bsClass='table-control-button' onClick={() => child.props.onDelete(index)} disabled={child.props.onDelete == null}><Icon icon='trash' /></Button>);
    }

    if (child.props.checkbox) {
      const checkboxKey = this.props.checkboxKey;

      cell.push(<Checkbox className="table-control-checkbox" inline checked={checkboxKey ? data[checkboxKey] : null} onChange={e => child.props.onChecked(index, e)} />);
    }

    if (child.props.exportButton) {
      cell.push(<Button bsClass='table-control-button' onClick={() => child.props.onExport(index)} disabled={child.props.onExport == null}><Icon icon='download' /></Button>);
    }

    return cell;
  }

  componentWillReceiveProps(nextProps) {
    const rows = this.getRows(nextProps);

    this.setState({ rows });
  }

  componentDidUpdate() {
    // A cell will not be selected at initial render, hence no need to call this in 'componentDidMount'
    if (this.activeInput) {
      this.activeInput.focus();
    }
  }

  onCellFocus(index) {
    // When a cell focus is detected, update the current state in order to uncover the input element
    this.setState({ editCell: [ index.cell, index.row ]});
  }

  cellLostFocus() {
    // Reset cell selection state
    this.setState({ editCell: [ -1, -1 ] });
  }

  getRows(props) {
    if (props.data == null) {
      return [];
    }

    return props.data.map((data, index) => {
      // check if multiple columns
      if (Array.isArray(props.children) === false) {
        // table only has a single column
        return [ this.addCell(data, index, props.children) ];
      }

      const row = [];

      for (let child of props.children) {
        row.push(this.addCell(data, index, child));
      }

      return row;
    });
  }

  render() {
    // get children
    let children = this.props.children;
    if (Array.isArray(this.props.children) === false) {
      children = [ children ];
    }

    return (
      <Table style={{ width: this.props.width }} striped hover>
        <thead>
          <tr>
            {this.props.children}
          </tr>
        </thead>
        <tbody>
          {
            this.state.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {
                  row.map((cell, cellIndex) => {

                    let isCellInlineEditable = children[cellIndex].props.inlineEditable === true;

                    let tabIndex = isCellInlineEditable? 0 : -1;

                    let evtHdls = isCellInlineEditable ? {
                      onCellClick: (event) => this.onClick(event, rowIndex, cellIndex),
                      onCellFocus: () => this.onCellFocus({cell: cellIndex, row: rowIndex}),
                      onCellBlur: () => this.cellLostFocus()
                    } : {
                      onCellClick: () => {},
                      onCellFocus: () => {},
                      onCellBlur: () => {}
                    };

                    return (<td key={cellIndex} tabIndex={tabIndex} onClick={ evtHdls.onCellClick } onFocus={ evtHdls.onCellFocus } onBlur={ evtHdls.onCellBlur }>
                      {(this.state.editCell[0] === cellIndex && this.state.editCell[1] === rowIndex ) ? (
                        <FormControl type="text" value={cell} onChange={(event) => children[cellIndex].props.onInlineChange(event, rowIndex, cellIndex)} inputRef={ref => { this.activeInput = ref; }} />
                      ) : (
                        <span>
                          {cell.map((element, elementIndex) => (
                            <span key={elementIndex}>{element}</span>
                          ))}
                        </span>
                      )}
                    </td>)
                  })
                }
              </tr>))
          }
        </tbody>
      </Table>
    );
  }
}

export default CustomTable;
