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

import { useEffect, useRef } from "react";
import { sessionToken, currentUser } from "../../localStorage";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { loadAllICs, loadICbyId } from "../../store/icSlice";
import { loadConfig } from "../../store/configSlice";

import DefaultManagerPage from "./ic-pages/default-manager-page";
import GatewayVillasNode from "./ic-pages/gateway-villas-node";
import ManagerVillasNode from "./ic-pages/manager-villas-node";
import ManagerVillasRelay from "./ic-pages/manager-villas-relay";
import KubernetesICPage from "./ic-pages/kubernetes-ic-page";

const InfrastructureComponent = (props) => {
    const params = useParams();
    const id = params.ic;
    const dispatch = useDispatch();

    const ic = useSelector(state => state.infrastructure.currentIC);
    const isICLoading = useSelector(state => state.infrastructure.isCurrentICLoading);

    useEffect(() => {

        console.log(ic)

        dispatch(loadAllICs({token: sessionToken}));
        dispatch(loadICbyId({token: sessionToken, id: id}));
        dispatch(loadConfig({token: sessionToken}));
    }, []);
    
    if(ic == null || ic === undefined){
        return <div>Loading...</div>
    } else if(ic.category ==="gateway" && ic.type === "villas-node"){
        return <GatewayVillasNode ic={ic}/>
    } else if(ic.category ==="manager" && ic.type === "villas-node"){
        return <ManagerVillasNode ic={ic}/>
    } else if(ic.category ==="manager" && ic.type === "villas-relay"){
        return <ManagerVillasRelay ic={ic}/>
    } else if(ic.category ==="manager") {
        return <DefaultManagerPage ic={ic} />
    } else if(ic.category === "simulator" && ic.type === "kubernetes"){
        return <KubernetesICPage ic={ic}/>
    } else {
        return <div>Loading...</div>
    }
}

export default InfrastructureComponent;