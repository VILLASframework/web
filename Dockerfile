FROM node:12.2 AS builder

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

FROM nginx

COPY --from=builder /usr/src/app/build /usr/share/nginx/html
