import * as admin from 'firebase-admin';
import * as serviceAccount from './token/nest102023-firebase-adminsdk-839nr-b47c046314.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const db = admin.firestore();
