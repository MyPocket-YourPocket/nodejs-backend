const predictSavings = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { input } = require('@tensorflow/tfjs-node');
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

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
    const { userInput: {
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

async function firebaseAuthHandler(request, h) {
    const { email, password } = request.payload;
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return user;
    } catch(error){
        return error;
    }
}


async function HelloWorld(request, h){
    return "Hello World!!!"
}

module.exports = { savingPredictHandler, firebaseAuthHandler, HelloWorld };
