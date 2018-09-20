# <img src="doc/pictures/villas_web.png" width=40 /> VILLASweb

## Description

This is VILLASweb, the website displaying and processing simulation data in the web browser. The term __frontend__ refers to this project, the actual website.

The frontend connects to __two__ backends: _VILLASweb-backend_ and _VILLASnode_.

VILLASnode provides actual simulation data via websockets. VILLASweb-backend provides any other data like user acounts, simulation configuration etc.

For more information on the backends see their repositories.

## Frameworks

The frontend is build upon [ReactJS](https://facebook.github.io/react/) and [Flux](https://facebook.github.io/flux/).

React is responsible for rendering the UI and Flux for handling the data and communication with the backends. For more information also have a look at REACT.md

Additional libraries are used, for a complete list see package.json.

## Quick start

We recommend Docker to get started quickly: 

```bash
$ git clone --recursive git@git.rwth-aachen.de:VILLASframework/VILLASweb.git
$ cd VILLASweb
$ npm install
$ npm start
```

The default user and password are configured in the `config.js` file of the _backend_. By default they are: __admin__ / __admin__.

## Copyright

2017, Institute for Automation of Complex Power Systems, EONERC  

## License

This project is released under the terms of the [GPL version 3](COPYING.md).

We kindly ask all academic publications employing components of VILLASframework to cite one of the following papers:

- A. Monti et al., "[A Global Real-Time Superlab: Enabling High Penetration of Power Electronics in the Electric Grid](https://ieeexplore.ieee.org/document/8458285/)," in IEEE Power Electronics Magazine, vol. 5, no. 3, pp. 35-44, Sept. 2018.
- S. Vogel, M. Mirz, L. Razik and A. Monti, "[An open solution for next-generation real-time power system simulation](http://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8245739&isnumber=8244404)," 2017 IEEE Conference on Energy Internet and Energy System Integration (EI2), Beijing, 2017, pp. 1-6.

```
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```

For other licensing options please consult [Prof. Antonello Monti](mailto:amonti@eonerc.rwth-aachen.de).

## Contact

[![EONERC ACS Logo](doc/pictures/eonerc_logo.png)](http://www.acs.eonerc.rwth-aachen.de)

 - Markus Grigull <mgrigull@eonerc.rwth-aachen.de>

[Institute for Automation of Complex Power Systems (ACS)](http://www.acs.eonerc.rwth-aachen.de)  
[EON Energy Research Center (EONERC)](http://www.eonerc.rwth-aachen.de)  
[RWTH University Aachen, Germany](http://www.rwth-aachen.de)  
