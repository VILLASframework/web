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

import { useGetUsersByUsergroupIdQuery } from "../../../store/apiSlice";
import { Table, DataColumn, LinkColumn, ButtonColumn } from "../../../common/table";
import { iconStyle, buttonStyle } from "../styles";
import IconButton from "../../../common/buttons/icon-button";

const UsergroupUsersTable = ({usergroupID}) => {
    const {data: {users}=[], isLoading} = useGetUsersByUsergroupIdQuery(usergroupID);

    const handleAddUser = () => {

    }

    if(isLoading) return <div>Loading...</div>;

    return (<div className="section"> 
        <h2>
        Users
        <span className="icon-button">
            <IconButton
                childKey={0}
                tooltip="Add Users"
                onClick={() => handleAddUser()}
                icon="plus"
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
            />
        </span>
        </h2>
        <Table data={users}>
            <DataColumn
                title='ID'
                dataKey='id'
                width={70}
            />
            <DataColumn
                title="Name"
                dataKey="name"
                width={70}
            />
            {/* <ButtonColumn
            width="200"
            align="right"
            /> */}
        </Table>
    </div>);
}

export default UsergroupUsersTable;