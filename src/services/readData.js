const { Firestore } = require('@google-cloud/firestore');

async function readData(email, savingName) {
  const db = new Firestore();

  const predictCollection = db.collection(`${email}`);
  const docRef = predictCollection.doc(savingName);
  const doc = await docRef.get();

  if (doc.exists) {
    return doc.data();
  } else {
    console.log('Document not found!');
    return null;
  }
}

module.exports = readData;