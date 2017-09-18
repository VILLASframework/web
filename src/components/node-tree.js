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
      buttons.push(<Button bsSize="small" onClick={() => this.props.onNodeExport(rowInfo.node)}><Glyphicon glyph="export" /></Button>);
    } else {
      // get child index
      var index = rowInfo.path[1] - rowInfo.path[0] - 1;

      buttons.push(<Button bsSize="small" onClick={() => this.props.onSimulatorEdit(rowInfo.parentNode, index)}><Glyphicon glyph="pencil" /></Button>);
      buttons.push(<Button bsSize="small" onClick={() => this.props.onSimulatorDelete(rowInfo.parentNode, index)}><Glyphicon glyph="trash" /></Button>);
    }

    return {
      buttons: buttons
    };
  }

  nodesToTreeData(nodes) {
    var treeData = [];

    nodes.forEach((node) => {
      var parent = { title: node.name, subtitle: node.endpoint, id: node._id, config: node.config, children: [], expanded: true };

      node.simulators.forEach((simulator) => {
        parent.children.push({ title: simulator.name, subtitle: simulator.id != null ? 'Online' : 'Offline' });
      });

      treeData.push(parent);
    });

    return treeData;
  }

  treeDataToNodes(treeData) {
    var nodes = [];

    treeData.forEach((data) => {
      var node = { name: data.title, endpoint: data.subtitle, _id: data.id, config: data.config, simulators: [] };

      data.children.forEach((child) => {
        node.simulators.push({ name: child.title });
      });

      nodes.push(node);
    });

    return nodes;
  }

  componentWillReceiveProps(nextProps) {
    // compare if data changed
    if (this.props.data == null || this.props.data !== nextProps.data) {
      // generate new state
      var treeData = this.nodesToTreeData(nextProps.data);
      this.setState({ treeData });
    }
  }

  onDataChange(treeData) {
    this.setState({ treeData });

    this.props.onDataChange(this.treeDataToNodes(treeData))
  }

  render() {
    return (
      <SortableTree
        treeData={this.state.treeData}
        onChange={(treeData) => this.onDataChange(treeData)}
        style={{ height: 400 }}
        maxDepth={ 2 }
        canDrag={(node, path) => this.canNodeDrag(node, path)}
        canDrop={(node, prevPath) => this.canNodeDrop(node, prevPath)}
        generateNodeProps={(rowInfo) => this.generateNodeProps(rowInfo)}
      />
    );
  }
}

export default NodeTree;
