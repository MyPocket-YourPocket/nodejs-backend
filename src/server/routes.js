const postPredictHandler = require('./handler');
 
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
  }
]
 
module.exports = routes;