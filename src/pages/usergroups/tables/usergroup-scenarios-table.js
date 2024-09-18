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

import { useGetUsergroupByIdQuery } from "../../../store/apiSlice";
import { Table, DataColumn, LinkColumn, ButtonColumn } from "../../../common/table";
import { iconStyle, buttonStyle } from "../styles";
import IconButton from "../../../common/buttons/icon-button";

const UsergroupScenariosTable = ({usergroupID}) => {
    const {data: {usergroup} = {}, isLoading} = useGetUsergroupByIdQuery(usergroupID);

    const handleAddScenarioMapping = () => {

    }

    const getDuplicateLabel = (duplicate) => {
        return duplicate ? <div>yes</div> : <div>no</div>;
    }

    if(isLoading) return <div>Loading...</div>;

    return (<div className="section"> 
        <h2>
        Scenario Mappings
        <span className="icon-button">
            <IconButton
                childKey={0}
                tooltip="Add Scenario Mapping"
                onClick={() => handleAddScenarioMapping()}
                icon="plus"
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
            />
        </span>
        </h2>
        <Table data={usergroup.scenarioMappings}>
            <DataColumn title='ID' dataKey='id' width={70}/>
            <LinkColumn title="Scenario ID" dataKey="scenarioID" link="/scenarios/" linkKey="id" />
            <DataColumn title='Duplicate' dataKey='duplicate' modifier={(duplicate) => getDuplicateLabel(duplicate)}/>
            {/* <ButtonColumn
            width="200"
            align="right"
            /> */}
        </Table>
    </div>);
}

export default UsergroupScenariosTable;
