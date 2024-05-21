import { useState } from "react";
import { useDispatch } from "react-redux";

import ICParamsTable from "../ic-params-table";
import RawDataTable from '../../../common/rawDataTable';

import { restartIC, shutdownIC, loadICbyId } from "../../../store/icSlice";
import { sessionToken, currentUser } from "../../../localStorage";
import { buttonStyle, iconStyle } from "../styles";

import IconButton from "../../../common/buttons/icon-button";
import {Button, Col, Container, Row} from "react-bootstrap";
import ConfirmCommand from "../../../common/confirm-command";

const GatewayVillasNode = (props) => {
    const dispatch = useDispatch();

    const ic = props.ic;

    const [command, setCommand] = useState("");
    const [isCommandConfirmed, setIsCommandConfirmed] = useState(false);

    const sendControlCommand = () => {
        switch(command){
            case "restart":
                dispatch(restartIC({apiurl: ic.apiurl}))
            case "shutdown":
                dispatch(shutdownIC({apiurl: ic.apiurl}))
            default:
                console.log("Command not found");
        }
    }

    const confirmCommand = (canceled) => {
        if(!canceled){
            sendControlCommand();
        }

        setIsCommandConfirmed(false);
        setCommand("");
    }

    return (
    <div className='section'>
        <h1>{ic.name}
            <span className='icon-button'>
            <IconButton
                childKey={2}
                tooltip='Refresh'
                onClick={() => dispatch(loadICbyId({id: ic.id, token: sessionToken}))}
                icon='sync-alt'
                buttonStyle={buttonStyle}
                iconStyle={iconStyle}
            />
            </span>
        </h1>

        <Row>
            <Col>
            <h4>Properties</h4>
                <ICParamsTable ic={ic}/>
            </Col>
            <Col>
            {currentUser.role === "Admin" ?
                <div>
                <h4>Controls</h4>
                <div className='solid-button'>
                    <Button
                    variant='secondary'
                    style={{ margin: '5px' }}
                    size='lg'
                    onClick={() => {
                        setIsCommandConfirmed(true);
                        setIsCommandConfirmed('restart');
                    }}>
                    Restart
                    </Button>
                    <Button
                    variant='secondary'
                    style={{ margin: '5px' }}
                    size='lg'
                    onClick={() => {
                        setIsCommandConfirmed(true);
                        setIsCommandConfirmed('shutdown');
                    }}>
                    Shutdown
                    </Button>
                </div>
                </div>
                : <div />
            }
            <ConfirmCommand
                show={isCommandConfirmed}
                command={command}
                name={ic.name}
                onClose={c => confirmCommand(c)}
            />
            </Col>
        </Row>
        <hr/>
        <Row>
            <Col>
            <h4>Raw Status</h4>
                <RawDataTable rawData={ic.statusupdateraw}/>
            </Col>
            <Col>
            <h4>Raw Config</h4>
                <RawDataTable rawData={ic.statusupdateraw != null ? ic.statusupdateraw.config : null}/>
            </Col>
            <Col>
            <h4>Raw Statistics</h4>
                <RawDataTable rawData={ic.statusupdateraw != null ? ic.statusupdateraw.statistics: null}/>
            </Col>
        </Row>
    </div>
    )

}

export default GatewayVillasNode;