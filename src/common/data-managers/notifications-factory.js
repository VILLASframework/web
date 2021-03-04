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

class NotificationsFactory {

  // This is an example
  static get EXAMPLE_NOTIFICATION() {
      return {
          title: 'Example notification',
          message: 'Write something here that describes what happend.',
          level: 'warning'
      };
  }

  static SERVER_NOT_REACHABLE(url) {
    return {
      title: 'Server not reachable',
      message: 'The url ' + url +' could not be reached. Please try again later.',
      level: 'error'
    };
  }

  static REQUEST_TIMEOUT(url) {
    return {
      title: 'Request timeout',
      message: 'Request to ' + url + ' timed out. Please try again later.',
      level: 'error'
    };
  }

  static INTERNAL_SERVER_ERROR(response) {
    return {
      title: 'Internal server error',
      message: response.message,
      level: 'error'
    };
  }

  static ADD_ERROR(message) {
    return {
      title: "Add Error",
      message: message,
      level: 'error'
    };
  }

  static UPDATE_ERROR(message) {
    return {
      title: 'Update Error ',
      message: message,
      level: 'error'
    };
  }

  static UPDATE_WARNING(message) {
    return {
      title: 'Update Warning ',
      message: message,
      level: 'warning'
    };
  }

  static LOAD_ERROR(message) {
    return {
      title: 'Failed to load',
      message: message,
      level: 'error'
    };
  }

  static DELETE_ERROR(message) {
    return {
      title: 'Failed to delete ',
      message: message,
      level: 'error'
    };
  }

  static WEBSOCKET_CONNECTION_WARN(websocket_url) {
    return {
      title: 'Websocket connection warning',
      message: "Connection to " + websocket_url + " dropped. Attempt reconnect in 1 sec",
      level: 'warning'
    };
  }

  static WEBSOCKET_URL_WARN(ic_name, ic_uuid) {
    return {
      title: 'Websocket connection warning',
      message: "Websocket URL parameter not available for IC " + ic_name + "(" + ic_uuid + "), connection not possible",
      level: 'warning'
    };
  }

  static SCENARIO_USERS_ERROR(message) {
    return {
      title: 'Failed to modify scenario users ',
      message: message,
      level: 'error'
    };
  }

  static AUTOCONF_INFO() {
    return {
      title: 'Auto-configuration info',
      message: 'Signal configuration loaded successfully.',
      level: 'info'
    };
  }

  static AUTOCONF_WARN(message) {
    return {
      title: 'Auto-configuration warning',
      message: message,
      level: 'warning'
    };
  }

  static AUTOCONF_ERROR(message) {
    return {
      title: 'Auto-configuration error',
      message: message,
      level: 'error'
    };
  }

  static ACTION_INFO() {
    return {
      title: 'Action successfully requested',
      level: 'info'
    };
  }


}

export default NotificationsFactory;
