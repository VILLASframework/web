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
import { useGetScenarioByIdQuery } from "../../store/apiSlice";
import IconButton from "../../common/buttons/icon-button";
import { currentUser, sessionToken } from "../../localStorage";
import IconToggleButton from "../../common/buttons/icon-toggle-button";
import ConfigsTable from "./tables/configs-table";
import DashboardsTable from "./tables/dashboards-table";
import ResultsTable from "./tables/results-table";
import { tableHeadingStyle } from "./styles";
import UsersTable from "./tables/users-table";
import {
  useUpdateScenarioMutation,
  useGetICSQuery,
} from "../../store/apiSlice";

const Scenario = (props) => {
    const params = useParams();
    const id = params.scenario;

    const { data: fetchedScenarios, isLoading: isScenarioLoading, refetch: refetchScenario } = useGetScenarioByIdQuery(id);
    const scenario = fetchedScenarios?.scenario;

    const { data: fetchedICs, isLoading: areICsLoading, error, refetch: refetchICs } = useGetICSQuery(id);
    const ics = fetchedICs?.ics;

    const [updateScenario, {isLoadingUpdate}] = useUpdateScenarioMutation();

    const buttonStyle = {
        marginLeft: '10px',
    }
  
    const iconStyle = {
        height: '30px',
        width: '30px'
    }

    const onScenarioLock = async (index) => {
      try{
        const data = {...scenario};
        data.isLocked = !data.isLocked;
        await updateScenario({id: scenario.id, ...{scenario: data}}).unwrap();
        refetchScenario();
      } catch(error){
        console.log('Error locking/unlocking scenario', error)
      }
    }

    if(isScenarioLoading){
      return <div>Loading...</div>
    } else {
      const tooltip = scenario.isLocked ? "View files of scenario" : "Add, edit or delete files of scenario";

      return (
        <div className='section'>
        <div className='section-buttons-group-right'>
          <IconButton
            childKey="0"
            tooltip={tooltip}
            onClick={() => console.log("click")}
            icon="file"
            buttonStyle={buttonStyle}
            iconStyle={iconStyle}
          />
        </div>
        <h1>
          {scenario.name}
          <span className='icon-button'>
                <IconToggleButton
                  childKey={0}
                  index={scenario.id}
                  onChange={() => onScenarioLock()}
                  checked={scenario.isLocked}
                  checkedIcon='lock'
                  uncheckedIcon='lock-open'
                  tooltipChecked='Scenario is locked, cannot be edited'
                  tooltipUnchecked='Scenario is unlocked, can be edited'
                  disabled={currentUser.role !== "Admin"}
                  buttonStyle={buttonStyle}
                  iconStyle={iconStyle}
                />
              </span>
          </h1>
  
        {/* <EditFilesDialog
          sessionToken={sessionToken}
          show={false}
          onClose={null}
          signals={null}
          files={[]}
          scenarioID={scenario.id}
          locked={scenario.isLocked}
        /> */}
  
        { areICsLoading?
          <div>isLoading...</div>
          :
            <ConfigsTable
              ics={ics}
              scenario={scenario}
            />
        }
  
        <DashboardsTable
          scenario={scenario}
        />
  
        <ResultsTable
          scenario={scenario}
        />
  
        <UsersTable
          scenario={scenario}
        />
  
      </div>
      );
    }
}

export default Scenario;
