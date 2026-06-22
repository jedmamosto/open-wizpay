import { db } from '@/firebase/config';
import { addDoc, collection } from 'firebase/firestore';

export default async function uploadDocument(
    collectionName: string,
    data: object
) {
    try {
        const collectionRef = collection(db, collectionName);
        await addDoc(collectionRef, data);
        // console.log("Document written with ID: ", docRef.id)
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}
