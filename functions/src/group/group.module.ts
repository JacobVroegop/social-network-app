import * as admin from "firebase-admin";
import * as functions from 'firebase-functions';
import { FieldValue } from "@google-cloud/firestore";


export interface Group {
  groupId: string,
  users: any;
}

export function onUpdateGroup(change: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) {
  const oldDoc = change.before.data() as Group;
  const newDoc = change.after.data() as Group;

  switch(checkUserListChanges(oldDoc, newDoc)) {
    case 'hasNewUsers': {
      return addGroupToUsers(getRemovedOrNewUsers(newDoc.users, oldDoc.users), newDoc.groupId);
    }
    case 'hasDeletedUsers': {
      return removeGroupFromUsers(getRemovedOrNewUsers(oldDoc.users, newDoc.users), newDoc.groupId);
    }    
    case 'groupCreated': {
      return addGroupToUsers(createArrayOfUsers(newDoc.users), newDoc.groupId);
    }    
    case 'groupDeleted': {
      return removeGroupFromUsers(createArrayOfUsers(oldDoc.users), oldDoc.groupId);
    }
    default: {
      return Promise.resolve();
    }
  }
}

function checkUserListChanges(oldDoc: Group, newDoc: Group): string {
  if (oldDoc !== undefined && newDoc !== undefined) {
    if (createArrayOfUsers(newDoc.users).length > createArrayOfUsers(oldDoc.users).length) return 'hasNewUsers'
    else if (createArrayOfUsers(newDoc.users).length < createArrayOfUsers(oldDoc.users).length) return 'hasDeletedUsers'
  }
  else if(oldDoc === undefined && newDoc !== undefined) return 'groupCreated'
  else if(oldDoc !== undefined && newDoc === undefined) return 'groupDeleted'
  return 'default'
  }

function addGroupToUsers(users: string[], groupId: string): Promise<any>{
  const batch = admin.firestore().batch();

  users.forEach(userId => {
    const userRef = admin.firestore().doc(`users/${userId}`);
    batch.set(userRef, {
      groups: FieldValue.arrayUnion(groupId)
    }, { merge: true})
  })

  return batch.commit()
  .then(() => console.log('succes'))
  .catch((e) => console.log(e))
}

function removeGroupFromUsers(users: string[], ToRemoveGroupId: string): Promise<any> {
  const batch = admin.firestore().batch();

  users.forEach(userId => {
    const userRef = admin.firestore().doc(`users/${userId}`);
    batch.update(userRef, {
      groups: FieldValue.arrayRemove(ToRemoveGroupId)
    });
  })
  return batch.commit()
  .then(() => console.log('succes'))
  .catch((e) => console.log(e))
}

function getRemovedOrNewUsers(largeUserList: Group["users"], smalUserList: Group["users"]): string[] {
  const users = createArrayOfUsers(largeUserList).filter(user => filterUser(user, createArrayOfUsers(smalUserList)));
  return users;
}

function filterUser(curUser: string, smalUserList: string[]): boolean{
  let hasUser: boolean = false;
  smalUserList.forEach(newUser => {
    if (newUser === curUser) hasUser = true;
  }) 
  return !hasUser;
}

function createArrayOfUsers(users: Group["users"]): string[]{
  let newUserArray: string[] = [];
  for (let value of Object.values(users)) {
    newUserArray = newUserArray.concat(value as string[]);
  }
  return newUserArray;
}