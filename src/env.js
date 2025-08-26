const JSDOMEnvironment = require('jest-environment-jsdom')
const {Headers,Request,Response} = require('node-fetch')
const fetch = require('node-fetch')

//Custom jsdom environment to use the node-fetch utilities
//This is partly to have frontend tests possibly act as
//An integration test for the whole framework
class FixJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);
    //Proxy package.json config key is not used in testing
    //Backend url has to be added explicitely
    this.global.fetch = (...args)=>{
      const newobj = new Request('http://back:4000'+args[0].url,args[0])
      console.log(args[0].url)
      return fetch(newobj)
    };
    this.global.Headers = Headers;
    this.global.Request = Request;
    this.global.Response = Response;
    //Mock localStorage to be able to use token
    //To test infrastructure,scenario and dashboard pages
  }
}
module.exports = FixJSDOMEnvironment