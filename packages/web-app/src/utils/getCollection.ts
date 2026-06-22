import admin from '@/firebase/adminConfig';

export default async function getCollection(path: string, idFieldName: string = 'id') {
  try {
    const db = admin.firestore();
    const querySnapShot = await db.collection(path).get();

    const docData = querySnapShot.docs.map((doc) => ({ [idFieldName]: doc.id, ...doc.data() }));

    return docData;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
}