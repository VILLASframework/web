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

import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Table, DataColumn, LinkColumn } from "../../common/table";
import { Row, Col } from "react-bootstrap";
import UsergroupScenariosTable from "./tables/usergroup-scenarios-table";
import UsergroupUsersTable from "./tables/usergroup-users-table";
import { useGetUserGroupByIdQuery } from "../../store/apiSlice";

const Usergroup = (props) => {
    const params = useParams();
    const usergroupID = params.usergroup;
    const {data: {usergroup} = {}, isLoading} = useGetUserGroupByIdQuery(usergroupID);

    if(isLoading) return <div className='loading'>Loading...</div>;

    return (
        <div className='section'>
            <h1>{usergroup.name}</h1>
            <Row>
                <Col>
                    <h4>Users</h4>
                    <UsergroupUsersTable usergroupID={usergroupID} />
                </Col>
                <Col>
                    <h4>Scenario Mappings</h4>
                    <UsergroupScenariosTable usergroupID={usergroupID} />
                </Col>
            </Row>
        </div>
    );
}

export default Usergroup;
