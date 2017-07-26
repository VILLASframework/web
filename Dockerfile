FROM node:8.2

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app
RUN npm install && npm run build

VOLUME /usr/src/app/build

CMD [ "true" ]
