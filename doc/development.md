# Development {#web-development}

- @subpage web-datastructure

In order to get started with VILLASweb, you might also want to check our our [demo project](https://git.rwth-aachen.de/acs/public/villas/Demo) which is simple to setup using Docker Compose.

## Frontend

### Description

The website itself based on the [React JavaScript framework](https://reactjs.org/) and the [Flux library](https://facebook.github.io/flux/).

### Required

 - [NodeJS with npm](https://nodejs.org/en/)

### Setup

 - `git clone git@git.rwth-aachen.de/acs/public/villas/web.git` to copy the project on your computer
 - `cd VILLASweb`
 - `npm install`

### Running

 - `npm start`

This runs the development server for the website on your local computer at port 3000.
The backend must be running to make the website work. 
Type `http://localhost:3000/` in the address field of your browser to open the website.

## Backend

### Description

The backend of VILLASweb uses the programming language Go and a PostgreSQL database.

### Required

 - [Go](https://golang.org/) (min version 1.11)
 - [PostgreSQL database](https://www.postgresql.org/) (min version 11)
 - [swag](https://github.com/swaggo/swag)

### Setup and Running

 - `git clone git@git.rwth-aachen.de/acs/public/villas/web-backend-go.git` to copy the project on your computer
 - `cd VILLASweb-backend-go`
 - `go mod tidy`
 - `go run start.go [params]`
 
To obtain a list of available parameters use `go run start.go --help`.
To run the tests use `go test $(go list ./... ) -p 1` in the top-level folder of the repo.

Running the backend will only work if the PostgreSQL database is setup properly. Otherwise, you will get error messages.

### Auto-generate the API documentation

The documentation of the VILLASweb API in the OpenAPI format can be auto-generated from the source code documentation using the tool swag.
To do this run the following in the top-level folder of the repo:

- `go mod tidy`
- `go install github.com/swaggo/swag/cmd/swag`
- `swag init -p pascalcase -g "start.go" -o "./doc/api/"`

The `.yaml` and `.json` files in OpenAPI swagger format are created in the output folder `doc/api`.

### PostgreSQL database setup

Please check the [Readme file in the backend repository](https://git.rwth-aachen.de/acs/public/villas/web-backend-go) for some useful hints on the local setup of the PostreSQL database.
 

