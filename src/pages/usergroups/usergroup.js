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

import { useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Row, Col, Spinner } from "react-bootstrap";
import UsergroupScenariosTable from "./tables/usergroup-scenarios-table";
import UsergroupUsersTable from "./tables/usergroup-users-table";
import IconButton from "../../common/buttons/icon-button";
import { buttonStyle, iconStyle } from "./styles";
import { useGetUsergroupByIdQuery, useUpdateUsergroupMutation } from "../../store/apiSlice";
import RenameUsergroupDialog from "./dialogs/renameGroupDialog";
import notificationsDataManager from "../../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../../common/data-managers/notifications-factory";

const Usergroup = () => {
    const params = useParams();
    const usergroupID = params.usergroup;
    const {data: {usergroup} = {}, isLoading, refetch} = useGetUsergroupByIdQuery(usergroupID);
    const [isRenameModalOpened, setIsRenameModalOpened] = useState(false);
    const [updateUsergroup] = useUpdateUsergroupMutation();

    const handleRename = async (newName) => {
        if(newName){
            try {
                //update only the name
                await updateUsergroup({usergroupID: usergroup.id, usergroup: {name: newName, ScenarioMappings: usergroup.ScenarioMappings}}).unwrap();
                refetch();
            } catch (err) {
                notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
            }
        }

        setIsRenameModalOpened(false);
    }

    if(isLoading) return <Spinner />;

    return (
        <div className='section'>
            <h1>
                {usergroup.name}
                <span className="icon-button">
                    <IconButton
                        childKey={1}
                        tooltip='Change name'
                        onClick={() => setIsRenameModalOpened(true)}
                        icon='edit'
                        buttonStyle={buttonStyle}
                        iconStyle={iconStyle}
                    />
                </span>
            </h1>
            
            <Row className="mt-4">
                <Col>
                    <UsergroupUsersTable usergroupID={usergroupID} />
                </Col>
                <Col>
                    <UsergroupScenariosTable usergroupID={usergroupID} />
                </Col>
            </Row>

            <RenameUsergroupDialog 
                isModalOpened={isRenameModalOpened} 
                onClose={handleRename}
                oldName={usergroup.name}
            /> 
        </div>
    );
}

export default Usergroup;
