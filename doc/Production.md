# Production Setup {#web-production}

For development setup instructions see @ref web-development.
The production setup is based on docker. 
Clone the [frontend](https://git.rwth-aachen.de/acs/public/villas/web) and [backend](https://git.rwth-aachen.de/acs/public/villas/web-backend-go) repositories on your computer and build the Docker images for both:

#### Frontend
 - `cd VILLASweb`
 - `docker build -t villasweb-frontend .`
 
#### Backend
 - `cd ..\VILLASweb-backend-go`
 - `docker build -t villasweb-backend .`

#### TODO Docker compose and/or Kubernetes
Run the production docker-compose file:
 - `docker-compose -f docker-compose-production.yml up -d`

