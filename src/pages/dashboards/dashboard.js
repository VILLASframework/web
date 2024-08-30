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

import React, { useState, useEffect, useCallback, useRef, act } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Fullscreenable from 'react-fullscreenable';
import classNames from 'classnames';
import 'react-contexify/dist/ReactContexify.min.css';
import EditWidget from './widget/edit-widget/edit-widget';
import EditSignalMappingDialog from '../scenarios/dialogs/edit-signal-mapping'
import WidgetToolbox from './widget/widget-toolbox';
import WidgetArea from './widget-area';
import DashboardButtonGroup from './dashboard-button-group';
import IconToggleButton from '../../common/buttons/icon-toggle-button';
import WidgetContainer from "./widget/widget-container";
import Widget from "./widget/widget";

import { connectWebSocket, disconnect } from '../../store/websocketSlice';

import { 
  useGetDashboardQuery, 
  useLazyGetWidgetsQuery, 
  useLazyGetConfigsQuery, 
  useAddWidgetMutation, 
  useUpdateWidgetMutation, 
  useDeleteWidgetMutation,
  useLazyGetFilesQuery,
  useUpdateDashboardMutation,
  useGetICSQuery,
  useLazyGetSignalsQuery
} from '../../store/apiSlice';

const startUpdaterWidgets = new Set(['Slider', 'Button', 'NumberInput']);

const Dashboard = ({ isFullscreen, toggleFullscreen }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { data: dashboardRes, error: dashboardError, isLoading: isDashboardLoading } = useGetDashboardQuery(params.dashboard);
  const dashboard = dashboardRes ? dashboardRes.dashboard : {};
  const {data: icsRes} = useGetICSQuery();
  const ics = icsRes ? icsRes.ics : [];

  const [triggerGetWidgets] = useLazyGetWidgetsQuery();
  const [triggerGetConfigs] = useLazyGetConfigsQuery();
  const [triggerGetFiles] = useLazyGetFilesQuery();
  const [triggerGetSignals] = useLazyGetSignalsQuery();
  const [addWidget] = useAddWidgetMutation();
  const [updateWidget] = useUpdateWidgetMutation();
  const [deleteWidgetMutation] = useDeleteWidgetMutation();
  const [updateDashboard] = useUpdateDashboardMutation();

  const [widgets, setWidgets] = useState([]);
  const [widgetsToUpdate, setWidgetsToUpdate] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [signals, setSignals] = useState([]);
  const [sessionToken, setSessionToken] = useState(localStorage.getItem("token"));
  const [files, setFiles] = useState([]);
  const [editing, setEditing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editOutputSignalsModal, setEditOutputSignalsModal] = useState(false);
  const [editInputSignalsModal, setEditInputSignalsModal] = useState(false);
  const [filesEditModal, setFilesEditModal] = useState(false);
  const [filesEditSaveState, setFilesEditSaveState] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);
  const [widgetChangeData, setWidgetChangeData] = useState([]);
  const [widgetOrigIDs, setWidgetOrigIDs] = useState([]);
  const [maxWidgetHeight, setMaxWidgetHeight] = useState(null);
  const [locked, setLocked] = useState(false);

  const [height, setHeight] = useState(10);
  const [grid, setGrid] = useState(50);
  const [newHeightValue, setNewHeightValue] = useState(0);

  //ics that are included in configurations
  const [activeICS, setActiveICS] = useState([]);

  useEffect(() => {
    let usedICS = [];
    for(const config of configs){
      usedICS.push(config.icID);
    }
    setActiveICS(ics.filter((i) => usedICS.includes(i.id)));
  }, [configs])

  const activeSocketURLs = useSelector((state) => state.websocket.activeSocketURLs);

  //connect to websockets
  useEffect(() => {
    activeICS.forEach((i) => {
      if(i.websocketurl){
        if(!activeSocketURLs.includes(i.websocketurl)) 
          dispatch(connectWebSocket({ url: i.websocketurl, id: i.id }));
      }
    })

    return () => {
      activeICS.forEach((i) => {
        dispatch(disconnect({ id: i.id }));
      });
    };

  }, [activeICS]);


  //as soon as dashboard is loaded, load widgets, configs, signals and files for this dashboard
  useEffect(() => {
    if (dashboard.id) {
      fetchWidgets(dashboard.id);
      fetchWidgetData(dashboard.scenarioID);
      setHeight(dashboard.height);
      setGrid(dashboard.grid);
      
      console.log('widgets', widgets);
    }
  }, [dashboard]);

  const fetchWidgets = async (dashboardID) => {
    try {
      const widgetsRes = await triggerGetWidgets(dashboardID).unwrap();
      if (widgetsRes.widgets) {
        setWidgets(widgetsRes.widgets);
      }
    } catch (err) {
      console.log('error fetching data', err);
    }
  }

  const fetchWidgetData = async (scenarioID) => {
    try {
      const filesRes = await triggerGetFiles(scenarioID).unwrap();
      if (filesRes.files) {
        setFiles(filesRes.files);
      }
      const configsRes = await triggerGetConfigs(scenarioID).unwrap();
      if (configsRes.configs) {
        setConfigs(configsRes.configs);
        //load signals if there are any configs

        if(configsRes.configs.length > 0){
          for(const config of configsRes.configs){
            const signalsInRes = await triggerGetSignals({configID: config.id, direction: "in"}).unwrap();
            const signalsOutRes = await triggerGetSignals({configID: config.id, direction: "out"}).unwrap();
            setSignals(prevState => ([...signalsInRes.signals, ...signalsOutRes.signals, ...prevState]));
          }
        }
        
      }
    } catch (err) {
      console.log('error fetching data', err);
    }
  }

  const handleKeydown = useCallback((e) => {
    switch (e.key) {
      case ' ':
      case 'p':
        setPaused(prevPaused => !prevPaused);
        break;
      case 'e':
        setEditing(prevEditing => !prevEditing);
        break;
      case 'f':
        toggleFullscreen();
        break;
      default:
    }
  }, [toggleFullscreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  const handleDrop = async (widget) => {
    widget.dashboardID = dashboard.id;

    if (widget.type === 'ICstatus') {
      let allICids = ics.map(ic => ic.id);
      widget.customProperties.checkedIDs = allICids;
    }

    try {
      const res = await addWidget(widget).unwrap();
      if (res) {
        fetchWidgets(dashboard.id);
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const widgetChange = async (widget) => {
    setWidgetsToUpdate(prevWidgetsToUpdate => [...prevWidgetsToUpdate, widget.id]);
    setWidgets(prevWidgets => prevWidgets.map(w => w.id === widget.id ? {...widget} : w));

    // try {
    //   await updateWidget({ widgetID: widget.id, updatedWidget: { widget } }).unwrap();
    //   fetchWidgets(dashboard.id);
    // } catch (err) {
    //   console.log('error', err);
    // }
  };

  const onChange = async (widget) => {
    try {
      await updateWidget({ widgetID: widget.id, updatedWidget: { widget: widget } }).unwrap();
      fetchWidgets(dashboard.id);
    } catch (err) {
      console.log('error', err);
    }
  };

  const onSimulationStarted = () => {
    widgets.forEach(async (widget) => {
      if (startUpdaterWidgets.has(widget.type)) {
        widget.customProperties.simStartedSendValue = true;
        try {
          await updateWidget({ widgetID: widget.id, updatedWidget: { widget } }).unwrap();
        } catch (err) {
          console.log('error', err);
        }
      }
    });
  };

  const editWidget = (widget, index) => {
    setEditModal(true);
    setModalData({...widget});
    setModalIndex(index);
  };

  const duplicateWidget = async (widget) => {
    let widgetCopy = { ...widget, id: undefined, x: widget.x + 50, y: widget.y + 50 };
    try {
      const res = await addWidget({ widget: widgetCopy }).unwrap();
      if (res) {
        fetchWidgets(dashboard.id);
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const startEditFiles = () => {
    let tempFiles = files.map(file => ({ id: file.id, name: file.name }));
    setFilesEditModal(true);
    setFilesEditSaveState(tempFiles);
  };

  const closeEditFiles = () => {
    widgets.forEach(widget => {
      if (widget.type === "Image") {
        //widget.customProperties.update = true;
      }
    });
    setFilesEditModal(false);
  };

  const closeEdit = async (data) => {
    if (!data) {
      setEditModal(false);
      setModalData(null);
      setModalIndex(null);
      return;
    }

    if (data.type === "Image") {
      data.customProperties.update = true;
    }

    try {
      await updateWidget({ widgetID: data.id, updatedWidget: { widget: data } }).unwrap();
      fetchWidgets(dashboard.id);
    } catch (err) {
      console.log('error', err);
    }

    setEditModal(false);
    setModalData(null);
    setModalIndex(null);
  };

  const deleteWidget = async (widgetID) => {
    try {
      await deleteWidgetMutation(widgetID).unwrap();
      fetchWidgets(dashboard.id);
    } catch (err) {
      console.log('error', err);
    }
  };

  const startEditing = () => {
    let originalIDs = widgets.map(widget => widget.id);
    widgets.forEach(async (widget) => {
      if (widget.type === 'Slider' || widget.type === 'NumberInput' || widget.type === 'Button') {
        try {
          await updateWidget({ widgetID: widget.id, updatedWidget: { widget } }).unwrap();
        } catch (err) {
          console.log('error', err);
        }
      } else if (widget.type === 'Image') {
        //widget.customProperties.update = true;
      }
    });
    setEditing(true);
    setWidgetOrigIDs(originalIDs);
  };

  const saveEditing = async () => {
    // widgets.forEach(async (widget) => {
    //   if (widget.type === 'Image') {
    //     widget.customProperties.update = true;
    //   }
    //   try {
    //     await updateWidget({ widgetID: widget.id, updatedWidget: { widget } }).unwrap();
    //   } catch (err) {
    //     console.log('error', err);
    //   }
    // });


    if(height !== dashboard.height || grid !== dashboard.grid) {
      try {
        const {height: oldHeight, grid: oldGrid, ...rest} = dashboard;
        await updateDashboard({dashboardID: dashboard.id, dashboard:{height: height, grid: grid, ...rest}}).unwrap();
      } catch (err) {
        console.log('error', err);
      }
    }


    if(widgetsToUpdate.length > 0){
      try {
        for(const index in widgetsToUpdate){
          await updateWidget({ widgetID: widgetsToUpdate[index], updatedWidget: { widget: {...widgets.find(w => w.id == widgetsToUpdate[index])} } }).unwrap();
        }
        fetchWidgets(dashboard.id);
      } catch (err) {
        console.log('error', err);
      }
    }

    setEditing(false);
    setWidgetChangeData([]);
  };

  const cancelEditing = () => {
    // widgets.forEach(async (widget) => {
    //   if (widget.type === 'Image') {
    //     widget.customProperties.update = true;
    //   }
    //   if (!widgetOrigIDs.includes(widget.id)) {
    //     try {
    //       await deleteWidget(widget.id).unwrap();
    //     } catch (err) {
    //       console.log('error', err);
    //     }
    //   }
    // });
    fetchWidgets(dashboard.id);
    setEditing(false);
    setWidgetChangeData([]);
    setHeight(dashboard.height);
    setGrid(dashboard.grid);
  };

  const updateGrid = (value) => {
    setGrid(value);
  };

  const updateHeight = (value) => {
    const maxHeight = Object.values(widgets).reduce((currentHeight, widget) => {
      const absolutHeight = widget.y + widget.height;
      return absolutHeight > currentHeight ? absolutHeight : currentHeight;
    }, 0);

    if (value === -1) {
      if (dashboard.height >= 450 && dashboard.height >= (maxHeight + 80)) {
        setHeight(prevState => (prevState - 50));
      }
    } else {
      setHeight( prevState => ( prevState + 50));
    }
  };

  const pauseData = () => setPaused(true);
  const unpauseData = () => setPaused(false);
  const editInputSignals = () => setEditInputSignalsModal(true);
  const editOutputSignals = () => setEditOutputSignalsModal(true);

  const closeEditSignalsModal = (direction) => {
    if (direction === "in") {
      setEditInputSignalsModal(false);
    } else if (direction === "out") {
      setEditOutputSignalsModal(false);
    }
  };

  const buttonStyle = { marginLeft: '10px' };
  const iconStyle = { height: '25px', width: '25px' };
  const boxClasses = classNames('section', 'box', { 'fullscreen-padding': isFullscreen });

  if (isDashboardLoading) {
    return <div>Loading...</div>;
  }

  if (dashboardError) {
    return <div>Error. Dashboard not found</div>;
  }

  return (
    <div className={boxClasses}>
      <div key={"header-box"} className='section-header box-header'>
        <div key={"title"} className="section-title">
          <h2>
            {dashboard.name}
            <span key={"toggle-lock-button"} className='icon-button'>
              <IconToggleButton
                childKey={0}
                checked={locked}
                index={dashboard.id}
                checkedIcon='lock'
                uncheckedIcon='lock-open'
                tooltipChecked='Dashboard is locked, cannot be edited'
                tooltipUnchecked='Dashboard is unlocked, can be edited'
                disabled={true}
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
              />
            </span>
          </h2>
        </div>

        <DashboardButtonGroup
          key={"dashboard-buttons"}
          locked={locked}
          editing={editing}
          onEdit={startEditing}
          fullscreen={isFullscreen}
          paused={paused}
          onSave={saveEditing}
          onCancel={cancelEditing}
          onFullscreen={toggleFullscreen}
          onPause={pauseData}
          onUnpause={unpauseData}
          onEditFiles={startEditFiles}
          onEditOutputSignals={editOutputSignals}
          onEditInputSignals={editInputSignals}
        />
      </div>

      <div key={"dashboard-area"} className="box box-content" onContextMenu={(e) => e.preventDefault()}>
        {editing &&
          <WidgetToolbox
            key={"widget-toolbox"}
            grid={grid}
            onGridChange={updateGrid}
            dashboard={dashboard}
            onDashboardSizeChange={updateHeight}
            widgets={widgets}
          />
        }

        <WidgetArea
          key={"widget-area"}
          widgets={widgets}
          editing={editing}
          dropZoneHeight={height}
          grid={grid}
          onWidgetAdded={handleDrop}
        >
          {widgets != null && Object.keys(widgets).map(widgetKey => (
            <div key={"widget-container-wrapper" + widgetKey}>
              <WidgetContainer
                widget={JSON.parse(JSON.stringify(widgets[widgetKey]))}
                key={"widget-container" + widgetKey}
                index={parseInt(widgetKey, 10)}
                grid={grid}
                onWidgetChange={widgetChange}
                editing={editing}
                paused={paused}
                onEdit={editWidget}
                onDuplicate={duplicateWidget}
                onDelete={(widget, index) => deleteWidget(widget.id)}
                onChange={editing ? widgetChange : onChange}
              >
                <Widget
                  widget={JSON.parse(JSON.stringify(widgets[widgetKey]))}
                  editing={editing}
                  files={files}
                  configs={configs}
                  signals={signals}
                  paused={paused}
                  ics={activeICS}
                  scenarioID={dashboard.scenarioID}
                  onSimulationStarted={() => onSimulationStarted()}
                />
              </WidgetContainer>
            </div>
          ))}
        </WidgetArea>

        <EditWidget
          key={"edit-widget"}
          sessionToken={sessionToken}
          show={editModal}
          onClose={closeEdit}
          widget={modalData}
          signals={signals}
          files={files}
          ics={ics}
          configs={configs}
          scenarioID={dashboard.scenarioID}
        />

        {/* <EditFilesDialog
          key={"edit-files-dialog"}
          sessionToken={this.state.sessionToken}
          show={this.state.filesEditModal}
          onClose={this.closeEditFiles.bind(this)}
          signals={this.state.signals}
          files={this.state.files}
          scenarioID={this.state.dashboard.scenarioID}
          locked={this.state.locked}
        /> */}

        <EditSignalMappingDialog
          key={"edit-signal-mapping-input-dialog"}
          show={editInputSignalsModal}
          onCloseEdit={closeEditSignalsModal}
          direction="Input"
          signals={signals}
          configID={null}
          configs={configs}
          sessionToken={sessionToken}
        />
      </div>
    </div>
  );
};

export default Fullscreenable()(Dashboard);
