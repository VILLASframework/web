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

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Fullscreenable from "react-fullscreenable";
import "react-contexify/dist/ReactContexify.min.css";
import EditWidget from "./widget/edit-widget/edit-widget";
import EditSignalMappingDialog from "./dialogs/edit-signal-mapping.jsx";
import WidgetToolbox from "./widget/widget-toolbox";
import WidgetArea from "./grid/widget-area";
import DashboardButtonGroup from "./grid/dashboard-button-group";
import IconToggleButton from "../../common/buttons/icon-toggle-button";
import WidgetContainer from "./widget/widget-container";
import Widget from "./widget/widget.jsx";
import EditFilesDialog from "./dialogs/edit-files-dialog.jsx";

import { disconnect } from "../../store/websocketSlice";
import { useDashboardData } from "./hooks/use-dashboard-data.js";
import useWebSocketConnection from "./hooks/use-websocket-connection.js";

import {
  useGetDashboardQuery,
  useGetICSQuery,
  useLazyGetWidgetsQuery,
  useLazyGetFilesQuery,
  useAddWidgetMutation,
  useUpdateWidgetMutation,
  useDeleteWidgetMutation,
  useUpdateDashboardMutation,
  useDeleteFileMutation,
  useAddFileMutation,
  useUpdateFileMutation,
} from "../../store/apiSlice";
import DashboardLayout from "./dashboard-layout";
import ErrorBoundary from "./dashboard-error-boundry";

const startUpdaterWidgets = new Set(["Slider", "Button", "NumberInput"]);

const Dashboard = ({ isFullscreen, toggleFullscreen }) => {
  const dispatch = useDispatch();
  const { token: sessionToken } = useSelector((state) => state.auth);
  const params = useParams();

  const {
    data: { dashboard } = { dashboard: {} },
    error: dashboardError,
    isLoading: isDashboardLoading,
  } = useGetDashboardQuery(params.dashboard);
  const { data: { ics } = {} } = useGetICSQuery();

  const [triggerGetWidgets] = useLazyGetWidgetsQuery();
  const [triggerDeleteFile] = useDeleteFileMutation();
  const [triggerUploadFile] = useAddFileMutation();
  const [addWidget] = useAddWidgetMutation();
  const [updateWidget] = useUpdateWidgetMutation();
  const [deleteWidgetMutation] = useDeleteWidgetMutation();
  const [updateDashboard] = useUpdateDashboardMutation();
  const [triggerUpdateFile] = useUpdateFileMutation();
  const [triggerGetFiles] = useLazyGetFilesQuery();

  const [widgets, setWidgets] = useState([]);
  const [widgetsToUpdate, setWidgetsToUpdate] = useState([]);
  const [editing, setEditing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [locked, setLocked] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editOutputSignalsModal, setEditOutputSignalsModal] = useState(false);
  const [editInputSignalsModal, setEditInputSignalsModal] = useState(false);
  const [filesEditModal, setFilesEditModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [widgetOrigIDs, setWidgetOrigIDs] = useState([]);
  const [height, setHeight] = useState(10);
  const [grid, setGrid] = useState(50);

  const { files, configs, signals, activeICS, refetchDashboardData } =
    useDashboardData(dashboard.scenarioID);

  //as soon as dashboard is loaded, load widgets, configs, signals and files for this dashboard
  useEffect(() => {
    if (dashboard.id) {
      fetchWidgets(dashboard.id);
      setHeight(dashboard.height);
      setGrid(dashboard.grid);
    }
  }, [dashboard]);

  useWebSocketConnection(activeICS, signals, widgets);

  //disconnect from the websocket on component unmount
  useEffect(() => {
    return () => {
      activeICS.forEach((ic) => {
        dispatch(disconnect({ id: ic.id }));
      });
    };
  }, []);

  const fetchWidgets = async (dashboardID) => {
    try {
      const widgetsRes = await triggerGetWidgets(dashboardID).unwrap();
      if (widgetsRes.widgets) {
        setWidgets(widgetsRes.widgets);
      }
    } catch (err) {
      console.log("error fetching data", err);
    }
  };

  const handleKeydown = useCallback(
    ({ key }) => {
      const actions = {
        " ": () => setPaused((prev) => !prev),
        p: () => setPaused((prev) => !prev),
        e: () => setEditing((prev) => !prev),
        f: toggleFullscreen,
      };
      if (actions[key]) actions[key]();
    },
    [toggleFullscreen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  const handleDrop = async (widget) => {
    widget.dashboardID = dashboard.id;

    if (widget.type === "ICstatus") {
      let allICids = ics.map((ic) => ic.id);
      widget.customProperties.checkedIDs = allICids;
    }

    try {
      const res = await addWidget(widget).unwrap();
      if (res) {
        fetchWidgets(dashboard.id);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const widgetChange = async (widget) => {
    setWidgetsToUpdate((prevWidgetsToUpdate) => [
      ...prevWidgetsToUpdate,
      widget.id,
    ]);
    setWidgets((prevWidgets) =>
      prevWidgets.map((w) => (w.id === widget.id ? { ...widget } : w))
    );

    try {
      await updateWidget({
        widgetID: widget.id,
        updatedWidget: { widget },
      }).unwrap();
      fetchWidgets(dashboard.id);
    } catch (err) {
      console.log("error", err);
    }
  };

  const onChange = async (widget) => {
    try {
      await updateWidget({
        widgetID: widget.id,
        updatedWidget: { widget: widget },
      }).unwrap();
      fetchWidgets(dashboard.id);
    } catch (err) {
      console.log("error", err);
    }
  };

  const onSimulationStarted = () => {
    widgets.forEach(async (widget) => {
      if (startUpdaterWidgets.has(widget.type)) {
        const updatedWidget = {
          ...widget,
          customProperties: {
            ...widget.customProperties,
            simStartedSendValue: true,
          },
        };
        try {
          await updateWidget({
            widgetID: widget.id,
            updatedWidget: { widget: updatedWidget },
          }).unwrap();
        } catch (err) {
          console.log("error", err);
        }
      }
    });

    fetchWidgets(dashboard.id);
  };

  const editWidget = (widget, index) => {
    setEditModal(true);
    setModalData({ ...widget });
  };

  const duplicateWidget = async (widget) => {
    let widgetCopy = {
      ...widget,
      id: undefined,
      x: widget.x + 50,
      y: widget.y + 50,
    };
    try {
      const res = await addWidget({ widget: widgetCopy }).unwrap();
      if (res) {
        fetchWidgets(dashboard.id);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const closeEditFiles = () => {
    widgets.forEach((widget) => {
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
      return;
    }

    if (data.type === "Image") {
      data.customProperties.update = true;
    }

    console.log("UPDATING WIDGET", data);

    try {
      await updateWidget({
        widgetID: data.id,
        updatedWidget: { widget: data },
      }).unwrap();
      fetchWidgets(dashboard.id);
    } catch (err) {
      console.log("error", err);
    }

    setEditModal(false);
    setModalData(null);
  };

  const deleteWidget = async (widgetID) => {
    try {
      await deleteWidgetMutation(widgetID).unwrap();
      fetchWidgets(dashboard.id);
    } catch (err) {
      console.log("error", err);
    }
  };

  const startEditing = () => {
    let originalIDs = widgets.map((widget) => widget.id);
    widgets.forEach(async (widget) => {
      if (
        widget.type === "Slider" ||
        widget.type === "NumberInput" ||
        widget.type === "Button"
      ) {
        try {
          await updateWidget({
            widgetID: widget.id,
            updatedWidget: { widget },
          }).unwrap();
        } catch (err) {
          console.log("error", err);
        }
      } else if (widget.type === "Image") {
        //widget.customProperties.update = true;
      }
    });
    setEditing(true);
    setWidgetOrigIDs(originalIDs);
  };

  const saveEditing = async () => {
    widgets.forEach(async (widget) => {
      if (widget.type === "Image") {
        widget.customProperties.update = true;
      }
      try {
        await updateWidget({
          widgetID: widget.id,
          updatedWidget: { widget },
        }).unwrap();
      } catch (err) {
        console.log("error", err);
      }
    });

    if (height !== dashboard.height || grid !== dashboard.grid) {
      try {
        const { height: oldHeight, grid: oldGrid, ...rest } = dashboard;
        await updateDashboard({
          dashboardID: dashboard.id,
          dashboard: { height: height, grid: grid, ...rest },
        }).unwrap();
      } catch (err) {
        console.log("error", err);
      }
    }

    if (widgetsToUpdate.length > 0) {
      try {
        for (const index in widgetsToUpdate) {
          await updateWidget({
            widgetID: widgetsToUpdate[index],
            updatedWidget: {
              widget: {
                ...widgets.find((w) => w.id == widgetsToUpdate[index]),
              },
            },
          }).unwrap();
        }
        fetchWidgets(dashboard.id);
      } catch (err) {
        console.log("error", err);
      }
    }

    setEditing(false);
  };

  const cancelEditing = () => {
    widgets.forEach(async (widget) => {
      if (widget.type === "Image") {
        widget.customProperties.update = true;
      }
      if (!widgetOrigIDs.includes(widget.id)) {
        try {
          await deleteWidget(widget.id).unwrap();
        } catch (err) {
          console.log("error", err);
        }
      }
    });
    fetchWidgets(dashboard.id);
    setEditing(false);
    setHeight(dashboard.height);
    setGrid(dashboard.grid);
  };

  const uploadFile = async (file) => {
    await triggerUploadFile({
      scenarioID: dashboard.scenarioID,
      file: file,
    })
      .then(async () => {
        await triggerGetFiles(dashboard.scenarioID).then((fs) => {
          setFiles(fs.data.files);
        });
      })
      .catch((e) => {
        console.log(`File upload failed: ${e}`);
      });
  };

  const deleteFile = async (index) => {
    let file = files[index];
    if (file !== undefined) {
      await triggerDeleteFile(file.id)
        .then(async () => {
          await triggerGetFiles(dashboard.scenarioID)
            .then((fs) => {
              setFiles(fs.data.files);
            })
            .catch((e) => {
              console.log(`Error fetching files: ${e}`);
            });
        })
        .catch((e) => {
          console.log(`Error deleting: ${e}`);
        });
    }
  };

  const updateFile = async (fileId, file) => {
    try {
      await triggerUpdateFile({ fileID: fileId, file: file })
        .then(async () => {
          await triggerGetFiles(dashboard.scenarioID)
            .then((fs) => {
              setFiles(fs.data.files);
            })
            .catch((e) => {
              console.log(`Error fetching files: ${e}`);
            });
        })
        .catch((e) => {
          console.log(`Error deleting: ${e}`);
        });
    } catch (error) {
      console.error("Error updating file:", error);
    }
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
      if (dashboard.height >= 450 && dashboard.height >= maxHeight + 80) {
        setHeight((prevState) => prevState - 50);
      }
    } else {
      setHeight((prevState) => prevState + 50);
    }
  };

  if (isDashboardLoading) {
    return <Spinner />;
  }

  if (dashboardError) {
    return <div>Error. Dashboard not found!</div>;
  }

  return (
    <div
      className={`section box ${
        isFullscreen ? "fullscreen-padding" : ""
      }`.trim()}
    >
      <div key={"header-box"} className="section-header box-header">
        <div key={"title"} className="section-title">
          <h2>
            {dashboard.name}
            <span key={"toggle-lock-button"} className="icon-button">
              <IconToggleButton
                childKey={0}
                checked={locked}
                index={dashboard.id}
                checkedIcon="lock"
                uncheckedIcon="lock-open"
                tooltipChecked="Dashboard is locked, cannot be edited"
                tooltipUnchecked="Dashboard is unlocked, can be edited"
                onChange={() => setLocked(!locked)}
                buttonStyle={{ marginLeft: "10px" }}
                iconStyle={{ height: "25px", width: "25px" }}
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
          onPause={() => setPaused(true)}
          onUnpause={() => setPaused(false)}
          onEditFiles={() => setFilesEditModal(true)}
          onEditOutputSignals={() => setEditOutputSignalsModal(true)}
          onEditInputSignals={() => setEditInputSignalsModal(true)}
        />
      </div>

      <div
        key={"dashboard-area"}
        className="box box-content"
        onContextMenu={(e) => e.preventDefault()}
      >
        {editing && (
          <WidgetToolbox
            key={"widget-toolbox"}
            grid={grid}
            onGridChange={updateGrid}
            dashboard={dashboard}
            onDashboardSizeChange={updateHeight}
            widgets={widgets}
          />
        )}

        <WidgetArea
          key={"widget-area"}
          widgets={widgets}
          editing={editing}
          dropZoneHeight={height}
          grid={grid}
          onWidgetAdded={handleDrop}
        >
          {widgets != null &&
            Object.keys(widgets).map((widgetKey) => (
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

        <EditSignalMappingDialog
          key={"edit-signal-mapping-input-dialog"}
          show={editInputSignalsModal}
          onClose={() => setEditInputSignalsModal(false)}
          direction="in"
          signals={[...signals].filter((s) => s.direction == "in")}
          configID={null}
          configs={configs}
          sessionToken={sessionToken}
          refetch={refetchDashboardData}
        />

        <EditSignalMappingDialog
          key={"edit-signal-mapping-output-dialog"}
          show={editOutputSignalsModal}
          onClose={() => setEditOutputSignalsModal(false)}
          direction="out"
          signals={[...signals].filter((s) => s.direction == "out")}
          configID={null}
          configs={configs}
          sessionToken={sessionToken}
          refetch={refetchDashboardData}
        />

        <EditFilesDialog
          key={"edit-files-dialog"}
          sessionToken={sessionToken}
          show={filesEditModal}
          uploadFile={uploadFile}
          updateFile={updateFile}
          deleteFile={deleteFile}
          onClose={closeEditFiles}
          files={files}
          scenarioID={dashboard.scenarioID}
          locked={locked}
        />
      </div>
    </div>
  );
};

export default Dashboard;
