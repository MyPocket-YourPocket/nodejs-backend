const storeData = require('../services/storeData');
const readData = require('../services/readData');
const axios = require('axios');
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");

async function savingPredictHandler(request, h) {
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
    const user = auth.currentUser;

    const { income, expense, saving, savingName } = request.payload;
    const createdAt = new Date().toISOString();

    const dataForPrediction = {
        "monthly_income": income,
        "monthly_expenses": expense,
        "savings_goal": saving
    };

    try{
        const predictionResponse = await axios.post(process.env.MODEL_URL, dataForPrediction);
        const result = predictionResponse.data;
        
        const data = {
            "email": user.email,
            "savingName": savingName,
            "result": result,
            "createdAt": createdAt
        }

        await storeData(user.email, savingName, data);
    
        const response = h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        })
        response.code(201);
        return response;
    }
    catch(error){
        throw new InputError();
    }
}

async function historyHandler(request, h){
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
    const user = auth.currentUser;

    const data = await readData(user.email);

    const response = h.response({
        status: 'success',
        message: 'History Loaded',
        data
    })
    response.code(201);
    return response;
}

async function firebaseSignUpHandler(request, h) {
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
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return user;
    } catch (error) {
        return error;
    }
}

async function firebaseLogInHandler(request, h) {
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
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return h.redirect(`/logged/${user.email}`);
    } catch (error) {
        return error;
    }
}

async function HelloWorld(request, h) {
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
    const user = auth.currentUser;

    try {
        return `Hello, ${user.email}`;
    } catch (error) {
        return error;
    }
}

async function logOuthandler(request, h) {
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

    try {
        await signOut(auth);
        const response = h.response({
            status: 'success',
            message: 'Logged Out successfully'
        });
        return response;
    } catch (error) {
        return error;
    }
}

module.exports = { savingPredictHandler, firebaseSignUpHandler, firebaseLogInHandler, logOuthandler, HelloWorld, historyHandler };
