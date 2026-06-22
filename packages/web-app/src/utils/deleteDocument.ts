import { db } from '@/firebase/config';
import { deleteDoc, doc } from 'firebase/firestore';

export default async function deleteDocument(
    collectionName: string,
    id: string
) {
    const docRef = doc(db, collectionName, id);

    try {
        await deleteDoc(docRef);
        // console.log('Document successfully deleted!')
    } catch (error) {
        console.error('Error deleting document: ', error);
    }
}
