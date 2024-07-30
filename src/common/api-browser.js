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

import React from 'react';

import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import '../styles/swagger-ui.css';
import RestAPI from './api/rest-api';

class APIBrowser extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      'spec': null
    };
  }

  mangleSpec(spec) {
    spec.host = window.location.host;

    return spec;
  }

  componentDidMount() {
    this._asyncRequest = RestAPI.get('/api/v2/openapi')
      .then((spec) => {
        this._asyncRequest = null;

        this.setState({
          'spec': this.mangleSpec(spec)
        });
      });
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  requestInterceptor(req) {
    var token = localStorage.getItem('token');

    if (token)
      req.headers.Authorization = 'Bearer ' + token;

    return req
  }

  render() {
    return (
      <div>
        { this.state.spec &&
        <SwaggerUI
          spec={this.state.spec}
          tryItOutEnabled={true}
          requestInterceptor={this.requestInterceptor}
        /> }
      </div>
    );
  }
}

export default APIBrowser;
