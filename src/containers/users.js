/**
 * File: users.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 02.05.2017
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
import { Container } from 'flux/utils';
import { Button, Modal, Glyphicon } from 'react-bootstrap';

import AppDispatcher from '../app-dispatcher';
import UserStore from '../stores/user-store';

import Table from '../components/table';
import TableColumn from '../components/table-column';
import NewProjectDialog from '../components/dialog/new-project';
import EditProjectDialog from '../components/dialog/edit-project';

class Projects extends Component {
  static getStores() {
    return [ UserStore ];
  }

  static calculateState() {
    return {
      users: UserStore.getState().users,

      newModal: false,
      editModal: false,
      deleteModal: false,
      modalData: {}
    };
  }

  componentWillMount() {
    AppDispatcher.dispatch({
      type: 'users/start-load'
    });
  }

  // closeNewModal(data) {
  //   this.setState({ newModal: false });

  //   if (data) {
  //     AppDispatcher.dispatch({
  //       type: 'projects/start-add',
  //       data: data
  //     });
  //   }
  // }

  // confirmDeleteModal() {
  //   this.setState({ deleteModal: false });

  //   AppDispatcher.dispatch({
  //     type: 'projects/start-remove',
  //     data: this.state.modalData
  //   });
  // }

  // closeEditModal(data) {
  //   this.setState({ editModal: false });

  //   if (data) {
  //     AppDispatcher.dispatch({
  //       type: 'projects/start-edit',
  //       data: data
  //     });
  //   }
  // }

  // getSimulationName(id) {
  //   for (var i = 0; i < this.state.simulations.length; i++) {
  //     if (this.state.simulations[i]._id === id) {
  //       return this.state.simulations[i].name;
  //     }
  //   }

  //   return id;
  // }

  render() {
    
    this.state.users.map( (user) => console.log('User: %o', user));

    return (
      <div>
        <h1>Users</h1>

        <Table data={this.state.users}>
          <TableColumn title='Username' dataKey='username' />
          <TableColumn title='Role' dataKey='role'  />
          <TableColumn width='70' editButton deleteButton onEdit={index => this.setState({ editModal: true, modalData: this.state.users[index] })} onDelete={index => this.setState({ deleteModal: true, modalData: this.state.users[index] })} />
        </Table>

        {/*<Button onClick={() => this.setState({ newModal: true })}><Glyphicon glyph='plus' /> Project</Button>

        <NewProjectDialog show={this.state.newModal} onClose={(data) => this.closeNewModal(data)} simulations={this.state.simulations} />

        <EditProjectDialog show={this.state.editModal} onClose={(data) => this.closeEditModal(data)} project={this.state.modalData} simulations={this.state.simulations} />

        <Modal show={this.state.deleteModal}>
          <Modal.Header>
            <Modal.Title>Delete Project</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete the project <strong>'{this.state.modalData.name}'</strong>?
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={() => this.setState({ deleteModal: false})}>Cancel</Button>
            <Button bsStyle='danger' onClick={() => this.confirmDeleteModal()}>Delete</Button>
          </Modal.Footer>
        </Modal>*/}
      </div>
    );
  }
}

export default Container.create(Projects);
