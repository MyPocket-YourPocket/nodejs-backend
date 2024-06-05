const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { input } = require('@tensorflow/tfjs-node');

// async function postPredictHandler(request, h) {
//     const { input } = request.payload;
//     const { model } = request.server.app;

//     const { confidenceScore, label, suggestion } = await predictClassification(model, input);
//     const id = crypto.randomUUID();
//     const createdAt = new Date().toISOString();

//     const data = {
//         "id": id,
//         "result": label,
//         "suggestion": suggestion,
//         "confidenceScore": confidenceScore,
//         "createdAt": createdAt
//     }

//     await storeData(id, data);

//     const response = h.response({
//         status: 'success',
//         message: 'Model is predicted successfully',
//         data
//       })
//       response.code(201);
//       return response;

// }

async function savingPredictHandler(request, h) {
    const { userInput : {
                income, expense, saving
            } } = request.payload;
    const { model } = request.server.app;

    const { result } = await predictSavings(model, income, expense, saving);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": result,
        "createdAt": createdAt
    }

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
      })
      response.code(201);
      return response;

}

module.exports = savingPredictHandler;
