
'use server';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export async function saveApiKey(uid: string, apiKey: string) {
  try {
    const userDocRef = doc(firestore, 'users', uid);
    await setDoc(userDocRef, { apiKey }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error('Error saving API key:', error);
    return { success: false, error: 'Could not save API key.', details: `${error.message} \n ${error.stack}` };
  }
}

export async function getApiKey(uid: string): Promise<string | null> {
  try {
    const userDocRef = doc(firestore, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data()?.apiKey || null;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting API key:', error);
    return null;
  }
}
