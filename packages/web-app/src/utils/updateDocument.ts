import admin from '@/firebase/adminConfig';

export default async function updateDocument(
    collectionName: string,
    id: string,
    data: object
) {
    try {
        const db = admin.firestore();
        await db.collection(collectionName).doc(id).update(data);
    } catch (error) {
        console.error('Error updating document: ', error);
    }
}
