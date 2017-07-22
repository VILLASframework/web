FROM node:8.2

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

VOLUME /usr/src/app/build

# Bundle app source
COPY . /usr/src/app
RUN npm run build

EXPOSE 80

CMD [ "npm", "start" ]
