import { db } from '@/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

export default async function updateDocument(
    collectionName: string,
    id: string,
    data: object
) {
    const docRef = doc(db, collectionName, id);

    // console.log('docRef:', docRef);
    // console.log('data:', data);

    try {
        await updateDoc(docRef, data);
        // console.log('Document successfully updated!');
    } catch (error) {
        console.error('Error updating document: ', error);
    }
}
