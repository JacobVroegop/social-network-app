import * as admin from "firebase-admin";
import * as functions from 'firebase-functions';

export async function onUpdateAdminRole(change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) {
  const oldDoc = change.before.data();
  const newDoc = change.after.data();

  if (oldDoc === undefined && newDoc !== undefined) {
    try {
      const user = await admin.auth().getUserByEmail(newDoc.email)
      await admin.auth().setCustomUserClaims(user.uid, {admin: true})
    } catch(err){
      console.error(err);
    }
  } 
  else if (oldDoc !== undefined && newDoc === undefined) {
    try {
      const user = await admin.auth().getUserByEmail(oldDoc.email)
      await admin.auth().setCustomUserClaims(user.uid, {admin: false})
    } catch(err){
      console.error(err);
    }
  } 
  else if (oldDoc !== undefined && newDoc !== undefined){
    try {
      const oldUser = await admin.auth().getUserByEmail(oldDoc.email)
      const newUser = await admin.auth().getUserByEmail(newDoc.email)
      await admin.auth().setCustomUserClaims(newUser.uid, {admin: true})
      await admin.auth().setCustomUserClaims(oldUser.uid, {admin: false})
    } catch(err){
      console.error(err);
    }
  }
  return Promise.resolve();
}

export async function createUserToken(data: any, context: functions.https.CallableContext) {
  const uid: string = data.uid;
  const adminToken = context.auth ? context.auth.token : null
  if (adminToken !== null && adminToken.admin === true) {
    try {
      const customUserToken = await admin.auth().createCustomToken(uid)
      return {
        customUserToken: customUserToken
      }
    } catch(err){
      console.error(err)
    }
  }
  return;
};

export async function updateUserData(data: any, context: functions.https.CallableContext){
  const adminToken = context.auth ? context.auth.token : null
  if (adminToken !== null && adminToken.admin === true) {
    try {
      const writeResult = await admin.firestore().collection('/users').doc(data.uid).set(data, {merge: true})
      if (writeResult.writeTime !== null){
        return {
          message: 'update succesful'
        }
      }
    } catch(err){
      console.error(err)
    }
  }
  return;
};
