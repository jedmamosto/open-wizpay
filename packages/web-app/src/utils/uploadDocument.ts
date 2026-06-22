import admin from '@/firebase/adminConfig';

export default async function uploadDocument(
    collectionName: string,
    data: object
) {
    try {
        const db = admin.firestore();
        await db.collection(collectionName).add(data);
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}
