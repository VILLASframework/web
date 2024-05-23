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
import { loadAllICs, loadICbyId } from "../../store/icSlice";
import { set } from "lodash";
import IconButton from "../../common/buttons/icon-button";
import ICCategoryTable from "./ic-category-table";
import { sessionToken, currentUser } from "../../localStorage";
import ICActionBoard from "./ic-action-board";

const Infrastructure = (props) => {
    const dispatch = useDispatch();

    const ICsArray = useSelector(state => state.infrastructure.ICsArray);
    const externalICs = ICsArray.filter(ic => ic.managedexternally === true)
    const checkedICsIds = useSelector(state => state.infrastructure.checkedICsIds);

    //track status of the modals
    const [isEditModalOpened, setIsEditModalOpened]  = useState(false);
    const [isNewModalOpened, setIsNewModalOpened] = useState(false);
    const [isImportModalOpened, setIsImportModalOpened] = useState(false);
    const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
    const [isICModalOpened, setIsICModalOpened] = useState(false);
    const [checkedICs, setCheckedICs] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        //load array of ics and start a timer for periodic refresh
        dispatch(loadAllICs({token: sessionToken}));
        let timer = window.setInterval(() => refresh(), 10000);

        return () => {
            window.clearInterval(timer);
        }
    }, []);

    useEffect(() => {
        console.log("checked: ", checkedICsIds)
    }, [checkedICsIds])

    const refresh = () => {
        //if none of the modals are currently opened, we reload ics array
        if(!(isEditModalOpened || isDeleteModalOpened || isICModalOpened)){
            dispatch(loadAllICs({token: sessionToken}));
        }
    }

    const buttonStyle = {
        marginLeft: '10px',
    }
  
    const iconStyle = {
      height: '30px',
      width: '30px'
    }

    return (
        <div>
            <div className='section'>
                <h1>Infrastructure
                    {//TODO
                    /* {currentUser.role === "Admin" ?
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
                    } */}
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

    {//TODO
    /* <NewICDialog show={this.state.newModal} onClose={data => this.closeNewModal(data)} managers={this.state.managers} />
        <EditICDialog show={this.state.editModal} onClose={data => this.closeEditModal(data)} ic={this.state.modalIC} />
        <ImportICDialog show={this.state.importModal} onClose={data => this.closeImportModal(data)} />
        <DeleteDialog title="infrastructure-component" name={this.state.modalIC.name || 'Unknown'} show={this.state.deleteModal} onClose={(e) => this.closeDeleteModal(e)} /> */}
    
        </div>
      );
}

export default Infrastructure;