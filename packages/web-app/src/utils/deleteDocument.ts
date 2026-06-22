import admin from '@/firebase/adminConfig';

export default async function deleteDocument(
    collectionName: string,
    id: string
) {
    try {
        const db = admin.firestore();
        await db.collection(collectionName).doc(id).delete();
    } catch (error) {
        console.error('Error deleting document: ', error);
    }
}
