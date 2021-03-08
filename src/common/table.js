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
import _ from 'lodash';
import { Table, Button, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Icon from './icon';

class CustomTable extends Component {
  constructor(props) {
    super(props);

    this.activeInput = null;

    this.state = {
      rows: CustomTable.getRows(props),
      editCell: [-1, -1]
    };
  }

  static defaultProps = {
    width: null,
    checked: true
  };

  onClick(event, row, column) {
    this.setState({ editCell: [column, row] }); // x, y
  }

  static addCell(data, index, child) {
    // add data to cell
    let content = null;

    if ('dataKeys' in child.props) {
      for (let key of child.props.dataKeys) {
        if (_.get(data, key) != null) {
          content = _.get(data, key);
          break;
        }
      }
    } else if ('data' in child.props && 'dataKey' in child.props) {
      content = new Map();
      let keys = _.get(data, child.props.dataKey);
      let filteredData = child.props.data.filter(data => keys.includes(data.id))
      filteredData.forEach(file => {
        content.set(_.get(file, 'id'), _.get(file, 'name'));
      })
    } else if ('dataKey' in child.props) {
      content = _.get(data, child.props.dataKey);
    }

    const modifier = child.props.modifier;
    if (modifier && content != null) {
      content = modifier(content, data);
    }

    let cell = [];
    if (content != null) {
      // check if cell should be a link
      const linkKey = child.props.linkKey;
      if (linkKey && data[linkKey] != null) {
        cell.push(<Link to={child.props.link + data[linkKey]}>{content}</Link>);
      } else if (child.props.clickable) {
        cell.push(<Button variant="link" onClick={() => child.props.onClick(index)}>{content}</Button>);
      } else if (linkKey === 'filebuttons') {
        content.forEach((contentvalue, contentkey) => {
          cell.push(
            <OverlayTrigger
              key={contentkey}
              placement={'bottom'}
              overlay={<Tooltip id={`tooltip-${"export"}`}>Download {contentvalue}</Tooltip>}
            >
              <Button
                variant='table-control-button'
                onClick={() => child.props.onDownload(contentkey)}
                disabled={child.props.onDownload == null}>
                {contentkey + ' '}
                <Icon icon='file-download' />
              </Button>
            </OverlayTrigger>);
        });
      } else {
        cell.push(content);
      }
    }

    // add label to content
    const labelKey = child.props.labelKey;
    if (labelKey && data[labelKey] != null) {
      let labelContent = data[labelKey];

      if (child.props.labelModifier) {
        labelContent = child.props.labelModifier(labelContent, data);
      }

      let labelStyle = child.props.labelStyle(data[labelKey], data)

      cell.push(<span>
        &nbsp;
        <Form.Label
          column={false}
          className={labelStyle}>
          {labelContent}
        </Form.Label>
      </span>
      );
    }

    if (child.props.dataIndex) {
      cell.push(index);
    }

    // add buttons
    let showEditButton = child.props.showEditButton !== null
      ? child.props.showEditButton(index)
      : true;

    if (child.props.editButton && showEditButton) {
      cell.push(
        <OverlayTrigger
          key={0}
          placement={'bottom'}
          overlay={<Tooltip id={`tooltip-${"edit"}`}> Edit </Tooltip>}
        >
          <Button
            variant='table-control-button'
            onClick={() => child.props.onEdit(index)}
            disabled={child.props.onEdit == null} >
            <Icon icon='edit' />
          </Button>
        </OverlayTrigger>
      );
    }

    if (child.props.checkbox) {
      const checkboxKey = child.props.checkboxKey;
      let isDisabled = child.props.checkboxDisabled != null
        ? child.props.checkboxDisabled(index)
        : false;

      cell.push(
        <Form.Check
          className="table-control-checkbox"
          inline
          disabled={isDisabled}
          checked={checkboxKey ? data[checkboxKey] : null}
          onChange={e => child.props.onChecked(data, e)}
        />
      );
    }

    if (child.props.exportButton) {
      cell.push(
        <OverlayTrigger
          key={1}
          placement={'bottom'}
          overlay={<Tooltip id={`tooltip-${"export"}`}> Export </Tooltip>}
        >
          <Button
            variant='table-control-button'
            onClick={() => child.props.onExport(index)}
            disabled={child.props.onExport == null}>
            <Icon icon='download' />
          </Button>
        </OverlayTrigger>
      );
    }

    if (child.props.duplicateButton) {
      cell.push(
        <OverlayTrigger
          key={2}
          placement={'bottom'}
          overlay={<Tooltip id={`tooltip-${"duplicate"}`}> Duplicate </Tooltip>} >
          <Button
            variant='table-control-button'
            onClick={() => child.props.onDuplicate(index)}
            disabled={child.props.onDuplicate == null}>
            <Icon icon='copy' />
          </Button>
        </OverlayTrigger>
      );
    }

    if (child.props.addRemoveFilesButton) {
      cell.push(
        <OverlayTrigger
          key={3}
          placement={'bottom'}
          overlay={<Tooltip id={`tooltip-${"export"}`}>Add/remove File(s)</Tooltip>} >
          <Button
            variant='table-control-button'
            onClick={() => child.props.onAddRemove(index)}
            disabled={child.props.onAddRemove == null}>
            <Icon icon='file' />
          </Button>
        </OverlayTrigger>
      );
    }

    if (child.props.downloadAllButton) {
      cell.push(
        <OverlayTrigger
          key={4}
          placement={'bottom'}
          overlay={<Tooltip id={`tooltip-${"export"}`}>Download All Files</Tooltip>} >
          <Button
            variant='table-control-button'
            onClick={() => child.props.onDownloadAll(index)}
            disabled={child.props.onDownloadAll == null}>
            <Icon icon='file-download' />
          </Button>
        </OverlayTrigger>
      );
    }

    let showDeleteButton = child.props.showDeleteButton !== null
      ? child.props.showDeleteButton(index)
      : true;

    if (child.props.deleteButton && showDeleteButton) {
      cell.push(
        <OverlayTrigger
          key={5}
          placement={'bottom'}
          overlay={<Tooltip id={`tooltip-${"delete"}`}> Delete </Tooltip>} >
          <Button
            variant='table-control-button'
            onClick={() => child.props.onDelete(index)}
            disabled={child.props.onDelete == null}>
            <Icon icon='trash' />
          </Button>
        </OverlayTrigger>
      );
    }

    return cell;
  } // addCell

  static getDerivedStateFromProps(props, state) {
    const rows = CustomTable.getRows(props);

    return { rows };
  }

  componentDidUpdate() {
    // A cell will not be selected at initial render, hence no need to call this in 'componentDidMount'
    if (this.activeInput) {
      this.activeInput.focus();
    }
  }

  onCellFocus(index) {
    // When a cell focus is detected, update the current state in order to uncover the input element
    this.setState({ editCell: [index.cell, index.row] });
  }

  cellLostFocus() {
    // Reset cell selection state
    this.setState({ editCell: [-1, -1] });
  }

  static getRows(props) {
    if (props.data == null) {
      return [];
    }

    return props.data.map((data, index) => {
      // check if multiple columns
      if (Array.isArray(props.children) === false) {
        // table only has a single column
        return [CustomTable.addCell(data, index, props.children)];
      }

      const row = [];

      for (let child of props.children) {
        row.push(CustomTable.addCell(data, index, child));
      }

      return row;
    });
  }

  render() {
    // get children
    let children = this.props.children;
    if (Array.isArray(this.props.children) === false) {
      children = [children];
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
            this.state.rows.map((row, rowIndex) =>
              <tr key={rowIndex}>
                {
                  row.map((cell, cellIndex) => {

                    let isCellInlineEditable = children[cellIndex].props.inlineEditable === true;
                    let tabIndex = isCellInlineEditable ? 0 : -1;
                    let evtHdls = isCellInlineEditable ? {
                      onCellClick: (event) => this.onClick(event, rowIndex, cellIndex),
                      onCellFocus: () => this.onCellFocus({ cell: cellIndex, row: rowIndex }),
                      onCellBlur: () => this.cellLostFocus()
                    } : {
                      onCellClick: () => { },
                      onCellFocus: () => { },
                      onCellBlur: () => { }
                    };

                    return <td
                      key={cellIndex}
                      tabIndex={tabIndex}
                      onClick={evtHdls.onCellClick}
                      onFocus={evtHdls.onCellFocus}
                      onBlur={evtHdls.onCellBlur}
                    >
                      {(this.state.editCell[0] === cellIndex && this.state.editCell[1] === rowIndex) ?
                        <Form.Control
                          as='input'
                          type={children[cellIndex].props.inputType}
                          value={cell}
                          onChange={(event) => children[cellIndex].props.onInlineChange(event, rowIndex, cellIndex)}
                          ref={ref => { this.activeInput = ref; }} />
                      : <span>
                          {
                            cell.map((element, elementIndex) =>
                              <span key={elementIndex}>{element}</span>
                            )
                          }
                        </span>
                        }
                    </td>
                  })
                }
              </tr>)
          }
        </tbody>
      </Table>
    );
  }
}

export default CustomTable;
