/**
 * File: node-tree.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2017
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

import React from 'react';
import SortableTree from 'react-sortable-tree';
import { Button, Glyphicon } from 'react-bootstrap';

class NodeTree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: []
    };
  }

  canNodeDrag(node, path) {
    return (node.parentNode != null);
  }

  canNodeDrop(node, prevPath) {
    return (node.nextParent != null);
  }

  generateNodeProps(rowInfo) {
    var buttons = [];

    if (rowInfo.parentNode == null) {
      buttons.push(<Button bsSize="small" onClick={() => this.props.onNodeAdd(rowInfo.node)}><Glyphicon glyph="plus" /></Button>);
      buttons.push(<Button bsSize="small" onClick={() => this.props.onNodeEdit(rowInfo.node)}><Glyphicon glyph="pencil" /></Button>);
      buttons.push(<Button bsSize="small" onClick={() => this.props.onNodeDelete(rowInfo.node)}><Glyphicon glyph="trash" /></Button>);
    } else {
      buttons.push(<Button bsSize="small" onClick={() => this.props.onSimulatorEdit(rowInfo.node)}><Glyphicon glyph="pencil" /></Button>);
      buttons.push(<Button bsSize="small" onClick={() => this.props.onSimulatorDelete(rowInfo.node)}><Glyphicon glyph="trash" /></Button>);
    }

    console.log(rowInfo);

    return {
      buttons: buttons
    };
  }

  componentWillReceiveProps(nextProps) {
    // compare if data changed
    if (this.props.data == null || this.props.data !== nextProps.data) {
      // generate new state
      var treeData = [];

      nextProps.data.forEach((node) => {
        var parent = { title: node.name, subtitle: node.endpoint, id: node._id, children: [], expanded: true };

        node.simulators.forEach((simulator) => {
          parent.children.push({ title: simulator.name });
        });

        treeData.push(parent);
      });

      this.setState({ treeData });
    }
  }

  render() {
    return (
      <SortableTree
        treeData={ this.state.treeData }
        onChange={ (treeData) => this.setState({ treeData }) }
        style={{ height: 400 }}
        maxDepth={ 2 }
        canDrag={ (node, path) => this.canNodeDrag(node, path) }
        canDrop={ (node, prevPath) => this.canNodeDrop(node, prevPath) }
        generateNodeProps={(rowInfo) => this.generateNodeProps(rowInfo) }
      />
    );
  }
}

export default NodeTree;
