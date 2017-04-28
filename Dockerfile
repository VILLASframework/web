FROM node:latest

RUN mkdir /react
RUN mkdir /result

VOLUME /result

WORKDIR /react

CMD npm install && npm run build && cp -R /react/build/* /result/
