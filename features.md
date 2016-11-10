## Attention: The development is happening in develop-villas. The other branches (including this master branch) are legacy from the old demo.

# Implemented features
- User accounts with different roles (admin, operator, guest etc.)
- Projects per user. Each project can have multiple visualizations. A visualization is a user defined set of graphes, tables, buttons etc.
- Visualizations can be created with a wysiwyg-editor (what-you-see-is-what-you-get). Only labels, single-value and tables are implemented as widgets atm.
- Simulators can be added to the system by endpoint (only one simulator per endpoint atm, will change in further versions)
- Simulations can be created which may use one to many simulators for their simulations models. Each project is based on a simulation to get its data from.
- Live data can be received from VILLASnode(s) and displayed in visualizations

# Planned features
- Project/Visualization/Simulation sharing across users (with restrictions)
- Data storage and everything it depends on (This is gonna be a long time goal, since we want to focus on live-data for the beginning)
- More widgets like plots, gauge, sliders
- User registration and management for administrators
- Imporved security (there is already encryption on user passwords, but the transmission of passwords is not finished)
- Definition of VILLASnodes inside VILLASweb and also deployment of them
- VILLASnode connection graph
- Auto-detection of running simulators/simulations
- Public available (without login) read-only visualizations

# Requirements & Features

- Configuration of local VILLASnode
    - define which nodes are connected so their data can be plotted 
- User management
    - a user account can hold several projects
- Projects
    - Projects group data that belongs to one simulation
    - Data is also available after the simulation is finished
    - individual data stream, sets of data streams or the whole project data can be downloaded as CSV files or package of CSV files
- Plot one or more data streams against time in real time
    - Multiple data streams can be plotted either in a single or multiple diagrams
    - If multiple data streams are plotted in one diagram they share one y-axis; do we need mutiple y-axes?
- 