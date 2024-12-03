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

import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetDashboardQuery,
  useGetICSQuery,
  useGetWidgetsQuery,
  useAddWidgetMutation,
  useLazyGetSignalsQuery,
  useLazyGetConfigsQuery,
  useUpdateWidgetMutation,
} from "../../store/apiSlice";
import { sessionToken } from "../../localStorage";
import Fullscreenable from "react-fullscreenable";
import DashboardButtonGroup from "./grid/dashboard-button-group";
import Widget from "./widget/widget";
import WidgetContainer from "./widget/widget-container";
import WidgetArea from "./grid/widget-area";
import WidgetToolbox from "./widget/widget-toolbox";
import IconToggleButton from "../../common/buttons/icon-toggle-button";
import EditWidgetDialog from "./widget/edit-widget/edit-widget";
import EditSignalMappingDialog from "../scenarios/dialogs/edit-signal-mapping";
import classNames from "classnames";
import { Spinner } from "react-bootstrap";

//this component handles the UI of the dashboard
const DashboardLayout = ({ isFullscreen, toggleFullscreen }) => {
  const params = useParams();
  const {
    data: { dashboard } = {},
    isFetching: isFetchingDashboard,
    refetch: refetchDashboard,
  } = useGetDashboardQuery(params.dashboard);
  const {
    data: { widgets } = [],
    isFetching: isFetchingWidgets,
    refetch: refetchWidgets,
  } = useGetWidgetsQuery(params.dashboard);

  const [updateWidget] = useUpdateWidgetMutation();

  const [triggerGetSignals] = useLazyGetSignalsQuery();
  const [triggerGetConfigs] = useLazyGetConfigsQuery();

  const [signals, setSignals] = useState([]);
  const [configs, setConfigs] = useState([]);

  const [addWidget] = useAddWidgetMutation();

  const { data: ics } = useGetICSQuery();

  const [editing, setEditing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [locked, setLocked] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState(null);

  const [editInputSignalsModal, setEditingInputSignalsModal] = useState(false);

  //these are used to handle widget updates separately from RTK Query
  const [localWidgets, setLocalWidgets] = useState([]);
  const [widgetsToUpdate, setWidgetsToUpdate] = useState([]);

  useEffect(() => {
    if (widgets?.length > 0) {
      setLocalWidgets(widgets);
    }
  }, [widgets]);

  const fetchWidgetData = async (scenarioID) => {
    try {
      const configsRes = await triggerGetConfigs(scenarioID).unwrap();
      if (configsRes.configs) {
        setConfigs(configsRes.configs);
        //load signals if there are any configs

        if (configsRes.configs.length > 0) {
          for (const config of configsRes.configs) {
            const signalsInRes = await triggerGetSignals({
              configID: config.id,
              direction: "in",
            }).unwrap();
            const signalsOutRes = await triggerGetSignals({
              configID: config.id,
              direction: "out",
            }).unwrap();
            setSignals((prevState) => [
              ...signalsInRes.signals,
              ...signalsOutRes.signals,
              ...prevState,
            ]);
          }
        }
      }
    } catch (err) {
      console.log("error fetching data", err);
    }
  };

  const [gridParameters, setGridParameters] = useState({
    height: 10,
    grid: 50,
  });

  useEffect(() => {
    if (!isFetchingDashboard) {
      setGridParameters({ height: dashboard.height, grid: dashboard.grid });
      fetchWidgetData(dashboard.scenarioID);
    }
  }, [isFetchingDashboard]);

  const boxClasses = classNames("section", "box", {
    "fullscreen-padding": isFullscreen,
  });

  const handleKeydown = useCallback(
    (e) => {
      const keyMap = {
        " ": () => setPaused((prevPaused) => !prevPaused),
        p: () => setPaused((prevPaused) => !prevPaused),
        e: () => setEditing((prevEditing) => !prevEditing),
        f: toggleFullscreen,
      };
      if (keyMap[e.key]) {
        keyMap[e.key]();
      }
    },
    [toggleFullscreen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

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
      }
    });
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (
      gridParameters.height !== dashboard?.height ||
      gridParameters.grid !== dashboard?.grid
    ) {
      try {
        const { height: oldHeight, grid: oldGrid, ...rest } = dashboard;
        await updateDashboard({
          dashboardID: dashboard?.id,
          dashboard: {
            height: gridParameters.height,
            grid: gridParameters.grid,
            ...rest,
          },
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
        refetchWidgets(dashboard?.id);
      } catch (err) {
        console.log("error", err);
      }
    }

    setEditing(false);
    setWidgetChangeData([]);
  };

  const handleWidgetChange = async (widget) => {
    setWidgetsToUpdate((prevWidgetsToUpdate) => [
      ...prevWidgetsToUpdate,
      widget.id,
    ]);
    setLocalWidgets((prevWidgets) =>
      prevWidgets.map((w) => (w.id === widget.id ? { ...widget } : w))
    );
  };

  const handleCloseEditModal = async (data) => {
    if (!data) {
      setEditModal(false);
      setEditModalData(null);
      return;
    }

    if (data.type === "Image") {
      data.customProperties.update = true;
    }

    try {
      await updateWidget({
        widgetID: data.id,
        updatedWidget: { widget: data },
      }).unwrap();
      refetchWidgets(dashboard?.id);
    } catch (err) {
      console.log("error", err);
    }

    setEditModal(false);
    setEditModalData(null);
  };

  const handleCancelEdit = () => {
    refetchWidgets();
    setEditing(false);
    setWidgetChangeData([]);
    setGridParameters({ height: dashboard?.height, grid: dashboard?.grid });
  };

  const handleNewWidgetAdded = async (widget) => {
    widget.dashboardID = dashboard?.id;

    if (widget.type === "ICstatus") {
      let allICids = ics.map((ic) => ic.id);
      widget.customProperties.checkedIDs = allICids;
    }

    try {
      const res = await addWidget(widget).unwrap();
      if (res) {
        refetchWidgets(dashboard?.id);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const editWidget = (widget, index) => {
    setEditModal(true);
    setEditModalData({ ...widget });
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
        refetchWidgets(dashboard?.id);
      }
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
      refetchWidgets(dashboard?.id);
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleCloseEditSignalsModal = (direction) => {
    if (direction === "in") {
      setEditInputSignalsModal(false);
    } else if (direction === "out") {
      setEditOutputSignalsModal(false);
    }
  };

  return !isFetchingWidgets && !isFetchingDashboard ? (
    <div className={boxClasses}>
      <div key={"header-box"} className="section-header box-header">
        <div key={"title"} className="section-title">
          <h2>
            {dashboard?.name}
            <span key={"toggle-lock-button"} className="icon-button">
              <IconToggleButton
                childKey={0}
                checked={locked}
                index={dashboard?.id}
                checkedIcon="lock"
                uncheckedIcon="lock-open"
                tooltipChecked="Dashboard is locked, cannot be edited"
                tooltipUnchecked="Dashboard is unlocked, can be edited"
                disabled={true}
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
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          onFullscreen={toggleFullscreen}
          onPause={() => setPaused(true)}
          onUnpause={() => setPaused(false)}
          onEditFiles={() => {}}
          onEditOutputSignals={() => setEditInputSignalsModal(true)}
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
            grid={gridParameters.grid}
            onGridChange={(val) =>
              setGridParameters((prevState) => ({ ...prevState, grid: val }))
            }
            dashboard={dashboard}
            onDashboardSizeChange={(val) =>
              setGridParameters((prevState) => ({ ...prevState, height: val }))
            }
            widgets={localWidgets}
          />
        )}

        <WidgetArea
          key={"widget-area"}
          widgets={localWidgets}
          editing={editing}
          dropZoneHeight={gridParameters.height}
          grid={gridParameters.grid}
          onWidgetAdded={handleNewWidgetAdded}
        >
          {localWidgets != null &&
            Object.keys(localWidgets).map((widgetKey) => (
              <div key={"widget-container-wrapper" + widgetKey}>
                <WidgetContainer
                  widget={JSON.parse(JSON.stringify(localWidgets[widgetKey]))}
                  key={"widget-container" + widgetKey}
                  index={parseInt(widgetKey, 10)}
                  grid={gridParameters.grid}
                  onWidgetChange={handleWidgetChange}
                  editing={editing}
                  paused={paused}
                  onEdit={editWidget}
                  onDuplicate={duplicateWidget}
                  onDelete={(widget, index) => deleteWidget(widget.id)}
                  onChange={editing ? handleWidgetChange : onChange}
                >
                  <Widget
                    widget={JSON.parse(JSON.stringify(localWidgets[widgetKey]))}
                    editing={editing}
                    paused={paused}
                    scenarioID={dashboard?.scenarioID}
                  />
                </WidgetContainer>
              </div>
            ))}
        </WidgetArea>

        <EditWidgetDialog
          key={"edit-widget"}
          sessionToken={sessionToken}
          show={editModal}
          onClose={handleCloseEditModal}
          widget={editModalData}
          scenarioID={dashboard?.scenarioID}
          configs={configs}
          signals={signals}
        />

        {/* <EditFilesDialog
              key={"edit-files-dialog"}
              sessionToken={this.state.sessionToken}
              show={this.state.filesEditModal}
              onClose={this.closeEditFiles.bind(this)}
              signals={this.state.signals}
              files={this.state.files}
              scenarioID={this.state.dashboard?.scenarioID}
              locked={this.state.locked}
            /> */}

        <EditSignalMappingDialog
          key={"edit-signal-mapping-input-dialog"}
          show={editInputSignalsModal}
          onCloseEdit={handleCloseEditSignalsModal}
          direction="Input"
          configID={null}
          sessionToken={sessionToken}
          configs={configs}
          signals={signals}
        />
      </div>
    </div>
  ) : (
    <Spinner className="mt-2 ms-2" />
  );
};

export default Fullscreenable()(DashboardLayout);
