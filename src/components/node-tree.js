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
      treeData: [
        { title: 'Chicken', subtitle: 'localhost:5000', children: [ { title: 'Egg' } ], expanded: true },
        { title: 'Cow', subtitle: 'localhost:5001', children: [ { title: 'Milk' }, { title: 'Cheese' }], expanded: true },
      ]
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
      buttons.push(<Button bsSize="small"><Glyphicon glyph="plus" /></Button>)
    }

    buttons.push(<Button bsSize="small"><Glyphicon glyph="pencil" /></Button>);

    return {
      buttons: buttons
    };
  }

  render() {
    return (
      <SortableTree
        treeData={ this.state.treeData }
        onChange={ (treeData) => this.setState({ treeData }) }
        style={{ height: 400 }}
        maxDepth='2'
        canDrag={ (node, path) => this.canNodeDrag(node, path) }
        canDrop={ (node, prevPath) => this.canNodeDrop(node, prevPath) }
        generateNodeProps={(rowInfo) => this.generateNodeProps(rowInfo) }
      />
    );
  }
}

export default NodeTree;
