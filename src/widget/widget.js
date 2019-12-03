/**
 * File: widget.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.03.2017
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
import { Container } from 'flux/utils';

import AppDispatcher from '../common/app-dispatcher';
import LoginStore from '../user/login-store';
import SimulatorDataStore from '../simulator/simulator-data-store';
import SimulationModelStore from '../simulationmodel/simulation-model-store';
import FileStore from '../file/file-store';

import EditableWidgetContainer from './editable-widget-container';
import WidgetContainer from './widget-container';

import WidgetCustomAction from './widgets/custom-action';
import WidgetAction from './widgets/action';
import WidgetLamp from './widgets/lamp';
import WidgetValue from './widgets/value';
import WidgetPlot from './widgets/plot';
import WidgetTable from './widgets/table';
import WidgetLabel from './widgets/label';
import WidgetPlotTable from './widgets/plot-table';
import WidgetImage from './widgets/image';
import WidgetButton from './widgets/button';
import WidgetInput from './widgets/input';
import WidgetSlider from './widgets/slider';
import WidgetGauge from './widgets/gauge';
import WidgetBox from './widgets/box';
import WidgetHTML from './widgets/html';
import WidgetTopology from './widgets/topology';

import '../styles/widgets.css';

class Widget extends React.Component {
  static getStores() {
    return [ SimulatorDataStore, SimulationModelStore, FileStore, LoginStore ];
  }

  static calculateState(prevState, props) {
    let simulatorData = {};

    if (props.paused) {
      if (prevState && prevState.simulatorData) {
        simulatorData = JSON.parse(JSON.stringify(prevState.simulatorData));
      }
    } else {
      simulatorData = SimulatorDataStore.getState();
    }

    return {
      simulatorData,
      files: FileStore.getState(),
      simulationModels: SimulationModelStore.getState(),

      sequence: prevState != null ? prevState.sequence + 1 : 0,

      sessionToken: LoginStore.getState().token
    };
  }

  componentWillMount() {
    if (this.state.sessionToken == null) {
      return;
    }

    AppDispatcher.dispatch({
      type: 'files/start-load',
      token: this.state.sessionToken,
      param: '?objectID=1&objectType=widget'
    });

    AppDispatcher.dispatch({
      type: 'simulationModels/start-load',
      token: this.state.sessionToken,
      param: '?scenarioID=1'
    });

  }

  inputDataChanged(widget, data) {
    let simulationModel = null;

    for (let model of this.state.simulationModels) {
      if (model._id !== widget.simulationModel) {
        continue;
      }

      simulationModel = model;
    }

    AppDispatcher.dispatch({
      type: 'simulatorData/inputChanged',
      simulator: simulationModel.simulator,
      signal: widget.signal,
      data
    });
  }

  createWidget(widget) {
    let simulationModel = null;

    console.log("createwidget was called");
    console.log(" the widget type is: " + widget.type);
    for (let model of this.state.simulationModels) {
      if (model._id !== widget.simulationModel) {
        continue;
      }

      simulationModel = model;
    }
    //all types are lowercase!!! at least slider is
    if (widget.type === 'CustomAction') {
      return <WidgetCustomAction widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulationModel={simulationModel} />
    } else if (widget.type === 'Action') {
      return <WidgetAction widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulationModel={simulationModel}/>
    } else if (widget.type === 'Lamp') {
      return <WidgetLamp widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulationModel={simulationModel} />
    } else if (widget.type === 'Value') {
      return <WidgetValue widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulationModel={simulationModel} />
    } else if (widget.type === 'Plot') {
      return <WidgetPlot widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulationModel={simulationModel} paused={this.props.paused} />
    } else if (widget.type === 'Table') {
      return <WidgetTable widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulationModel={simulationModel} />
    } else if (widget.type === 'Label') {
      return <WidgetLabel widget={widget} />
    } else if (widget.type === 'PlotTable') {
      return <WidgetPlotTable widget={widget} data={this.state.simulatorData} dummy={this.state.sequence} simulationModel={simulationModel} editing={this.props.editing} onWidgetChange={(w) => this.props.onWidgetStatusChange(w, this.props.index)} paused={this.props.paused} />
    } else if (widget.type === 'Image') {
      return <WidgetImage widget={widget} files={this.state.files} token={this.state.sessionToken} />
    } else if (widget.type === 'Button') {
      return <WidgetButton widget={widget} editing={this.props.editing} simulationModel={simulationModel} onInputChanged={(value) => this.inputDataChanged(widget, value)} />
    } else if (widget.type === 'NumberInput') {
      return <WidgetInput widget={widget} editing={this.props.editing} simulationModel={simulationModel} onInputChanged={(value) => this.inputDataChanged(widget, value)} />
    } else if (widget.type === 'Slider') {
      console.log("inside slider: simulationModel: " + simulationModel);
      return <WidgetSlider widget={widget} editing={this.props.editing} simulationModel={simulationModel} onWidgetChange={(w) => this.props.onWidgetStatusChange(w, this.props.index) } onInputChanged={value => this.inputDataChanged(widget, value)} />
    } else if (widget.type === 'Gauge') {
      return <WidgetGauge widget={widget} data={this.state.simulatorData} editing={this.props.editing} simulationModel={simulationModel} />
    } else if (widget.type === 'Box') {
      return <WidgetBox widget={widget} editing={this.props.editing} />
    } else if (widget.type === 'HTML') {
      return <WidgetHTML widget={widget} editing={this.props.editing} />
    } else if (widget.type === 'Topology') {
      return <WidgetTopology widget={widget} files={this.state.files} />
    }

    return null;
  }
  rn 

  render() {
    console.log("!!!render Widget was called");
    const element = this.createWidget(this.props.data);

    if (this.props.editing) {
      return <EditableWidgetContainer widget={this.props.data} grid={this.props.grid} index={this.props.index}>
        {element}
      </EditableWidgetContainer>;
    }

    return <WidgetContainer widget={this.props.data}>
      {element}
    </WidgetContainer>;
  }
}

let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(Widget), { withProps: true });
