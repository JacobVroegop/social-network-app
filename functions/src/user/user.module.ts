import * as admin from "firebase-admin";
import { FieldValue } from "@google-cloud/firestore";

export interface UserModel {
  uid: string;
  name: string;
  groups: string[];
}

export function onCreateUser(user: admin.auth.UserRecord ) {
  admin.firestore().doc(`users/${user.uid}`).set({
    uid: user.uid,
    email: user.email
  }, {merge: true})
  .then(() => {
    // admin.firestore().doc(`user_private_profile/${user.uid}`).set({
    //   email: user.email
    // }).then(() => {
      console.log('doc succesfully created'); 
    // }).catch((err) => console.log(err))
  })
  .catch((err) => console.log(err))
};

export function onDeleteUser(user: admin.auth.UserRecord) {
  
  // Remove this user from all the groups
  admin.firestore().doc(`users/${user.uid}`).get()
  .then((snap) => {
    if (snap.data()){
      const batch = admin.firestore().batch();
      snap.get('groups').forEach((groupId: string) => {
        const groupRef = admin.firestore().doc(`groups/${groupId}`); //update(groupUpdate).catch((e) => console.log(e));
        batch.update(groupRef, {'users': FieldValue.arrayRemove(snap.get('uid'))})
      });
      batch.commit()
      .then(() => console.log('succes'))
      .catch((e) => console.log(e))
    }
  }).catch((e) => console.log(e));

  // Delete the user from database
  // admin.firestore().doc(`users/${user.uid}`).delete()
  // .then(() => {
  //   admin.firestore().doc(`user_private_profile/${user.uid}`).delete()
  //   .then(() => {
  //     console.log('doc succesfully deleted'); 
  //   }).catch((err) => console.log(err))
  // })
  // .catch((err) => console.log(err))

  return Promise.resolve();
}

