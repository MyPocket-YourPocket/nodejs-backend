const savingPredictHandler = require('./handler');
 
const routes = [
  {
    path: '/saving-predict',
    method: 'POST',
    handler: savingPredictHandler,
  }
]
 
module.exports = routes;