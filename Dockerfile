FROM node:8.2

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apt install -y git

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /usr/src/app
RUN npm install

# Install app dependencies
COPY . /usr/src/app
RUN npm run build

# Run the app in a local webserver
RUN npm install -g serve
EXPOSE 5000

CMD [ "serve", "-s", "build" ]
