import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    // If you have a service account key, you can initialize it here.
    // Otherwise, it will try to use Application Default Credentials.
    // projectId: 'your-project-id'
  });
}

export const firestore = admin.firestore();
export const authAdmin = admin.auth();
