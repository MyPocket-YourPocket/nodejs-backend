const { savingPredictHandler, firebaseAuthHandler, HelloWorld } = require('./handler');
 
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: savingPredictHandler
  },
  {
    path: '/signup',
    method: 'POST',
    handler : firebaseAuthHandler
  },
  {
    method: 'GET',
    path: '/',
    handler: HelloWorld
}
];
 
module.exports = routes;