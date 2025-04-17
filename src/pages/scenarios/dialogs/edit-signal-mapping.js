import { useState, useEffect } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  Table,
  ButtonColumn,
  CheckboxColumn,
  DataColumn,
} from "../../../common/table";
import {
  dialogWarningLabel,
  signalDialogCheckButton,
  buttonStyle,
} from "../styles";
import Dialog from "../../../common/dialogs/dialog";
import Icon from "../../../common/icon";
import {
  useGetSignalsQuery,
  useAddSignalMutation,
  useDeleteSignalMutation,
  useUpdateSignalMutation,
} from "../../../store/apiSlice";
import { Collapse } from "react-collapse";

const EditSignalMappingDialog = ({ show, direction, onClose, configID }) => {
  const [isCollapseOpened, setCollapseOpened] = useState(false);
  const [checkedSignalsIDs, setCheckedSignalsIDs] = useState([]);
  const { data, refetch: refetchSignals } = useGetSignalsQuery({
    configID: configID,
    direction: direction,
  });
  const [addSignalToConfig] = useAddSignalMutation();
  const [deleteSignal] = useDeleteSignalMutation();
  const [updateSignal] = useUpdateSignalMutation();
  const signals = data ? data.signals : [];

  const [updatedSignals, setUpdatedSignals] = useState([]);
  const [updatedSignalsIDs, setUpdatedSignalsIDs] = useState([]);

  useEffect(() => {
    if (signals.length > 0) {
      setUpdatedSignals([...signals]);
    }
  }, [signals]);

  const handleMappingChange = (e, row, column) => {
    const signalToUpdate = { ...updatedSignals[row] };
    switch (column) {
      case 1:
        signalToUpdate.index = Number(e.target.value);
        break;
      case 2:
        signalToUpdate.name = e.target.value;
        break;
      case 3:
        signalToUpdate.unit = e.target.value;
        break;
      case 4:
        signalToUpdate.scalingFactor = e.target.value;
        break;
      default:
        break;
    }

    setUpdatedSignals((prevState) =>
      prevState.map((signal, index) =>
        index === row ? signalToUpdate : signal
      )
    );

    setUpdatedSignalsIDs((prevState) => [signalToUpdate.id, ...prevState]);
  };

  const handleAdd = async () => {
    let largestIndex = -1;
    signals.forEach((signal) => {
      if (signal.index > largestIndex) {
        largestIndex = signal.index;
      }
    });

    const newSignal = {
      configID: configID,
      direction: direction,
      name: "PlaceholderName",
      unit: "PlaceholderUnit",
      index: largestIndex + 1,
      scalingFactor: 1.0,
    };

    try {
      await addSignalToConfig(newSignal).unwrap();
    } catch (err) {
      console.log(err);
    }

    refetchSignals();
  };

  const handleDelete = async (signalID) => {
    try {
      await deleteSignal(signalID).unwrap();
    } catch (err) {
      console.log(err);
    }

    refetchSignals();
  };

  const handleUpdate = async () => {
    try {
      for (let id of updatedSignalsIDs) {
        const signalToUpdate = updatedSignals.find(
          (signal) => signal.id === id
        );

        if (signalToUpdate) {
          console.log(signalToUpdate)
          await updateSignal({
            signalID: id,
            updatedSignal: signalToUpdate,
          }).unwrap();
        }
      }

      refetchSignals();
      setUpdatedSignalsIDs([]);
    } catch (error) {
      console.error("Error updating signals:", error);
    }
  };

  const onSignalChecked = (signal, event) => {
    if (!checkedSignalsIDs.includes(signal.id)) {
      setCheckedSignalsIDs((prevState) => [...prevState, signal.id]);
    } else {
      const index = checkedSignalsIDs.indexOf(signal.id);
      setCheckedSignalsIDs((prevState) =>
        prevState.filter((_, i) => i !== index)
      );
    }
  };

  const isSignalChecked = (signal) => {
    return checkedSignalsIDs.includes(signal.id);
  };

  const toggleCheckAll = () => {
    //check if all signals are already checked
    if (checkedSignalsIDs.length === signals.length) {
      setCheckedSignalsIDs([]);
    } else {
      signals.forEach((signal) => {
        if (!checkedSignalsIDs.includes(signal.id)) {
          setCheckedSignalsIDs((prevState) => [...prevState, signal.id]);
        }
      });
    }
  };

  const deleteCheckedSignals = async () => {
    if (checkedSignalsIDs.length > 0) {
      try {
        const deletePromises = checkedSignalsIDs.map((signalID) =>
          deleteSignal(signalID).unwrap()
        );
        await Promise.all(deletePromises);
        refetchSignals();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const DialogWindow = (
    <Dialog
      show={show}
      title={"Edit Signal " + direction + " Mapping"}
      buttonTitle="Close"
      blendOutCancel={true}
      onClose={(c) => {
        handleUpdate();
        onClose(c);
      }}
      onReset={() => {}}
      valid={true}
    >
      <Form.Group>
        <Form.Label style={dialogWarningLabel}>
          IMPORTANT: Signal configurations that were created before January 2022
          have to be fixed manually. Signal indices have to start at 0 and not
          1.
        </Form.Label>
        <Form.Label>
          {" "}
          <i>Click in table cell to edit</i>
        </Form.Label>
        <Table
          breakWord={true}
          checkbox
          onChecked={(signal) => onSignalChecked(signal)}
          data={updatedSignals}
        >
          <CheckboxColumn
            onChecked={(index, event) => onSignalChecked(index, event)}
            checked={(signal) => isSignalChecked(signal)}
            width="30"
          />
          <DataColumn
            title="Index"
            dataKey="index"
            inlineEditable
            inputType="number"
            onInlineChange={(e, row, column) =>
              handleMappingChange(e, row, column)
            }
          />
          <DataColumn
            title="Name"
            dataKey="name"
            inlineEditable
            inputType="text"
            onInlineChange={(e, row, column) =>
              handleMappingChange(e, row, column)
            }
          />
          <DataColumn
            title="Unit"
            dataKey="unit"
            inlineEditable
            inputType="text"
            onInlineChange={(e, row, column) =>
              handleMappingChange(e, row, column)
            }
          />
          <DataColumn
            title="Scaling Factor"
            dataKey="scalingFactor"
            inlineEditable
            inputType="number"
            onInlineChange={(e, row, column) =>
              handleMappingChange(e, row, column)
            }
          />
          <ButtonColumn
            title="Remove"
            deleteButton
            onDelete={(index) => handleDelete(signals[index].id)}
          />
        </Table>

        <div className="solid-button" style={signalDialogCheckButton}>
          <OverlayTrigger
            key={0}
            placement="left"
            overlay={
              <Tooltip id={`tooltip-${"check"}`}> Check/Uncheck All </Tooltip>
            }
          >
            <Button
              variant="secondary"
              key={50}
              onClick={() => toggleCheckAll()}
              style={buttonStyle}
            >
              <Icon icon="check" />
            </Button>
          </OverlayTrigger>
          <Button
            variant="secondary"
            key={51}
            onClick={() => deleteCheckedSignals()}
            style={buttonStyle}
          >
            <Icon icon="minus" /> Remove
          </Button>
          <Button
            variant="secondary"
            key={52}
            onClick={() => handleAdd()}
            style={buttonStyle}
          >
            <Icon icon="plus" /> Signal
          </Button>
        </div>
        <div>
          <Collapse isOpened={isCollapseOpened}>
            <h6>Choose a Component Configuration to add the signal to: </h6>
            <div className="solid-button">
              {typeof configs !== "undefined" &&
                configs.map((config) => (
                  <Button
                    variant="secondary"
                    key={config.id}
                    onClick={() => handleAdd(config.id)}
                    style={buttonStyle}
                  >
                    {config.name}
                  </Button>
                ))}
            </div>
          </Collapse>
        </div>
      </Form.Group>
    </Dialog>
  );

  return show ? DialogWindow : <></>;
};

export default EditSignalMappingDialog;
