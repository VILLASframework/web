/**
 * File: users-data-manager.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import RestDataManager from './rest-data-manager';
import RestAPI from '../api/rest-api';
import AppDispatcher from '../app-dispatcher';

class UsersDataManager extends RestDataManager {
  constructor() {
    super('user', '/users');
  }

  login(username, password) {
    RestAPI.post(this.makeURL('/authenticate'), { username: username, password: password }).then(response => {
      AppDispatcher.dispatch({
        type: 'users/logged-in',
        token: response.token
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'users/login-error',
        error: error
      });
    });
  }

  getCurrentUser(token) {
    RestAPI.get(this.makeURL('/users/me'), token).then(response => {
      AppDispatcher.dispatch({
        type: 'users/current-user',
        user: response
      });
    }).catch(error => {
      AppDispatcher.dispatch({
        type: 'users/current-user-error',
        error: error
      });
    });
  }
}

export default new UsersDataManager();
