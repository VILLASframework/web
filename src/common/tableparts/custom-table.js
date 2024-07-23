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
import { Table, Button, Form, Tooltip, OverlayTrigger, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Icon from '../icon';
import IconToggleButton from '../buttons/icon-toggle-button';
import IconButton from '../buttons/icon-button';


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
        // check whether empty <></> object has been given
        if (Object.keys(child.props).length !== 0) {
          row.push(CustomTable.addCell(data, index, child));
        }
      }

      return row;
    });
  }

  static addCell(data, index, child) {
    switch (child.props.columnType) {
      case 'data':
        return this.addDataCell(data, child);
      case 'label':
        return this.addLabelCell(data, child);
      case 'checkbox':
        return this.addCheckbox(data, index, child)
      case 'button':
        return this.addButtonCell(data, index, child)
      case 'link':
        return this.addLinkCell(data, child);
      case 'linkButton':
        return this.addLinkButtonCell(data, child);
      default:
        return [];
    }
  }

  static addDataCell(data, child) {
    let content = null;

    if ('dataKeys' in child.props) {
      for (let key of child.props.dataKeys) {
        if (_.get(data, key) != null) {
          content = _.get(data, key);
          break;
        }
      }
    } else if ('dataKey' in child.props) {
      content = _.get(data, child.props.dataKey)
    }

    const modifier = child.props.modifier;
    if (modifier && content != null) {
      content = modifier(content, data);
    }

    let cell = [];
    if (content != null) {
      cell.push(content);
    }

    return cell;
  }

  static addLabelCell(data, child) {
    let cell = [];
    const labelKey = child.props.labelKey;
    if (labelKey && data[labelKey] != null) {
      let labelContent = data[labelKey];
      let labelStyle = child.props.labelStyle(data[labelKey], data)

      cell.push(<span>
        &nbsp;
        <Badge
          bg={labelStyle[0]}
          className={labelStyle[1]}>
          {labelContent}
        </Badge>
      </span>
      );
    }

    return cell;
  }

  static addCheckbox(data, index, child) {
    let isDisabled = child.props.checkboxDisabled != null
      ? child.props.checkboxDisabled(index)
      : false;

    let cell = [];
    cell.push(
      <Form.Check
        key={data.id+'_'+data.createdAt}
        className='table-control-checkbox'
        disabled={isDisabled}
        checked={typeof child.props.checked !== 'undefined' ? child.props.checked(data) : null}
        onChange={e => child.props.onChecked(data, e)}
      />
    );

    return cell;
  }

  static addLinkButtonCell(data, child) {
    // currently only used for file buttons
    let content = null;

    if ('data' in child.props && 'dataKey' in child.props) {
      content = new Map();
      let keys = _.get(data, child.props.dataKey);
      if (keys != null) {
        let filteredData = child.props.data.filter(data => keys.includes(data.id))
        filteredData.forEach(file => {
          content.set(_.get(file, 'id'), _.get(file, 'name'));
        })
      }
    }

    let cell = [];
    if (content != null) {
      const linkKey = child.props.linkKey;
      content.forEach((contentvalue, contentkey) => {
        cell.push(
          <OverlayTrigger
            key={contentkey}
            placement={'bottom'}
            overlay={<Tooltip id={`tooltip-${"export"}`}>Download {contentvalue}</Tooltip>}
          >
            <span>
              <Button
                variant='table-control-button'
                onClick={() => child.props.onDownload(contentkey)}
                disabled={child.props.onDownload == null}>
                {contentkey + ' '}
                <Icon icon='file-download' classname={'icon-color'} />
              </Button>
            </span>
          </OverlayTrigger>);
      });
    }

    return cell;
  }

  static addLinkCell(data, child) {
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

    let cell = [];
    if (content != null) {
      const linkKey = child.props.linkKey;
      if (linkKey && data[linkKey] != null) {
        cell.push(<Link to={child.props.link + data[linkKey]}>{content}</Link>);
      }
    }

    return cell;
  }

  static getBtn(childkey, icon, tooltip, index, onClick, isLocked) {
    return <IconButton
      key={childkey++}
      childKey={childkey++}
      icon={icon}
      tooltip={tooltip}
      tipPlacement={'bottom'}
      disabled={onClick == null || isLocked}
      hidetooltip={isLocked}
      onClick={() => onClick(index)}
      variant={'table-control-button'}
    />
  }

  static addButtonCell(data, index, child) {
    let cell = [];
    if ('dataKey' in child.props) {
      let content = _.get(data, child.props.dataKey);

      const modifier = child.props.modifier;
      if (modifier && content != null) {
        content = modifier(content, data);
        cell.push(content)
      }
    }

    let childkey = 0;
    let isLocked = child.props.locked || (child.props.isLocked != null && child.props.isLocked(index));

    if (child.props.lockButton) {
      cell.push(
        <IconToggleButton
          childKey={childkey++}
          index={data.id}
          onChange={() => child.props.onChangeLock(index)}
          checked={isLocked}
          checkedIcon='lock'
          uncheckedIcon='lock-open'
          tooltipChecked='Scenario is locked, cannot be edited'
          tooltipUnchecked='Scenario is unlocked, can be edited'
          disabled={false}
          variant={'table-control-button'}
        />
      );
    }

    let showEditButton = child.props.showEditButton !== null && child.props.showEditButton !== undefined
      ? child.props.showEditButton(index)
      : true;
    if (child.props.editButton && showEditButton) {
      cell.push(this.getBtn(childkey, 'edit', 'Edit', index, child.props.onEdit, isLocked))
    }

    if (child.props.exportButton) {
      cell.push(this.getBtn(childkey, 'download', 'Export', index, child.props.onExport))
    }

    if (child.props.signalButton) {
      cell.push(this.getBtn(childkey, 'wave-square', 'Autoconfigure Signals', index, child.props.onAutoConf, isLocked))
    }

    if (child.props.duplicateButton) {
      cell.push(this.getBtn(childkey, 'copy', 'Duplicate', index, child.props.onDuplicate, isLocked))
    }

    if (child.props.addRemoveFilesButton) {
      cell.push(this.getBtn(childkey, 'file', 'Add/remove File(s)', index, child.props.onAddRemove, isLocked))
    }

    if (child.props.pythonResultsButton) {
      let icon = ['fab', 'python']
      cell.push(this.getBtn(childkey, icon, 'Get Python code', index, child.props.onPythonResults))
    }

    if (child.props.downloadAllButton) {
      cell.push(this.getBtn(childkey, 'file-download', 'Download All Files', index, child.props.onDownloadAll))
    }

    let showDeleteButton = child.props.showDeleteButton !== null && child.props.showDeleteButton !== undefined
      ? child.props.showDeleteButton(index)
      : true;

    if (child.props.deleteButton && showDeleteButton) {
      cell.push(this.getBtn(childkey, 'trash', 'Delete', index, child.props.onDelete, isLocked))
    }

    return cell;
  }

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

  render() {
    // get children
    let children = this.props.children;
    if (Array.isArray(this.props.children) === false) {
      children = [children];
    }

    let tbodyStyle = this.props.breakWord ? { wordBreak: 'break-all' } : {};

    return (
      <Table style={{ width: this.props.width }} striped hover>
        <thead style={{ backgroundColor: '#527984', color: '#fff' }}>
          <tr>
            {this.props.children}
          </tr>
        </thead>
        <tbody style={tbodyStyle}>
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
                    let cellStyle = {
                      textAlign: children[cellIndex].props.align
                    };

                    return <td
                      key={cellIndex}
                      style={cellStyle}
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