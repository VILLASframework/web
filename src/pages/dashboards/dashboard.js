// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import Fullscreenable from 'react-fullscreenable';
// import classNames from 'classnames';
// import 'react-contexify/dist/ReactContexify.min.css';
// import EditWidget from '../../widget/edit-widget/edit-widget';
// import EditFilesDialog from '../../file/edit-files';
// import EditSignalMappingDialog from '../scenarios/dialogs/edit-signal-mapping'
// import WidgetToolbox from '../../widget/widget-toolbox';
// import WidgetArea from './widget-area';
// import DashboardButtonGroup from './dashboard-button-group';
// import IconToggleButton from '../../common/buttons/icon-toggle-button';
// import WidgetContainer from '../../widget/widget-container';
// import Widget from "../../widget/widget";
// import { 
//   useGetDashboardQuery, 
//   useLazyGetWidgetsQuery, 
//   useLazyGetConfigsQuery, 
//   useAddWidgetMutation, 
//   useUpdateWidgetMutation, 
//   useDeleteWidgetMutation 
// } from '../../store/apiSlice';

// const startUpdaterWidgets = new Set(['Slider', 'Button', 'NumberInput']);

// const Dashboard = ({ isFullscreen, toggleFullscreen }) => {
//   const params = useParams();
//   const { data: dashboardRes, error: dashboardError, isLoading: isDashboardLoading } = useGetDashboardQuery(params.dashboard);
//   const dashboard = dashboardRes ? dashboardRes.dashboard : {};

//   const [triggerGetWidgets] = useLazyGetWidgetsQuery();
//   const [triggerGetConfigs] = useLazyGetConfigsQuery();
//   const [addWidget] = useAddWidgetMutation();
//   const [updateWidget] = useUpdateWidgetMutation();
//   const [deleteWidgetMutation] = useDeleteWidgetMutation();

//   const [widgets, setWidgets] = useState([]);
//   const [configs, setConfigs] = useState([]);
//   const [signals, setSignals] = useState([]);
//   const [sessionToken, setSessionToken] = useState(localStorage.getItem("token"));
//   const [files, setFiles] = useState([]);
//   const [ics, setIcs] = useState([]);
//   const [editing, setEditing] = useState(false);
//   const [paused, setPaused] = useState(false);
//   const [editModal, setEditModal] = useState(false);
//   const [editOutputSignalsModal, setEditOutputSignalsModal] = useState(false);
//   const [editInputSignalsModal, setEditInputSignalsModal] = useState(false);
//   const [filesEditModal, setFilesEditModal] = useState(false);
//   const [filesEditSaveState, setFilesEditSaveState] = useState([]);
//   const [modalData, setModalData] = useState(null);
//   const [modalIndex, setModalIndex] = useState(null);
//   const [widgetChangeData, setWidgetChangeData] = useState([]);
//   const [widgetOrigIDs, setWidgetOrigIDs] = useState([]);
//   const [maxWidgetHeight, setMaxWidgetHeight] = useState(null);
//   const [locked, setLocked] = useState(false);

//   useEffect(() => {
//     if (dashboard.id) {
//       fetchWidgets(dashboard.id);
//       fetchConfigs(dashboard.scenarioID);
//     }
//   }, [dashboard]);

//   const fetchWidgets = async (dashboardID) => {
//     try {
//       const res = await triggerGetWidgets(dashboardID).unwrap();
//       if (res.widgets) {
//         setWidgets(res.widgets);
//       }
//     } catch (err) {
//       console.log('error', err);
//     }
//   };

//   const fetchConfigs = async (scenarioID) => {
//     try {
//       const res = await triggerGetConfigs(scenarioID).unwrap();
//       if (res.configs) {
//         setConfigs(res.configs);
//       }
//     } catch (err) {
//       console.log('error', err);
//     }
//   };

//   const handleKeydown = useCallback((e) => {
//     switch (e.key) {
//       case ' ':
//       case 'p':
//         setPaused(prevPaused => !prevPaused);
//         break;
//       case 'e':
//         setEditing(prevEditing => !prevEditing);
//         break;
//       case 'f':
//         toggleFullscreen();
//         break;
//       default:
//     }
//   }, [toggleFullscreen]);

//   useEffect(() => {
//     window.addEventListener('keydown', handleKeydown);
//     return () => {
//       window.removeEventListener('keydown', handleKeydown);
//     };
//   }, [handleKeydown]);

//   const handleDrop = async (widget) => {
//     widget.dashboardID = dashboard.id;

//     if (widget.type === 'ICstatus') {
//       let allICids = ics.map(ic => ic.id);
//       widget.customProperties.checkedIDs = allICids;
//     }

//     try {
//       const res = await addWidget(widget).unwrap();
//       if (res) {
//         fetchWidgets(dashboard.id);
//       }
//     } catch (err) {
//       console.log('error', err);
//     }
//   };

//   const widgetChange = async (widget) => {
//     setWidgetChangeData(prevWidgetChangeData => [...prevWidgetChangeData, widget]);

//     try {
//       await updateWidget({ widgetID: widget.id, updatedWidget: { widget } }).unwrap();
//       fetchWidgets(dashboard.id);
//     } catch (err) {
//       console.log('error', err);
//     }
//   };

//   const onChange = async (widget) => {
//     try {
//       await updateWidget({ widgetID: widget.id, updatedWidget: { widget } }).unwrap();
//       fetchWidgets(dashboard.id);
//     } catch (err) {
//       console.log('error', err);
//     }
//   };

//   const onSimulationStarted = () => {
//     widgets.forEach(async (widget) => {
//       if (startUpdaterWidgets.has(widget.type)) {
//         widget.customProperties.simStartedSendValue = true;
//         try {
//           await updateWidget({ widgetID: widget.id, updatedWidget: { widget } }).unwrap();
//         } catch (err) {
//           console.log('error', err);
//         }
//       }
//     });
//   };

//   const editWidget = (widget, index) => {
//     setEditModal(true);
//     setModalData(widget);
//     setModalIndex(index);
//   };

//   const duplicateWidget = async (widget) => {
//     let widgetCopy = { ...widget, id: undefined, x: widget.x + 50, y: widget.y + 50 };
//     try {
//       const res = await addWidget({ widget: widgetCopy }).unwrap();
//       if (res) {
//         fetchWidgets(dashboard.id);
//       }
//     } catch (err) {
//       console.log('error', err);
//     }
//   };

//   const startEditFiles = () => {
//     let tempFiles = files.map(file => ({ id: file.id, name: file.name }));
//     setFilesEditModal(true);
//     setFilesEditSaveState(tempFiles);
//   };

//   const closeEditFiles = () => {
//     widgets.forEach(widget => {
//       if (widget.type === "Image") {
//         widget.customProperties.update = true;
//       }
//     });
//     setFilesEditModal(false);
//   };

//   const closeEdit = async (data) => {
//     if (!data) {
//       setEditModal(false);
//       setModalData(null);
//       setModalIndex(null);
//       return;
//     }

//     if (data.type === "Image") {
//       data.customProperties.update = true;
//     }

//     try {
//       await updateWidget({ widgetID: data.id, updatedWidget: { widget: data } }).unwrap();
//       fetchWidgets(dashboard.id);
//     } catch (err) {
//       console.log('error', err);
//     }

//     setEditModal(false);
//     setModalData(null);
//     setModalIndex(null);
//   };

//   const deleteWidget = async (widgetID) => {
//     try {
//       await deleteWidgetMutation(widgetID).unwrap();
//       fetchWidgets(dashboard.id);
//     } catch (err) {
//       console.log('error', err);
//     }
//   };

//   const startEditing = () => {
//     let originalIDs = widgets.map(widget => widget.id);
//     widgets.forEach(async (widget) => {
//       if (widget.type === 'Slider' || widget.type === 'NumberInput' || widget.type === 'Button') {
//         try {
//           await updateWidget({ widgetID: widget.id, updatedWidget: { widget } }).unwrap();
//         } catch (err) {
//           console.log('error', err);
//         }
//       } else if (widget.type === 'Image') {
//         widget.customProperties.update = true;
//       }
//     });
//     setEditing(true);
//     setWidgetOrigIDs(originalIDs);
//   };

//   const saveEditing = () => {
//     widgets.forEach(async (widget) => {
//       if (widget.type === 'Image') {
//         widget.customProperties.update = true;
//       }
//       try {
//         await updateWidget({ widgetID: widget.id, updatedWidget: { widget } }).unwrap();
//       } catch (err) {
//         console.log('error', err);
//       }
//     });
//     setEditing(false);
//     setWidgetChangeData([]);
//   };

//   const cancelEditing = () => {
//     widgets.forEach(async (widget) => {
//       if (widget.type === 'Image') {
//         widget.customProperties.update = true;
//       }
//       if (!widgetOrigIDs.includes(widget.id)) {
//         try {
//           await deleteWidget(widget.id).unwrap();
//         } catch (err) {
//           console.log('error', err);
//         }
//       }
//     });
//     setEditing(false);
//     setWidgetChangeData([]);
//   };

//   const setGrid = (value) => {
//     setState(prevState => ({ ...prevState, dashboard: { ...dashboard, grid: value } }));
//   };

//   const setDashboardSize = (value) => {
//     const maxHeight = Object.values(widgets).reduce((currentHeight, widget) => {
//       const absolutHeight = widget.y + widget.height;
//       return absolutHeight > currentHeight ? absolutHeight : currentHeight;
//     }, 0);

//     if (value === -1) {
//       if (dashboard.height >= 450 && dashboard.height >= (maxHeight + 80)) {
//         setState(prevState => ({ ...prevState, dashboard: { ...dashboard, height: dashboard.height - 50 } }));
//       }
//     } else {
//       setState(prevState => ({ ...prevState, dashboard: { ...dashboard, height: dashboard.height + 50 } }));
//     }
//   };

//   const pauseData = () => setPaused(true);
//   const unpauseData = () => setPaused(false);
//   const editInputSignals = () => setEditInputSignalsModal(true);
//   const editOutputSignals = () => setEditOutputSignalsModal(true);

//   const closeEditSignalsModal = (direction) => {
//     if (direction === "in") {
//       setEditInputSignalsModal(false);
//     } else if (direction === "out") {
//       setEditOutputSignalsModal(false);
//     }
//   };

//   const buttonStyle = { marginLeft: '10px' };
//   const iconStyle = { height: '25px', width: '25px' };
//   const grid = dashboard.grid;
//   const boxClasses = classNames('section', 'box', { 'fullscreen-padding': isFullscreen });
//   let dropZoneHeight = dashboard.height;

//   if (isDashboardLoading) {
//     return <div>Loading...</div>;
//   }

//   if (dashboardError) {
//     return <div>Error. Dashboard not found</div>;
//   }

//   return (
//     <div className={boxClasses}>
//       <div key={"header-box"} className='section-header box-header'>
//         <div key={"title"} className="section-title">
//           <h2>
//             {dashboard.name}
//             <span key={"toggle-lock-button"} className='icon-button'>
//               <IconToggleButton
//                 childKey={0}
//                 checked={locked}
//                 index={dashboard.id}
//                 checkedIcon='lock'
//                 uncheckedIcon='lock-open'
//                 tooltipChecked='Dashboard is locked, cannot be edited'
//                 tooltipUnchecked='Dashboard is unlocked, can be edited'
//                 disabled={true}
//                 buttonStyle={buttonStyle}
//                 iconStyle={iconStyle}
//               />
//             </span>
//           </h2>
//         </div>

//         <DashboardButtonGroup
//           key={"dashboard-buttons"}
//           locked={locked}
//           editing={editing}
//           onEdit={startEditing}
//           fullscreen={isFullscreen}
//           paused={paused}
//           onSave={saveEditing}
//           onCancel={cancelEditing}
//           onFullscreen={toggleFullscreen}
//           onPause={pauseData}
//           onUnpause={unpauseData}
//           onEditFiles={startEditFiles}
//           onEditOutputSignals={editOutputSignals}
//           onEditInputSignals={editInputSignals}
//         />
//       </div>

//       <div key={"dashboard-area"} className="box box-content" onContextMenu={(e) => e.preventDefault()}>
//         {editing &&
//           <WidgetToolbox
//             key={"widget-toolbox"}
//             grid={grid}
//             onGridChange={setGrid}
//             dashboard={dashboard}
//             onDashboardSizeChange={setDashboardSize}
//             widgets={widgets}
//           />
//         }

//         <WidgetArea
//           key={"widget-area"}
//           widgets={widgets}
//           editing={editing}
//           dropZoneHeight={dropZoneHeight}
//           grid={grid}
//           onWidgetAdded={handleDrop}
//         >
//           {widgets != null && Object.keys(widgets).map(widgetKey => (
//             <div key={"widget-container-wrapper" + widgetKey}>
//               <WidgetContainer
//                 widget={widgets[widgetKey]}
//                 key={"widget-container" + widgetKey}
//                 index={parseInt(widgetKey, 10)}
//                 grid={grid}
//                 onWidgetChange={widgetChange}
//                 editing={editing}
//                 paused={paused}
//                 onEdit={editWidget}
//                 onDuplicate={duplicateWidget}
//                 onDelete={(widget, index) => deleteWidget(widget.id)}
//                 onChange={editing ? widgetChange : onChange}
//               >
//                 <Widget
//                   key={"widget" + widgetKey}
//                   data={widgets[widgetKey]}
//                   editing={editing}
//                   index={parseInt(widgetKey, 10)}
//                   paused={paused}
//                   onSimulationStarted={onSimulationStarted}
//                   ics={ics}
//                   configs={configs}
//                   scenarioID={dashboard.scenarioID}
//                 />
//               </WidgetContainer>
//             </div>
//           ))}
//         </WidgetArea>

//         <EditWidget
//           key={"edit-widget"}
//           sessionToken={sessionToken}
//           show={editModal}
//           onClose={closeEdit}
//           widget={modalData}
//           signals={signals}
//           files={files}
//           ics={ics}
//           configs={configs}
//           scenarioID={dashboard.scenarioID}
//         />

//         <EditSignalMappingDialog
//           key={"edit-signal-mapping-input-dialog"}
//           show={editInputSignalsModal}
//           onCloseEdit={closeEditSignalsModal}
//           direction="Input"
//           signals={signals}
//           configID={null}
//           configs={configs}
//           sessionToken={sessionToken}
//         />
//       </div>
//     </div>
//   );
// };

// export default Fullscreenable()(Dashboard);

const Dashboard = (props) => {
  return <div></div>
}

export default Dashboard;
