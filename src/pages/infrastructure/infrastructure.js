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
import { useDispatch, useSelector } from "react-redux";
import { addIC, sendActionToIC, closeDeleteModal, closeEditModal, editIC, deleteIC } from "../../store/icSlice";
import IconButton from "../../common/buttons/icon-button";
import ICCategoryTable from "./ic-category-table";
import ICActionBoard from "./ic-action-board";
import { buttonStyle, iconStyle } from "./styles";
import NewICDialog from "./dialogs/new-ic-dialog";
import ImportICDialog from "./dialogs/import-ic-dialog";
import EditICDialog from "./dialogs/edit-ic-dialog";
import DeleteDialog from "../../common/dialogs/delete-dialog";
import NotificationsDataManager from "../../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../../common/data-managers/notifications-factory";
import {useGetICSQuery} from '../../store/apiSlice';

const Infrastructure = () => {
    const dispatch = useDispatch();

    const { user: currentUser, token: sessionToken } = useSelector((state) => state.auth);

    const {data: icsRes, isLoading, refetch: refetchICs} = useGetICSQuery();
    const ics = icsRes ? icsRes.ics : [];

    const externalICs = ics.filter(ic => ic.managedexternally === true);

    //track status of the modals
    const [isNewModalOpened, setIsNewModalOpened] = useState(false);
    const [isImportModalOpened, setIsImportModalOpened] = useState(false);
    const [isICModalOpened, setIsICModalOpened] = useState(false);
    const [checkedICs, setCheckedICs] = useState([]);
    
    useEffect(() => {
        //start a timer for periodic refresh
        let timer = window.setInterval(() => refetchICs(), 10000);

        return () => {
            window.clearInterval(timer);
        }
    }, []);

    //modal actions and selectors

    const isEditModalOpened = useSelector(state => state.infrastructure.isEditModalOpened);
    const isDeleteModalOpened = useSelector(state => state.infrastructure.isDeleteModalOpened);
    const editModalIC = useSelector(state => state.infrastructure.editModalIC);
    const deleteModalIC = useSelector(state => state.infrastructure.deleteModalIC);

    const onNewModalClose = (data) => {
        setIsNewModalOpened(false);

        if(data){
            if(!data.managedexternally){
                dispatch(addIC({token: sessionToken, ic: data}))
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
                switch (managerIC.type){
                    case "kubernetes":
                    case "kubernetes-simple":
                        newAction["parameters"]["type"] = "kubernetes"
                        newAction["parameters"]["category"] = "simulator"
                        delete newAction.parameters.location
                        delete newAction.parameters.description
                        if (newAction.parameters.uuid === undefined){
                            delete newAction.parameters.uuid
                        }
                        break;
                    case "generic":
                        // should check that the form contains following VALID MANDATORY fields:
                        // name, type , owner,realm,ws_url,api_url,category and location <= generic create action schema
                        break;
                    default:
                        NotificationsDataManager.addNotification(NotificationsFactory.ADD_ERROR("Creation not supported for manager type " + managerIC.type));
                        return;
                }
                dispatch(sendActionToIC({token: sessionToken, id: managerIC.id, actions: newAction}))
            }
        }
    }

    const onImportModalClose = (data) => {
        setIsImportModalOpened(false);

        dispatch(addIC({token: sessionToken, ic: data}))
    }

    const onEditModalClose = (data) => {
        if(data){
            //some changes where done
            dispatch(editIC({token: sessionToken, ic: data}))
        }
        dispatch(closeEditModal(data));
    }

    const onCloseDeleteModal = (isDeleteConfirmed) => {
        if(isDeleteConfirmed){
            dispatch(deleteIC({token: sessionToken, id:deleteModalIC.id}))
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
                        <span />}
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

                {currentUser.role === "Admin" ? <ICActionBoard externalICs={ics} /> : null}

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
