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

const widgetsMap = {
  CustomAction: {
    name: "Action",
    width: 100,
    height: 50,
    customProperties: {
      actions: [
        { action: "stop" },
        {
          action: "pause",
          model: { url: "ftp://user:pass@example.com/projectA/model.zip" },
          parameters: { timestep: 50e-6 },
        },
      ],
      icon: "star",
    },
  },
  Lamp: {
    minWidth: 5,
    minHeight: 5,
    width: 20,
    height: 20,
    customProperties: {
      on_color: "#4287f5",
      on_color_opacity: 1,
      off_color: "#4287f5",
      off_color_opacity: 1,
      threshold: 0.5,
    },
  },
  Value: {
    name: "Value",
    minWidth: 70,
    minHeight: 20,
    width: 110,
    height: 30,
    customProperties: {
      textSize: 16,
      showUnit: false,
      resizeTopBottomLock: true,
      showScalingFactor: true,
    },
  },
  Plot: {
    minWidth: 400,
    minHeight: 200,
    width: 400,
    height: 200,
    customProperties: {
      ylabel: "",
      time: 60,
      yMin: 0,
      yMax: 10,
      yUseMinMax: false,
      lineColors: [],
      showUnit: false,
      mode: "auto time-scrolling",
      nbrSamples: 100,
    },
  },
  Table: {
    minWidth: 200,
    width: 300,
    height: 200,
    customProperties: {
      showUnit: false,
      showScalingFactor: true,
    },
  },
  Label: {
    name: "Label",
    minWidth: 20,
    minHeight: 20,
    width: 100,
    height: 35,
    customProperties: {
      maxWidth: 100, // Currently ignored
      textSize: 32,
      fontColor: "#4287f5",
      fontColor_opacity: 1,
      resizeTopBottomLock: true,
    },
  },
  Image: {
    minWidth: 20,
    minHeight: 20,
    width: 200,
    height: 200,
    customProperties: {
      lockAspect: true,
      file: -1, // ID of image file, -1 means not selected
      update: false,
    },
  },
  Button: {
    minWidth: 100,
    minHeight: 50,
    width: 100,
    height: 100,
    customProperties: {
      background_color: "#527984",
      font_color: "#4287f5",
      border_color: "#4287f5",
      background_color_opacity: 1,
      on_value: 1,
      off_value: 0,
      toggle: false,
      pressed: false,
      simStartedSendValue: false,
    },
  },
  NumberInput: {
    minWidth: 150,
    minHeight: 50,
    width: 200,
    height: 50,
    customProperties: {
      showUnit: false,
      resizeTopBottomLock: true,
      value: "",
      simStartedSendValue: false,
    },
  },
  Gauge: {
    minWidth: 100,
    minHeight: 150,
    width: 150,
    height: 150,
    customProperties: {
      colorZones: false,
      zones: [],
      valueMin: 0,
      valueMax: 1,
      valueUseMinMax: false,
      lockAspect: true,
      showScalingFactor: true,
    },
  },
  Box: {
    minWidth: 50,
    minHeight: 50,
    width: 100,
    height: 100,
    customProperties: {
      border_color: "#4287f5",
      border_color_opacity: 1,
      border_width: 2,
      background_color: "#961520",
      background_color_opacity: 1,
    },
  },
  Topology: {
    width: 600,
    height: 400,
    customProperties: {
      file: -1, // ID of file, -1 means not selected
    },
  },
  Line: {
    width: 100,
    height: 26,
    customProperties: {
      border_color: "#4287f5",
      border_color_opacity: 1,
      border_width: 2,
      rotation: 0,
      lockAspect: false,
      resizeLeftRightLock: false,
      resizeTopBottomLock: true,
    },
  },
  TimeOffset: {
    minWidth: 200,
    minHeight: 80,
    width: 200,
    height: 80,
    customProperties: {
      threshold_yellow: 1,
      threshold_red: 2,
      icID: -1,
      horizontal: true,
      showOffset: true,
      lockAspect: true,
      showName: true,
    },
  },
  Player: {
    minWidth: 144,
    minHeight: 226,
    width: 400,
    height: 606,
    customProperties: {
      configIDs: [],
      uploadResults: false,
    },
  },
  ICstatus: {
    customProperties: {
      checkedIDs: [],
    },
  },
};

const defaultWidget = {
  name: "Name",
  width: 100,
  height: 100,
  x: 0,
  y: 0,
  z: 0,
  locked: false,
  customProperties: {},
  signalIDs: [],
};

const WidgetFactory = {
  createWidgetOfType: (type, position) => {
    const widget = {
      ...defaultWidget,
      type: type,
      ...widgetsMap[type],
      ...position,
    };
    return widget;
  },
};

export default WidgetFactory;
