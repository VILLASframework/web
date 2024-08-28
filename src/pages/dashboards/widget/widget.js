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
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import WidgetLabel from './widgets/label';
import WidgetLine from './widgets/line';
import WidgetBox from './widgets/box';
import WidgetImage from './widgets/image';
import WidgetPlot from './widgets/plot';
import WidgetTable from './widgets/table';
import WidgetValue from './widgets/value';
import WidgetLamp from './widgets/lamp';
import WidgetGauge from './widgets/gauge';
import WidgetTimeOffset from './widgets/time-offset';
import WidgetICstatus from './widgets/icstatus';
// import WidgetCustomAction from './widgets/custom-action';
// import WidgetAction from './widgets/action';
// import WidgetButton from './widgets/button';
// import WidgetInput from './widgets/input';
// import WidgetSlider from './widgets/slider';
// import WidgetTopology from './widgets/topology';
// import WidgetPlayer from './widgets/player';
//import WidgetHTML from './widgets/html';
import '../../../styles/widgets.css';
import { useGetICSQuery, useGetSignalsQuery, useGetConfigsQuery } from '../../../store/apiSlice';

const Widget = ({widget, editing, files, configs, signals, paused, ics, icData}) => {

  const { token: sessionToken } = useSelector((state) => state.auth);

  const [icIDs, setICIDs] = useState([]);

  const icdata = useSelector((state) => state.websocket.icdata);

  useEffect(() => {
    if(signals.length > 0){
      let ids = [];

      for (let id of widget.signalIDs){
        let signal = signals.find(s => s.id === id);
        if (signal !== undefined) {
          let config = configs.find(m => m.id === signal.configID);
          if (config !== undefined){
            ids[signal.id] = config.icID;
          }
        }
      }

      setICIDs(ids);
    }
  }, [signals])

  // const {data: signals, isLoading: signalsLoading} = useGetSignalsQuery({})


  switch(widget.type){
    //Cosmetic widgets
    case 'Line':
      return <WidgetLine widget={widget} editing={editing} />
    case 'Box':
      return <WidgetBox widget={widget} editing={editing} />
    case 'Label':
      return <WidgetLabel widget={widget}/>;
    case 'Image':
      return <WidgetImage widget={widget} files={files} token={sessionToken} />
    //Displaying widgets
    case 'Plot':
      return <WidgetPlot widget={widget} data={icdata} signals={signals} icIDs={icIDs} paused={paused} />
    case 'Table':
      return <WidgetTable widget={widget} data={icdata} signals={signals} icIDs={icIDs} />
    case 'Value':
      return <WidgetValue widget={widget} data={icdata} signals={signals} icIDs={icIDs} />
    case 'Lamp':
      return <WidgetLamp widget={widget} data={icdata} signals={signals} icIDs={icIDs} />
    case 'Gauge':
      return <WidgetGauge widget={widget} data={icdata} signals={signals} icIDs={icIDs} editing={editing} />
    case 'TimeOffset':
      return <WidgetTimeOffset widget={widget} data={icdata} signals={signals} icIDs={icIDs} editing={editing} />
    case 'ICstatus':
      return <WidgetICstatus widget={widget} ics={ics} />
    //Manipulation widgets
    default:
      return <div>Error: Widget not found!</div>
  }
  

  // if (widget.type === 'CustomAction') {
  //   return <WidgetCustomAction
  //     widget={widget}
  //     data={this.state.icData}
  //     signals={this.state.signals}
  //     icIDs={this.state.icIDs}
  //   />
  // } else if (widget.type === 'Action') {
  //   return <WidgetAction
  //     widget={widget}
  //     data={this.state.icData}
  //   />
  // } else if (widget.type === 'Lamp') {
  //   return <WidgetLamp
  //     widget={widget}
  //     data={this.state.icData}
  //     signals={this.state.signals}
  //     icIDs={this.state.icIDs}
  //   />
  // } else if (widget.type === 'Value') {
  //   return <WidgetValue
  //     widget={widget}
  //     data={this.state.icData}
  //     signals={this.state.signals}
  //     icIDs={this.state.icIDs}
  //   />
  // } else if (widget.type === 'Plot') {
  //   return <WidgetPlot
  //     widget={widget}
  //     data={this.state.icData}
  //     signals={this.state.signals}
  //     icIDs={this.state.icIDs}
  //     paused={this.props.paused}
  //   />
  // } else if (widget.type === 'Table') {
  //   return <WidgetTable
  //     widget={widget}
  //     data={this.state.icData}
  //     signals={this.state.signals}
  //     icIDs={this.state.icIDs}
  //   />
  // } else if (widget.type === 'Label') {
  //   return <WidgetLabel
  //     widget={widget}
  //   />
  // } else if (widget.type === 'Image') {
  //   return <WidgetImage
  //     widget={widget}
  //     files={this.state.files}
  //     token={this.state.sessionToken}
  //   />
  // } else if (widget.type === 'Button') {
  //   return <WidgetButton
  //     widget={widget}
  //     editing={this.props.editing}
  //     onInputChanged={(value, controlID, controlValue, isFinalChange) => this.inputDataChanged(widget, value, controlID, controlValue, isFinalChange)}
  //     signals={this.state.signals}
  //     token={this.state.sessionToken}
  //   />
  // } else if (widget.type === 'NumberInput') {
  //   return <WidgetInput
  //     widget={widget}
  //     editing={this.props.editing}
  //     onInputChanged={(value, controlID, controlValue, isFinalChange) => this.inputDataChanged(widget, value, controlID, controlValue, isFinalChange)}
  //     signals={this.state.signals}
  //     token={this.state.sessionToken}
  //   />
  // } else if (widget.type === 'Slider') {
  //   return <WidgetSlider
  //     widget={widget}
  //     editing={this.props.editing}
  //     onInputChanged={(value, controlID, controlValue, isFinalChange) => this.inputDataChanged(widget, value, controlID, controlValue, isFinalChange)}
  //     signals={this.state.signals}
  //     token={this.state.sessionToken}
  //   />
  // } else if (widget.type === 'Gauge') {
  //   return <WidgetGauge
  //     widget={widget}
  //     data={this.state.icData}
  //     editing={this.props.editing}
  //     signals={this.state.signals}
  //     icIDs={this.state.icIDs}
  //   />
  // //} else if (widget.type === 'HTML') {
  //   //return <WidgetHTML
  //   //  widget={widget}
  //   //  editing={this.props.editing}
  //   ///>
  // } else if (widget.type === 'Topology') {
  //   return <WidgetTopology
  //     widget={widget}
  //     files={this.state.files}
  //     token={this.state.sessionToken}
  //   />
  // } else if (widget.type === 'TimeOffset') {
  //   return <WidgetTimeOffset
  //     widget={widget}
  //     data={this.state.icData}
  //     websockets={this.state.websockets}
  //     ics={this.props.ics}
  //   />
  // } else if (widget.type === 'ICstatus') {
  //   return <WidgetICstatus
  //     widget={widget}
  //     ics={this.props.ics}
  //   />
  // } else if (widget.type === 'Player') {
  //   return <WidgetPlayer
  //     widget={widget}
  //     editing={this.props.editing}
  //     configs={this.props.configs}
  //     onStarted={this.props.onSimulationStarted}
  //     ics={this.props.ics}
  //     results={this.state.results}
  //     files={this.state.files}
  //     scenarioID={this.props.scenarioID}
  //   />
  // }

  return null;
}

// class Widget extends React.Component {
//   static getStores() {
//     return [ ICDataStore, ConfigsStore, FileStore, SignalStore, WebsocketStore, ResultStore];
//   }

//   static calculateState(prevState, props) {

//     let websockets = WebsocketStore.getState();

//     let icData = {};

//     if (props.paused) {
//       if (prevState && prevState.icData) {
//         icData = JSON.parse(JSON.stringify(prevState.icData));
//       }
//     } else {
//       icData = ICDataStore.getState();
//     }

//     // Get the IC IDs and signal indexes for all signals of the widget
//     let configs = ConfigsStore.getState().filter(c => c.scenarioID === parseInt(props.scenarioID, 10));
//     // TODO make sure that the signals are only the signals that belong to the scenario at hand
//     let signals = SignalStore.getState();
//     let icIDs = [];

//     for (let id of props.data.signalIDs){
//       let signal = signals.find(s => s.id === id);
//       if (signal !== undefined) {
//         let config = configs.find(m => m.id === signal.configID);
//         if (config !== undefined){
//           icIDs[signal.id] = config.icID;
//         }
//       }
//     }

//     let results = ResultStore.getState().filter(r => r.scenarioID === parseInt(props.scenarioID, 10));
//     let files = FileStore.getState().filter(f => f.scenarioID === parseInt(props.scenarioID, 10));

//     return {
//       websockets: websockets,
//       icData: icData,
//       signals: signals,
//       icIDs: icIDs,
//       files: files,
//       sessionToken: localStorage.getItem("token"),
//       results: results,
//     };
//   }

//   inputDataChanged(widget, data, controlID, controlValue, isFinalChange) {
//     // controlID is the path to the widget customProperty that is changed (for example 'value')

//     // modify the widget customProperty
//     if (controlID !== '' && isFinalChange) {
//       let updatedWidget = JSON.parse(JSON.stringify(widget));
//       updatedWidget.customProperties[controlID] = controlValue;

//       AppDispatcher.dispatch({
//         type: 'widgets/start-edit',
//         token: this.state.sessionToken,
//         data: updatedWidget
//       });
//     }

//     // The following assumes that a widget modifies/ uses exactly one signal

//     // get the signal with the selected signal ID
//     let signalID = widget.signalIDs[0];
//     let signal = this.state.signals.filter(s => s.id === signalID)
//     if (signal.length === 0){
//       console.warn("Unable to send signal for signal ID", signalID, ". Signal not found.");
//       return;
//     }
//     // determine ID of infrastructure component related to signal[0]
//     // Remark: there is only one selected signal for an input type widget
//     let icID = this.state.icIDs[signal[0].id];
//     AppDispatcher.dispatch({
//       type: 'icData/inputChanged',
//       ic: icID,
//       signalID: signal[0].id,
//       signalIndex: signal[0].index,
//       data: signal[0].scalingFactor * data
//     });
//   }

//   createWidget(widget) {

//     if (widget.type === 'CustomAction') {
//       return <WidgetCustomAction
//         widget={widget}
//         data={this.state.icData}
//         signals={this.state.signals}
//         icIDs={this.state.icIDs}
//       />
//     } else if (widget.type === 'Action') {
//       return <WidgetAction
//         widget={widget}
//         data={this.state.icData}
//       />
//     } else if (widget.type === 'Lamp') {
//       return <WidgetLamp
//         widget={widget}
//         data={this.state.icData}
//         signals={this.state.signals}
//         icIDs={this.state.icIDs}
//       />
//     } else if (widget.type === 'Value') {
//       return <WidgetValue
//         widget={widget}
//         data={this.state.icData}
//         signals={this.state.signals}
//         icIDs={this.state.icIDs}
//       />
//     } else if (widget.type === 'Plot') {
//       return <WidgetPlot
//         widget={widget}
//         data={this.state.icData}
//         signals={this.state.signals}
//         icIDs={this.state.icIDs}
//         paused={this.props.paused}
//       />
//     } else if (widget.type === 'Table') {
//       return <WidgetTable
//         widget={widget}
//         data={this.state.icData}
//         signals={this.state.signals}
//         icIDs={this.state.icIDs}
//       />
//     } else if (widget.type === 'Label') {
//       return <WidgetLabel
//         widget={widget}
//       />
//     } else if (widget.type === 'Image') {
//       return <WidgetImage
//         widget={widget}
//         files={this.state.files}
//         token={this.state.sessionToken}
//       />
//     } else if (widget.type === 'Button') {
//       return <WidgetButton
//         widget={widget}
//         editing={this.props.editing}
//         onInputChanged={(value, controlID, controlValue, isFinalChange) => this.inputDataChanged(widget, value, controlID, controlValue, isFinalChange)}
//         signals={this.state.signals}
//         token={this.state.sessionToken}
//       />
//     } else if (widget.type === 'NumberInput') {
//       return <WidgetInput
//         widget={widget}
//         editing={this.props.editing}
//         onInputChanged={(value, controlID, controlValue, isFinalChange) => this.inputDataChanged(widget, value, controlID, controlValue, isFinalChange)}
//         signals={this.state.signals}
//         token={this.state.sessionToken}
//       />
//     } else if (widget.type === 'Slider') {
//       return <WidgetSlider
//         widget={widget}
//         editing={this.props.editing}
//         onInputChanged={(value, controlID, controlValue, isFinalChange) => this.inputDataChanged(widget, value, controlID, controlValue, isFinalChange)}
//         signals={this.state.signals}
//         token={this.state.sessionToken}
//       />
//     } else if (widget.type === 'Gauge') {
//       return <WidgetGauge
//         widget={widget}
//         data={this.state.icData}
//         editing={this.props.editing}
//         signals={this.state.signals}
//         icIDs={this.state.icIDs}
//       />
//     } else if (widget.type === 'Box') {
//       return <WidgetBox
//         widget={widget}
//         editing={this.props.editing}
//       />
//     //} else if (widget.type === 'HTML') {
//       //return <WidgetHTML
//       //  widget={widget}
//       //  editing={this.props.editing}
//       ///>
//     } else if (widget.type === 'Topology') {
//       return <WidgetTopology
//         widget={widget}
//         files={this.state.files}
//         token={this.state.sessionToken}
//       />
//     } else if (widget.type === 'Line') {
//       return <WidgetLine
//         widget={widget}
//         editing={this.props.editing}
//       />
//     } else if (widget.type === 'TimeOffset') {
//       return <WidgetTimeOffset
//         widget={widget}
//         data={this.state.icData}
//         websockets={this.state.websockets}
//         ics={this.props.ics}
//       />
//     } else if (widget.type === 'ICstatus') {
//       return <WidgetICstatus
//         widget={widget}
//         ics={this.props.ics}
//       />
//     } else if (widget.type === 'Player') {
//       return <WidgetPlayer
//         widget={widget}
//         editing={this.props.editing}
//         configs={this.props.configs}
//         onStarted={this.props.onSimulationStarted}
//         ics={this.props.ics}
//         results={this.state.results}
//         files={this.state.files}
//         scenarioID={this.props.scenarioID}
//       />
//     }

//     return null;
//   }

//   render() {
//     return this.createWidget(this.props.data);
//   }
// }

// let fluxContainerConverter = require('../common/FluxContainerConverter');
// export default Container.create(fluxContainerConverter.convert(Widget), { withProps: true });

export default Widget;
