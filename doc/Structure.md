# VILLASweb data structure {#web-datastructure}

This document describes how data (scenarios, infrastructure components, users etc., not only live data) is structured in VILLASweb.

## Data model

![Datamodel](../src/img/datamodel.png)

VILLASweb features the following data classes:

 - Users
 - Infrastructure Components
 - Scenarios
    * Component Configurations and Signals
    * Dashboards and Widgets
    * Files 

### Users
- You need a username and a password to authenticate in VILLASweb
- There exist three categories of users: Guest, User, and Admin
- Guests have only read access and cannot modify anything
- Users are normal users, they have access to their scenarios, can see available infrastructure components, and modify their accounts (except for their role)
- Admin users have full access to everything, they are the only users that can create new users or change the role of existing users. Only admin users can add or modify infrastructure components. 

### Infrastructure Components
- Components of research infrastructure
- Category: for example simulator, gateway, amplifier, database, etc.
- Type: for example RTDS, OpalRT, VILLASnode, Cassandra
- Can only be added/ modified by admin users

### Scenarios
- A collection of component configurations, dashboards, and files for a specific experiment
- Users can have access to multiple scenarios
- Users can be added to and removed from scenarios

### Component Configurations and Signals
- Configure an infrastructure component for the use in a specific scenario
- Input signals: Signals that can be modified in VILLASweb
- Output signals: Signals that can be visualized on dashboards of VILLASweb
- Parameters: Additional configuration parameters of the infrastructure component
- Signals are the actual live data that is displayed or modified through VILLASweb dashboards 

### Dashboards and Widgets
- Visualize ongoing experiments in real-time
- Interact with ongoing experiments in real-time
- Use widgets to design the dashboard according to the needs

### Files
- Files can be added to scenarios optionally
- Can be images, model files, CIM xml files
- Can be used in widgets or component configurations 

## Setup strategy

The easiest way to start from scratch is the following (assuming the infrastructure components are already configured by an admin user, see below):

1. Create a new scenario.
2. Create and configure a new component configuration and link it with an available infrastructure component.
3. Configure the input and output signals of the component configuration according to the signals provided by the selected infrastructure component. The number of signals and their order (index starting at 1) must match.
4. Create a new dashboard and add widgets as desired. Configure the widgets by right-clicking to open the edit menu
5. If needed, files can be added to the scenario and used by component configurations or widgets (models, images, CIM-files, etc.)
6. For collaboration with other users, users can be added to a scenario

### Setup of infrastructure components

In the "Infrastructure Components" menu point admin users can create and edit components to be used in experiments. Normal uses can view the available components, but not edit them.
The components are global at any time and are shared among all users of VILLASweb. 

To create a new infrastructure component, you need to provide:
- Name
- Category (see above for examples)
- Type (see above for examples)
- Location
- Host (network address of the component)

At the moment, you need to know the input and output signals of the infrastructure component a priori to be able to create compatible component configurations by hand.
An auto-detection mechanism for signals is planned for future releases.

> Hint: At least one infrastructure component is required to receive data in VILLASweb.
