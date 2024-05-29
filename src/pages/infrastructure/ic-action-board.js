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
import ICButtonGroup from "./ic-button-group";
import classNames from 'classnames';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sessionToken } from '../../localStorage';
import { clearCheckedICs, deleteIC, loadAllICs, sendActionToIC } from '../../store/icSlice';

const ICActionBoard = (props) => {
  const dispatch = useDispatch();
  const checkedICsIds = useSelector(state => state.infrastructure.checkedICsIds);

  let pickedTime = new Date();
  pickedTime.setMinutes(5 * Math.round(pickedTime.getMinutes() / 5 + 1));

  const [time, setTime] = useState(pickedTime);

  const onReset = () => {
    let newAction = {};
    newAction['action'] = 'reset';
    newAction['when'] = time;

    checkedICsIds.forEach((id) => {
      dispatch(sendActionToIC({token: sessionToken, id: id, actions: newAction}));
    });
  }

  const onRecreate = () => {
    let newAction = {};
    newAction['action'] = 'create';
    newAction['when'] = time;

    checkedICsIds.forEach((id) => {
      dispatch(sendActionToIC({token: sessionToken, id: id, actions: newAction}));
    });
  }

  const onDelete = () => {
    checkedICsIds.forEach((id) => {
      console.log(id)
      dispatch(deleteIC({token: sessionToken, id: id}));
    });

    dispatch(clearCheckedICs());
    dispatch(loadAllICs({token: sessionToken}));
  }

  const onShutdown = () => {
    let newAction = {};
    newAction['action'] = 'shutdown';
    newAction['when'] = time;

    checkedICsIds.forEach((id) => {
      dispatch(sendActionToIC({token: sessionToken, id: id, actions: newAction}));
    });
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
          <ICButtonGroup
            disabled={checkedICsIds.length == 0}
            onReset={() => onReset()}
            onShutdown={() => onShutdown()}
            onDelete={() => onDelete()}
            onRecreate={() => onRecreate()}
            paused={false}
          />
        </Col>
        {false ?
          <Col style={{padding: '20px'}} md='auto' lg='auto'>
            <Form.Group controlId="resultCheck">
              <Form.Check 
                type="checkbox" 
                label="Create Result"
                checked={false}
                onChange={null}
              />
            </Form.Group>
          </Col> : <></>
        }
      </Row>
      <small className="text-muted">Select time for synced command execution</small>
    </div>);
}

export default ICActionBoard;
