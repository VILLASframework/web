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

import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import WidgetLabel from "./widgets/label.jsx";
import WidgetLine from "./widgets/line.jsx";
import WidgetBox from "./widgets/box.jsx";
import WidgetImage from "./widgets/image.jsx";
import WidgetPlot from "./widgets/plot.jsx";
import WidgetTable from "./widgets/table.jsx";
import WidgetValue from "./widgets/value.jsx";
import WidgetLamp from "./widgets/lamp.jsx";
import WidgetGauge from "./widgets/gauge.jsx";
import WidgetTimeOffset from "./widgets/time-offset.jsx";
import WidgetICstatus from "./widgets/icstatus.jsx";
import WidgetButton from "./widgets/button.jsx";
import WidgetInput from "./widgets/input.jsx";
import WidgetSlider from "./widgets/slider.jsx";
import WidgetPlayer from "./widgets/player.jsx";
import "../../../styles/widgets.css";
import { useUpdateWidgetMutation } from "../../../store/apiSlice.js";
import { sendMessageToWebSocket } from "../../../store/websocketSlice.js";
import { useGetResultsQuery } from "../../../store/apiSlice.js";

const Widget = ({
  widget,
  editing,
  files,
  configs,
  signals,
  paused,
  ics,
  scenarioID,
  onSimulationStarted,
}) => {
  const dispatch = useDispatch();
  const { token: sessionToken } = useSelector((state) => state.auth);
  const { data, refetch: refetchResults } = useGetResultsQuery(scenarioID);
  const results = data ? data.results : [];
  const [icIDs, setICIDs] = useState([]);

  const icdata = useSelector((state) => state.websocket.icdata);

  const [websockets, setWebsockets] = useState([]);
  const activeSocketURLs = useSelector(
    (state) => state.websocket.activeSocketURLs
  );
  const [update] = useUpdateWidgetMutation();

  useEffect(() => {
    if (activeSocketURLs.length > 0) {
      activeSocketURLs.forEach((url) => {
        setWebsockets((prevState) => [
          ...prevState,
          { url: url.replace(/^wss:\/\//, "https://"), connected: true },
        ]);
      });
    }
  }, [activeSocketURLs]);

  useEffect(() => {
    if (signals.length > 0) {
      let ids = [];

      for (let id of widget.signalIDs) {
        let signal = signals.find((s) => s.id === id);
        if (signal !== undefined) {
          let config = configs.find((m) => m.id === signal.configID);
          if (config !== undefined) {
            ids[signal.id] = config.icID;
          }
        }
      }

      setICIDs(ids);
    }
  }, [signals]);

  const inputDataChanged = (
    widget,
    data,
    controlID,
    controlValue,
    isFinalChange
  ) => {
    if (controlID !== "" && isFinalChange) {
      let updatedWidget = JSON.parse(JSON.stringify(widget));
      updatedWidget.customProperties[controlID] = controlValue;

      updateWidget(updatedWidget);
    }

    let signalID = widget.signalIDs[0];
    let signal = signals.filter((s) => s.id === signalID);
    if (signal.length === 0) {
      console.warn(
        "Unable to send signal for signal ID",
        signalID,
        ". Signal not found."
      );
      return;
    }
    // determine ID of infrastructure component related to signal[0]
    // Remark: there is only one selected signal for an input type widget
    let icID = icIDs[signal[0].id];
    dispatch(
      sendMessageToWebSocket({
        message: {
          ic: icID,
          signalID: signal[0].id,
          signalIndex: signal[0].index,
          data: signal[0].scalingFactor * data,
        },
      })
    );
  };

  const updateWidget = async (updatedWidget) => {
    try {
      await update({
        widgetID: widget.id,
        updatedWidget: { widget: updatedWidget },
      }).unwrap();
    } catch (err) {
      console.log("error", err);
    }
  };

  const widgetMap = {
    Line: <WidgetLine widget={widget} editing={editing} />,
    Box: <WidgetBox widget={widget} editing={editing} />,
    Label: <WidgetLabel widget={widget} />,
    Image: <WidgetImage widget={widget} files={files} token={sessionToken} />,
    Plot: (
      <WidgetPlot
        widget={widget}
        data={icdata}
        signals={signals}
        icIDs={icIDs}
        paused={paused}
      />
    ),
    Table: (
      <WidgetTable
        widget={widget}
        data={icdata}
        signals={signals}
        icIDs={icIDs}
      />
    ),
    Value: (
      <WidgetValue
        widget={widget}
        data={icdata}
        signals={signals}
        icIDs={icIDs}
      />
    ),
    Lamp: (
      <WidgetLamp
        widget={widget}
        data={icdata}
        signals={signals}
        icIDs={icIDs}
      />
    ),
    Gauge: (
      <WidgetGauge
        widget={widget}
        data={icdata}
        signals={signals}
        icIDs={icIDs}
        editing={editing}
      />
    ),
    TimeOffset: (
      <WidgetTimeOffset
        widget={widget}
        data={icdata}
        signals={signals}
        ics={ics}
        editing={editing}
        websockets={websockets}
      />
    ),
    ICstatus: <WidgetICstatus widget={widget} ics={ics} />,
    Button: (
      <WidgetButton
        widget={widget}
        editing={editing}
        onInputChanged={(value, controlID, controlValue, isFinalChange) =>
          inputDataChanged(
            widget,
            value,
            controlID,
            controlValue,
            isFinalChange
          )
        }
        signals={signals}
        token={sessionToken}
      />
    ),
    NumberInput: (
      <WidgetInput
        widget={widget}
        editing={editing}
        onInputChanged={(value, controlID, controlValue, isFinalChange) =>
          inputDataChanged(
            widget,
            value,
            controlID,
            controlValue,
            isFinalChange
          )
        }
        signals={signals}
        token={sessionToken}
      />
    ),
    Slider: (
      <WidgetSlider
        widget={widget}
        editing={editing}
        onInputChanged={(value, controlID, controlValue, isFinalChange) =>
          inputDataChanged(
            widget,
            value,
            controlID,
            controlValue,
            isFinalChange
          )
        }
        signals={signals}
        token={sessionToken}
      />
    ),
    Player: (
      <WidgetPlayer
        widget={widget}
        editing={editing}
        configs={configs}
        onStarted={onSimulationStarted}
        ics={ics}
        results={results}
        files={files}
        scenarioID={scenarioID}
      />
    ),
  };

  return widgetMap[widget.type] || <div>Error: Widget not found!</div>;
};

export default Widget;
