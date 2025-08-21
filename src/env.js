const JSDOMEnvironment = require('jest-environment-jsdom')
const {Headers,Request,Response} = require('node-fetch')
const fetch = require('node-fetch')
class FixJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);
    //use custom env to inject backend url
    this.global.fetch = (...args)=>{
      const newobj = new Request('http://back:4000'+args[0].url,args[0])
      return fetch(newobj)
    };
    this.global.Headers = Headers;
    this.global.Request = Request;
    this.global.Response = Response;
  }
}
module.exports = FixJSDOMEnvironment