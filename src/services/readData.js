const { Firestore } = require('@google-cloud/firestore');

async function readData(email/*, savingName*/) {
  const db = new Firestore();

  const snapshot = await db.collection(`${email}`).get();
  // const docRef = predictCollection.doc(savingName);
  // const doc = await predictCollection.get();

  if (!snapshot.empty) {
    const doc = snapshot.docs.map(doc => doc.data());
    return doc;
  } else {
    console.log('Document not found!');
    return [];
  }
}

module.exports = readData;