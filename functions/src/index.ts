import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { onCreateUser, onDeleteUser } from './user/user.module';
import { onUpdateGroup } from './group/group.module';
import { createUserToken, onUpdateAdminRole, updateUserData } from './admin/admin.module';

admin.initializeApp();

exports.onCreateUser = functions.auth.user().onCreate((user) => onCreateUser(user));
exports.onDeleteUser = functions.auth.user().onDelete((user) => onDeleteUser(user));
exports.onUpdateGroup = functions.firestore.document('groups/{groupId}').onWrite((change, context) => onUpdateGroup(change, context));
exports.createUserToken = functions.https.onCall((data, context) =>  createUserToken(data, context))
exports.onUpdateAdminRole = functions.firestore.document('admins/{adminEmail}').onWrite((change, context) => onUpdateAdminRole(change, context));
exports.updateUserData = functions.https.onCall((data, context) =>  updateUserData(data, context))