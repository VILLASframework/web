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

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Badge } from 'react-bootstrap';
import { loadAllICs, loadICbyId, addIC, sendActionToIC, closeDeleteModal, closeEditModal, editIC, deleteIC } from "../../store/icSlice";
import { set } from "lodash";
import IconButton from "../../common/buttons/icon-button";
import ICCategoryTable from "./ic-category-table";
import { sessionToken, currentUser } from "../../localStorage";
import ICActionBoard from "./ic-action-board";
import { buttonStyle, iconStyle } from "./styles";
import NewICDialog from "../../ic/new-ic";
import ImportICDialog from "../../ic/import-ic";
import EditICDialog from "../../ic/edit-ic";
import DeleteDialog from "../../common/dialogs/delete-dialog";
import NotificationsDataManager from "../../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../../common/data-managers/notifications-factory";

const Infrastructure = (props) => {
    const dispatch = useDispatch();

    const ics = useSelector(state => state.infrastructure.ICsArray);
    const externalICs = ics.filter(ic => ic.managedexternally === true);

    //track status of the modals
    const [isNewModalOpened, setIsNewModalOpened] = useState(false);
    const [isImportModalOpened, setIsImportModalOpened] = useState(false);
    const [isICModalOpened, setIsICModalOpened] = useState(false);
    const [checkedICs, setCheckedICs] = useState([]);

    useEffect(() => {
        //load array of ics and start a timer for periodic refresh
        dispatch(loadAllICs({token: sessionToken}));
        let timer = window.setInterval(() => refresh(), 10000);

        return () => {
            window.clearInterval(timer);
        }
    }, []);

    const refresh = () => {
        //if none of the modals are currently opened, we reload ics array
        if(!(isEditModalOpened || isDeleteModalOpened || isICModalOpened)){
            dispatch(loadAllICs({token: sessionToken}));
        }
    }

    //modal actions and selectors

    const isEditModalOpened = useSelector(state => state.infrastructure.isEditModalOpened);
    const isDeleteModalOpened = useSelector(state => state.infrastructure.isDeleteModalOpened);
    const editModalIC = useSelector(state => state.infrastructure.editModalIC);
    const deleteModalIC = useSelector(state => state.infrastructure.deleteModalIC);

    const onNewModalClose = (data) => {
        setIsNewModalOpened(false);

        console.log("Adding ic. External: ", !data.managedexternally)

        if(data){
            if(!data.managedexternally){
                dispatch(addIC({token: sessionToken, ic: data})).then(res => dispatch(loadAllICs({token: sessionToken})));
            }else {
                // externally managed IC: dispatch create action to selected manager
                let newAction = {};
        
                newAction["action"] = "create";
                newAction["parameters"] = data.parameters;
                newAction["when"] = new Date();
        
                // find the manager IC
                const managerIC = ics.find(ic => ic.uuid === data.manager)
                if (managerIC === null || managerIC === undefined) {
                  NotificationsDataManager.addNotification(NotificationsFactory.ADD_ERROR("Could not find manager IC with UUID " + data.manager));
                  return;
                }

                dispatch(sendActionToIC({token: sessionToken, id: managerIC.id, actions: newAction})).then(res => dispatch(loadAllICs({token: sessionToken})));
            }
        }
    }

    const onImportModalClose = (data) => {
        setIsImportModalOpened(false);

        dispatch(addIC({token: sessionToken, ic: data})).then(res => dispatch(loadAllICs({token: sessionToken})));
    }

    const onEditModalClose = (data) => {
        if(data){
            //some changes where done
            dispatch(editIC({token: sessionToken, ic: data})).then(res => dispatch(loadAllICs({token: sessionToken})));
        }
        dispatch(closeEditModal(data));
    }

    const onCloseDeleteModal = (isDeleteConfirmed) => {
        if(isDeleteConfirmed){
            dispatch(deleteIC({token: sessionToken, id:deleteModalIC.id})).then(res => dispatch(loadAllICs({token: sessionToken})));
        }
        dispatch(closeDeleteModal());
    }

    //getting list of managers for the new IC modal
    const managers = ics.filter(ic => ic.category === "manager");

    return (
        <div>
            <div className='section'>
                <h1>Infrastructure
                    {currentUser.role === "Admin" ?
                        <span className='icon-button'>
                            <IconButton
                                childKey={1}
                                tooltip='Add Infrastructure Component'
                                onClick={() => setIsNewModalOpened(true)}
                                icon='plus'
                                buttonStyle={buttonStyle}
                                iconStyle={iconStyle}
                            />
                            <IconButton
                                childKey={1}
                                tooltip='Import Infrastructure Component'
                                onClick={() => setIsImportModalOpened(true)}
                                icon='upload'
                                buttonStyle={buttonStyle}
                                iconStyle={iconStyle}
                            />
                        </span>
                        : 
                        <span />
                    }
                </h1>

                <ICCategoryTable
                    title={"IC Managers"}
                    category={"manager"}
                />

                <ICCategoryTable
                    title={"Simulators"}
                    category={"simulator"}
                />

                <ICCategoryTable 
                    title={"Gateways"}
                    category={"gateway"} 
                />

                <ICCategoryTable 
                    title={"Services"}
                    category={"service"}
                />

                <ICCategoryTable 
                    title={"Equipment"}
                    category={"equipment"} 
                />

                {/* {currentUser.role === "Admin" && externalICs.length > 0 ? <ICActionBoard /> : null} */}
                <ICActionBoard />

            </div>

            <NewICDialog show={isNewModalOpened} onClose={data => onNewModalClose(data)} managers={managers} />
            <ImportICDialog show={isImportModalOpened} onClose={data => onImportModalClose(data)} />
            <EditICDialog 
                show={isEditModalOpened} 
                onClose={data => onEditModalClose(data)} 
                ic={editModalIC ? editModalIC : {}} 
            />
            <DeleteDialog 
                title="infrastructure-component" 
                name={deleteModalIC ? deleteModalIC.name : 'Unknown'} 
                show={isDeleteModalOpened} 
                onClose={(e) => onCloseDeleteModal(e)} 
            />
        </div>
      );
}

export default Infrastructure;
