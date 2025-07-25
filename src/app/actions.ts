
'use server';

import { firestore } from '@/lib/firebase-admin';

export async function saveApiKey(uid: string, apiKey: string) {
  try {
    const userDocRef = firestore.collection('users').doc(uid);
    await userDocRef.set({ apiKey }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error saving API key:', error);
    return { success: false, error: 'Could not save API key.' };
  }
}

export async function getApiKey(uid: string): Promise<string | null> {
  try {
    const userDocRef = firestore.collection('users').doc(uid);
    const doc = await userDocRef.get();
    if (doc.exists) {
      return doc.data()?.apiKey || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
}
