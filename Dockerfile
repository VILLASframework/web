FROM node:8.2

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /usr/src/app
RUN npm install

# Install app dependencies
COPY . /usr/src/app
RUN npm run build

VOLUME /usr/src/app/build

CMD [ "true" ]
