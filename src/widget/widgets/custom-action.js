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
import { Button } from 'react-bootstrap';
import Icon from '../../common/icon';
import ICStore from '../../ic/ic-store';
import AppDispatcher from '../../common/app-dispatcher';

class WidgetCustomAction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ic: null
    };
  }

  static getStores() {
    return [ ICStore ];
  }

  static getDerivedStateFromProps(props, state){
    if(props.widget.signalIDs.length === 0){
      return null;
    }

    return{
      ic: ICStore.getState().find(s => s.id === props.icIDs[0]),
      sessionToken: localStorage.getItem("token")
    };
  }

  onClick() {
    AppDispatcher.dispatch({
      type: 'ics/start-action',
      ic: this.state.ic,
      data: this.props.widget.customProperties.actions,
      token: this.state.sessionToken
    });
  }

  render() {
    return <div className="widget-custom-action full">
      <Button className="full" disabled={this.state.ic === null} onClick={(e) => this.onClick()}>
        <Icon icon={this.props.widget.customProperties.icon} /> <span dangerouslySetInnerHTML={{ __html: this.props.widget.name }} />
      </Button>
    </div>;
  }
}

export default WidgetCustomAction;
