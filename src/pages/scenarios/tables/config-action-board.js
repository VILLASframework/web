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

import { Form, Row, Col } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import ActionBoardButtonGroup from '../../../common/buttons/action-board-button-group';
import classNames from 'classnames';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sessionToken } from '../../../localStorage';
import { useSendActionMutation, useAddResultMutation, useLazyGetSignalsQuery, useGetResultsQuery } from '../../../store/apiSlice';
import NotificationsFactory from "../../../common/data-managers/notifications-factory";
import notificationsDataManager from "../../../common/data-managers/notifications-data-manager";

const ConfigActionBoard = ({selectedConfigs, scenarioID}) => {
  let pickedTime = new Date();
  pickedTime.setMinutes(5 * Math.round(pickedTime.getMinutes() / 5 + 1));

  const [triggerGetSignals] = useLazyGetSignalsQuery();

  const [sendAction] = useSendActionMutation();
  const [addResult] = useAddResultMutation();
  //we only need to update results table in case new result being added
  const { refetch: refetchResults } = useGetResultsQuery(scenarioID);

  const [time, setTime] = useState(pickedTime);
  const [isResultRequested, setIsResultRequested] = useState(false);

  const handleConfigStart = async () => {
    for(const config of selectedConfigs){
      try {
        if(isResultRequested){

          const signalsInRes = await triggerGetSignals({configID: config.id, direction: "in"}, ).unwrap();
          const signalsOutRes = await triggerGetSignals({configID: config.id, direction: "out"}, ).unwrap();

          let parsedInSignals = [];
          let parsedOutSignals = [];
          
          if(signalsInRes.signals.length > 0){
            for(let signal of signalsInRes.signals){
              parsedInSignals.push(signal);
            }
          }

          if(signalsOutRes.signals.length > 0){
            for(let signal of signalsOutRes.signals){
              parsedOutSignals.push(signal);
            }
          }

          const newResult = {
            description: "Start at " + time,
            scenarioID: scenarioID,
            configSnapshots: {
              ...config,
              inputMapping: parsedInSignals,
              outputMapping: parsedOutSignals,
            }
          }

          await addResult({result: newResult})
          refetchResults();
        }
        await sendAction({ icid: config.icID, action: "start", when: Math.round(new Date(time).getTime() / 1000), parameters: {} }).unwrap();
      } catch (err) {
        if(err.data){
          notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(err.data.message));
        } else {
          console.log('Error', err);
        }
      }
    }
  }

  const handleConfigPause = async () => {
    for(const config of selectedConfigs){
      try {
        await sendAction({ icid: config.icID, action: "pause", when: Math.round(new Date(time).getTime() / 1000), parameters: {} }).unwrap();
      } catch (error) {
        notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(err.data.message));
      }
    }
  }

  const handleConfigStop = async () => {
    for(const config of selectedConfigs){
      try {
        await sendAction({ icid: config.icID, action: "stop", when: Math.round(new Date(time).getTime() / 1000), parameters: {} }).unwrap();
      } catch (error) {
        notificationsDataManager.addNotification(NotificationsFactory.LOAD_ERROR(err.data.message));
      }
    }
  }

  return (<div className={classNames('section', 'box')}>
      <Row className='align-items-center'>
        <Col style={{padding: '10px'}} md='auto' lg='auto'>
          <Form>
            <DateTimePicker
              onChange={(newTime) => setTime(newTime)}
              value={time}
              disableClock={true}
            />
          </Form>
        </Col>
        <Col style={{padding: '20px'}} md='auto' lg='auto'>
          <ActionBoardButtonGroup
            disabled={selectedConfigs.length == 0}
            onStart={() => handleConfigStart()}
            onPauseResume={() => handleConfigPause()}
            onStop={() => handleConfigStop()}
            onReset={null}
            onShutdown={null}
            onDelete={null}
            onRecreate={null}
            paused={false}
          />
        </Col>
        <Col style={{padding: '20px'}} md='auto' lg='auto'>
          <Form.Group controlId="resultCheck">
            <Form.Check 
              type="checkbox" 
              label="Create Result"
              checked={isResultRequested}
              onChange={() => setIsResultRequested(prevState => !prevState)}
            />
          </Form.Group>
        </Col>
      </Row>
      <small className="text-muted">Select time for synced command execution</small>
    </div>);
}

export default ConfigActionBoard;
