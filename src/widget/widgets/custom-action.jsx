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
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Icon from "../../common/icon";
import ICStore from "../../ic/ic-store";
import AppDispatcher from "../../common/app-dispatcher";

const WidgetCustomAction = (props) => {
  const [ic, setIC] = useState(null);
  const [sessionToken, setSessionToken] = useState(
    localStorage.getItem("token")
  );

  useEffect(() => {
    const handleStoresChanged = () => {
      if (props.widget.signalIDs.length === 0) {
        setIC(null);
        return;
      }

      const newIC = ICStore.getState().find((s) => s.id === props.icIDs[0]);
      setIC(newIC);
    };

    // Subscribe to store changes
    const unsubscribe = ICStore.subscribe(handleStoresChanged);
    handleStoresChanged(); // Also call it to set initial state

    return () => {
      unsubscribe(); // Clean up the subscription when the component is unmounted
    };
  }, [props.widget.signalIDs, props.icIDs]);

  const onClick = () => {
    AppDispatcher.dispatch({
      type: "ics/start-action",
      ic: ic,
      data: props.widget.customProperties.actions,
      token: sessionToken,
    });
  };

  return (
    <div className="widget-custom-action full">
      <Button className="full" disabled={ic === null} onClick={onClick}>
        <Icon icon={props.widget.customProperties.icon} />
        <span dangerouslySetInnerHTML={{ __html: props.widget.name }} />
      </Button>
    </div>
  );
};

export default WidgetCustomAction;

// import React, { Component } from 'react';
// import { Button } from 'react-bootstrap';
// import Icon from '../../common/icon';
// import ICStore from '../../ic/ic-store';
// import AppDispatcher from '../../common/app-dispatcher';

// class WidgetCustomAction extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       ic: null
//     };
//   }

//   static getStores() {
//     return [ ICStore ];
//   }

//   static getDerivedStateFromProps(props, state){
//     if(props.widget.signalIDs.length === 0){
//       return null;
//     }

//     return{
//       ic: ICStore.getState().find(s => s.id === props.icIDs[0]),
//       sessionToken: localStorage.getItem("token")
//     };
//   }

//   onClick() {
//     AppDispatcher.dispatch({
//       type: 'ics/start-action',
//       ic: this.state.ic,
//       data: this.props.widget.customProperties.actions,
//       token: this.state.sessionToken
//     });
//   }

//   render() {
//     return <div className="widget-custom-action full">
//       <Button className="full" disabled={this.state.ic === null} onClick={(e) => this.onClick()}>
//         <Icon icon={this.props.widget.customProperties.icon} /> <span dangerouslySetInnerHTML={{ __html: this.props.widget.name }} />
//       </Button>
//     </div>;
//   }
// }

// export default WidgetCustomAction;
