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

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import IconButton from "../../../common/buttons/icon-button";
import { Table, ButtonColumn, CheckboxColumn, DataColumn } from "../../../common/table";
import { tableHeadingStyle, buttonStyle, iconStyle } from "../styles";
import NewDialog from "../../../common/dialogs/new-dialog";
import ImportConfigDialog from "../dialogs/import-config";
import DeleteDialog from "../../../common/dialogs/delete-dialog";
import NotificationsFactory from "../../../common/data-managers/notifications-factory";
import notificationsDataManager from "../../../common/data-managers/notifications-data-manager";
import EditSignalMappingDialog from '../dialogs/edit-signal-mapping';
import FileSaver from "file-saver";
import {
  useGetConfigsQuery, 
  useAddComponentConfigMutation, 
  useDeleteComponentConfigMutation,
  useLazyGetSignalsQuery,
  useAddSignalMutation,
} from "../../../store/apiSlice";
import ConfigActionBoard from "./config-action-board";


const ConfigsTable = ({scenario, ics}) => {
    const {data, refetch: refetchConfigs } = useGetConfigsQuery(scenario.id);
    const [addComponentConfig] = useAddComponentConfigMutation();
    const [deleteComponentConfig] = useDeleteComponentConfigMutation();
    const [addSignalToConfig] = useAddSignalMutation();
    const [triggerGetSignals] = useLazyGetSignalsQuery();
    const configs = data ? data.configs : [];
    const [signals, setSignals] = useState({});

    const [isNewModalOpened, setIsNewModalOpened] = useState(false);
    const [isImportModalOpened, setIsImportModalOpened] = useState(false);
    const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
    const [isEditSignalMappingModalOpened, setIsEditSignalMappingModalOpened] = useState(false);
    const [signalMappingConfigID, setSignalMappingConfigID] = useState(0);
    const [mappingModalDirection, setMappingModalDirection] = useState('in');
    const [configToDelete, setConfigToDelete] = useState({name: ''});
    const [checkedConfigsIDs, setCheckedConfigsIDs] = useState([]);
    const [areAllConfigsChecked, setAreAllConfigsChecked] = useState(false);

    const { user: currentUser, token: sessionToken } = useSelector((state) => state.auth);

    useEffect(() => {
      if(configs.length > 0) {
        configs.forEach(config => {
          getBothSignals(config.id);
        })
      }
    }, [configs])

    const getBothSignals = async(configID) => {
      try {
        const resIn = await triggerGetSignals({configID: configID, direction: 'in'}).unwrap();
        const resOut = await triggerGetSignals({configID: configID, direction: 'out'}).unwrap();
        setSignals(prevSignals => ({...prevSignals, [configID]: resIn.signals.concat(resOut.signals).length > 0 ? resIn.signals.concat(resOut.signals) : []}))
      } catch (err) {
        console.log('error', err);
        return [];
      }
    }

    const newConfig = async (data) => {
      if(data){
        const config = {
          config: {
            ScenarioID: scenario.id,
            Name: data.value,
            ICID: ics.length > 0 ? ics[0].id : null,
            StartParameters: {},
            FileIDs: [],
          }
        };

        try {
          await addComponentConfig(config).unwrap();
        } catch (err) {
          notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(err.data.message));
        }

        refetchConfigs();
      }

      setIsNewModalOpened(false);
    }

    const importConfig = async (data) => {
      if(data){
        const config = {
          config: {
            ScenarioID: scenario.id,
            Name: data.name,
            ICID: data.config.icID,
            StartParameters: data.config.startParameters,
            FileIDs: data.config.fileIDs,
          }
        }

        try {
          await addComponentConfig(config).unwrap();
        } catch (err) {
          notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(err.data.message));
        }
      }

      refetchConfigs();
      setIsImportModalOpened(false);
    }

    const exportConfig = (index) => {
      
  
      // show save dialog
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      FileSaver.saveAs(blob, 'config-' + config.name + '.json');
    }

    const deleteConfig = async (isConfirmed) => {
      if(isConfirmed){
        try {
          await deleteComponentConfig(configToDelete.id).unwrap();
          setConfigToDelete({name: ''});
        } catch (err) {
          notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(err.data.message));
        }
      }

      refetchConfigs();
      setIsDeleteModalOpened(false);
    }

    const getICName = (icID) => {
      for (let ic of ics) {
        if (ic.id === icID) {
          return ic.name || ic.uuid;
        }
      }
    }

    const copyConfig = async (configToCopy) => {
      let copiedConfig = JSON.parse(JSON.stringify(configToCopy));

      try {
        const signalsInRes = await triggerGetSignals({configID: configToCopy.id, direction: "in"}, ).unwrap();
        const signalsOutRes = await triggerGetSignals({configID: configToCopy.id, direction: "out"}, ).unwrap();

        let parsedInSignals = [];
        let parsedOutSignals = [];
        
        if(signalsInRes.signals.length > 0){
          for(let signal of signalsInRes.signals){
            delete signal.configID;
            delete signal.id;
            parsedInSignals.push(signal);
          }
        }

        if(signalsOutRes.signals.length > 0){
          for(let signal of signalsOutRes.signals){
            delete signal.configID;
            delete signal.id;
            parsedOutSignals.push(signal);
          }
        }

        copiedConfig["inputMapping"] = parsedInSignals;
        copiedConfig["outputMapping"] = parsedOutSignals;

        delete copiedConfig.id;
        delete copiedConfig.scenarioID;

        return copiedConfig;
      } catch (err) {
        console.log(err);
        return null;
      }
    }

    const handleConfigExport = async (config) => {
      try {
        const configToExport = await copyConfig(config);
        const fileName = configToExport.name.replace(/\s+/g, '-').toLowerCase();
        const blob = new Blob([JSON.stringify(configToExport, null, 2)], { type: 'application/json' });
        FileSaver.saveAs(blob, 'config-' + fileName + '.json');
      } catch (err) {
        console.log(err);
      }
    }

    const handleDuplicateConfig = async (originalConfig) => {
      try {
        //in order to properly duplicate existing config, we need first to create an new 
        //one with same initital parameters and then add all the signal subobjects to it
        const copiedConfig = await copyConfig(originalConfig);
        copiedConfig["scenarioID"] = scenario.id;
        copiedConfig.name = `${originalConfig.name}_copy`;

        const signalsIn = copiedConfig.inputMapping;
        const signalsOut = copiedConfig.outputMapping;

        delete copiedConfig["inputMapping"];
        delete copiedConfig["outputMapping"];
        
        const res = await addComponentConfig({ config: copiedConfig }).unwrap();

        if(signalsIn.length > 0){
          for(let signal of signalsIn){
            signal.configID = res.id;
            await addSignalToConfig(signal).unwrap();
          }
        }

        if(signalsOut.length > 0){
          for(let signal of signalsOut){
            signal.configID = res.id;
            await addSignalToConfig(signal).unwrap();
          }
        }
      } catch (err) {
        notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
      }

      refetchConfigs();
    }

    const getNumberOfSignalsModifier = (configID, direction) => {
      if(configID in signals){
        return signals[configID].filter(s => s.direction == direction).length;
      } else {
        return 0;
      }
    }

    const handleSignalMapping = () => {
      
    }

    const toggleCheckAllConfigs = () => {
      if(checkedConfigsIDs.length === configs.length){
          setCheckedConfigsIDs([]);
          setAreAllConfigsChecked(false);
      } else {
          configs.forEach(config => {
              if(!checkedConfigsIDs.includes(config.id)){
                setCheckedConfigsIDs(prevState => ([...prevState, config.id]));
              }
          })
          setAreAllConfigsChecked(true);
      }
  }

  const isConfigChecked = (config) => {
      return checkedConfigsIDs.includes(config.id);
  }

  const handleConfigCheck = (config, event) => {
      if(!checkedConfigsIDs.includes(config.id)){
          setCheckedConfigsIDs(prevState => ([...prevState, config.id]));
      } else {
          const index = checkedConfigsIDs.indexOf(config.id);
          setCheckedConfigsIDs(prevState => prevState.filter((_, i) => i !== index));
      }
  }

  const usesExternalIC = (index) => {
    for (let ic of ics) {
      if (ic.id === configs[index].icID) {
        if (ic.managedexternally === true) {
          return true
        }
      }
    }
    return false
  }

  return (
      <div>
        {/*Component Configurations table*/}
        <h2 style={tableHeadingStyle}>Component Configurations
          <span className='icon-button'>
            <IconButton
              childKey={0}
              tooltip='Add Component Configuration'
              onClick={() => setIsNewModalOpened(true)}
              icon='plus'
              disabled={scenario.isLocked}
              hidetooltip={scenario.isLocked}
              buttonStyle={buttonStyle}
              iconStyle={iconStyle}
            />
            <IconButton
              childKey={1}
              tooltip='Import Component Configuration'
              onClick={() => setIsImportModalOpened(true)}
              icon='upload'
              disabled={scenario.isLocked}
              hidetooltip={scenario.isLocked}
              buttonStyle={buttonStyle}
              iconStyle={iconStyle}
            />
          </span>
        </h2>
        <Table
          data={configs}
          allRowsChecked={false}
        >
          <CheckboxColumn
            enableCheckAll
            onCheckAll={() => toggleCheckAllConfigs()}
            allChecked={areAllConfigsChecked}
            checked={(config) => isConfigChecked(config)}
            checkboxDisabled={(index) => !usesExternalIC(index)}
            onChecked={(config, event) => handleConfigCheck(config, event)}
            width={20}
          />
          {currentUser.role === "Admin" ?
            <DataColumn
              title='ID'
              dataKey='id'
              width={70}
            />
            : <></>
          }
          <DataColumn
            title='Name'
            dataKey='name'
            width={250}
          />
          <ButtonColumn
            title='# Output Signals'
            dataKey='id'
            editButton
            onEdit={index => {
              setMappingModalDirection('out');
              setSignalMappingConfigID(configs[index].id);
              setIsEditSignalMappingModalOpened(true);
            }}
            width={150}
            locked={scenario.isLocked}
            modifier={(configId) => <span>{getNumberOfSignalsModifier(configId, 'out')}</span>}
          />
          <ButtonColumn
            title='# Input Signals'
            dataKey='id'
            editButton
            onEdit={index => {
              setMappingModalDirection('in');
              setSignalMappingConfigID(configs[index].id);
              setIsEditSignalMappingModalOpened(true);
            }}
            width={150}
            locked={scenario.isLocked}
            modifier={(configId) => <span>{getNumberOfSignalsModifier(configId, 'in')}</span>}
          />
          <ButtonColumn
            title='Autoconfigure Signals'
            signalButton
            onAutoConf={(index) => {}}
            width={170}
            locked={scenario.isLocked}
          />
          <DataColumn
            title='Infrastructure Component'
            dataKey='icID'
            modifier={(icID) => getICName(icID)}
            width={200}
          />
          <ButtonColumn
            title=''
            width={200}
            align='right'
            editButton
            deleteButton
            exportButton
            duplicateButton
            onEdit={index => {}}
            onDelete={(index) => {
              setConfigToDelete(configs[index])
              setIsDeleteModalOpened(true);
            }}
            onExport={index => {
              handleConfigExport(configs[index]);
            }}
            onDuplicate={index => {
              handleDuplicateConfig(configs[index]);
            }}
            locked={scenario.isLocked}
          />
        </Table>

        <ConfigActionBoard
          selectedConfigs={configs.filter(c => isConfigChecked(c))}
          scenarioID={scenario.id}
        />

      <NewDialog
        show={isNewModalOpened}
        title="New Component Configuration"
        inputLabel="Name"
        placeholder="Enter name"
        onClose={data => newConfig(data)}
      />
      <ImportConfigDialog
        show={isImportModalOpened}
        onClose={data => importConfig(data)}
        ics={ics}
      />
      <DeleteDialog
        title="component configuration"
        name={configToDelete.name}
        show={isDeleteModalOpened}
        onClose={(c) => deleteConfig(c)}
      />
      <EditSignalMappingDialog
        isShown={isEditSignalMappingModalOpened}
        direction={mappingModalDirection}
        onClose={() => setIsEditSignalMappingModalOpened(false)}
        configID={signalMappingConfigID}
      />

      </div>
    )
}

export default ConfigsTable;
