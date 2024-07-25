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
import { useSelector, useDispatch } from "react-redux";
import {Table, ButtonColumn, CheckboxColumn, DataColumn, LabelColumn, LinkColumn } from '../../common/table';
import { Badge } from 'react-bootstrap';
import FileSaver from 'file-saver';
import _ from 'lodash';
import moment from 'moment'
import IconToggleButton from "../../common/buttons/icon-toggle-button";
import { updateCheckedICs, openDeleteModal, openEditModal } from "../../store/icSlice";
import { stateLabelStyle } from "./styles";
import { currentUser } from "../../localStorage";

//a Table of IC components of specific category from props.category
//titled with props.title
const ICCategoryTable = (props) => {
    const dispatch = useDispatch();
    const ics = useSelector(state => state.infrastructure.ICsArray);
    const [isGenericDisplayed, setIsGenericDisplayed] = useState(false);

    const modifyUptimeColumn = (uptime, component) => {
      if (uptime >= 0) {
        let momentDurationFormatSetup = require("moment-duration-format");
        momentDurationFormatSetup(moment)
  
        let timeString = moment.duration(uptime, "seconds").humanize();
        return <span>{timeString}</span>
      }
      else {
        return <Badge bg="secondary">unknown</Badge>
      }
    }

    const stateUpdateModifier = (updatedAt, component) => {
      let dateFormat = 'ddd, DD MMM YYYY HH:mm:ss ZZ';
      let dateTime = moment(updatedAt, dateFormat);
      return dateTime.fromNow()
    }

    const statePrio = (state) => {
      switch (state) {
        case 'running':
        case 'starting':
          return 1;
        case 'paused':
        case 'pausing':
        case 'resuming':
          return 2;
        case 'idle':
          return 3;
        case 'shutdown':
          return 4;
        case 'error':
          return 10;
        default:
          return 99;
      }
    }
    //if category of the table is manager we need to filter the generic-typed ics
    //according to the state of IconToggleButton
    let tableData = [];

    if(props.category == "manager"){
      tableData = ics.filter(ic=> (ic.category == props.category) && (isGenericDisplayed ** (ic.type == "generic")))
    }else{
      tableData = ics.filter(ic=> ic.category == props.category)
    }

    tableData.sort((a, b) => {
      if (a.state !== b.state) {
        return statePrio(a.state) > statePrio(b.state);
      }
      else if (a.name !== b.name) {
        return a.name < b.name;
      }
      else {
        return a.stateUpdatedAt < b.stateUpdatedAt;
      }
    })

    const [checkedICs, setCheckedICs] = useState({});
    const [areAllICsChecked, setAreAllICsChecked] = useState(false);

    useEffect(() => {
      if(tableData.length > 0){
        for(let ic in tableData){
          if(!checkedICs.hasOwnProperty(tableData[ic].id) && !isLocalIC(tableData[ic])){
            setCheckedICs(prevState => ({...prevState, [tableData[ic].id]: false}));
          }
        }
      }
    }, [tableData])

    useEffect(() => {
      dispatch(updateCheckedICs(checkedICs));

      //every time some ic is checked we need to check wether or not all ics are checked afterwards
      if(Object.keys(checkedICs).length > 0){
        setAreAllICsChecked(Object.values(checkedICs).every((value)=> value))
      }
    }, [checkedICs])

    const exportIC = (index) => {
      // filter properties
      let toExport = {...tableData[index]};
      delete toExport.id;

      const fileName = toExport.name.replace(/\s+/g, '-').toLowerCase();
      
      // show save dialog
      const blob = new Blob([JSON.stringify(toExport, null, 2)], { type: 'application/json' });
      FileSaver.saveAs(blob, 'ic-' + fileName + '.json');
    }

    const isLocalIC = (ic) => {
      return !ic.managedexternally
    }

    const checkAllICs = () => {
      if(areAllICsChecked){
        for(const id in checkedICs){
          setCheckedICs(prevState => ({...prevState, [id]: false}));
        }
      } else {
        for(const id in checkedICs){
          setCheckedICs(prevState => ({...prevState, [id]: true}));
        }
      }
    }

    const toggleCheck = (id) => {
      setCheckedICs(prevState => {
        return {
          ...prevState, [id]: !prevState[id]
        }
      })
    }  
    return (<div>
      <h2>
          {props.title}
          { props.category == "manager" ?
          <span className='icon-button'>
          <IconToggleButton
            childKey={0}
            index={1}
            onChange={() => setIsGenericDisplayed(!isGenericDisplayed)}
            checked={isGenericDisplayed}
            checkedIcon='eye'
            uncheckedIcon='eye-slash'
            tooltipChecked='click to hide generic managers'
            tooltipUnchecked='click to show generic managers'
          />
        </span>:<></>
          }
        </h2>
        <Table data={tableData}>
          <CheckboxColumn
            enableCheckAll
            onCheckAll={() => checkAllICs()}
            allChecked={areAllICsChecked}
            checkboxDisabled={(index) => isLocalIC(tableData[index])}
            checked={(ic) => checkedICs[ic.id]}
            onChecked={(ic, event) => toggleCheck(ic.id)}
            width='30'
          />
          {currentUser.role === "Admin" ?
            <DataColumn
              title='ID'
              dataKey='id'
            />
            : <></>
          }
          <LinkColumn
            title='Name'
            dataKeys={['name']}
            link='/infrastructure/'
            linkKey='id'
          />
          <LabelColumn
            title='State'
            labelKey='state'
            labelStyle={(state, component) => stateLabelStyle(state, component)}
          />
          <DataColumn
            title='Type'
            dataKeys={['type']}
          />
          <DataColumn
            title='Uptime'
            dataKey='uptime'
            modifier={(uptime, component) => modifyUptimeColumn(uptime, component)}
          />
          <DataColumn
            title='Last Update'
            dataKey='stateUpdateAt'
            modifier={(uptime, component) => stateUpdateModifier(uptime, component)}
          />

          {currentUser.role === "Admin" ?
            <ButtonColumn
              width='150'
              align='right'
              editButton
              showEditButton ={(index) => isLocalIC(tableData[index])}
              exportButton
              deleteButton
              showDeleteButton = {null}
              onEdit={index => {dispatch(openEditModal(tableData[index]))}}
              onExport={index => exportIC(index)}
              onDelete={index => {dispatch(openDeleteModal(tableData[index]))}}
            />
            :
            <ButtonColumn
              width='50'
              exportButton
              onExport={(index) => exportIC(index)}
            />
          }
        </Table>
    </div>
        );
}

export default ICCategoryTable;