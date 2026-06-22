import { db } from '@/firebase/config';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from 'firebase/firestore';

export default async function queryDocument(
    collectionName: string,
    fieldName: string,
    searchValue: string
) {
    if (fieldName === 'id') {
        // console.log('ID STUFF')
        const docRef = doc(db, collectionName, searchValue);
        // console.log('docRef', docRef)
        try {
            const docSnap = await getDoc(docRef);
            // console.log('doc data:', docSnap.exists())
            if (docSnap.exists()) {
                // console.log('Query DATA:', docSnap.data())
                return docSnap.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching document by ID:', error);
            return null;
        }
    } else {
        const collectionRef = collection(db, collectionName);
        const queryParameters = query(
            collectionRef,
            where(fieldName, '==', searchValue)
        );
        try {
            const querySnapShot = await getDocs(queryParameters);
            if (!querySnapShot.empty) {
                const queryData = querySnapShot.docs[0].data();
                const queryId = querySnapShot.docs[0].id;
                return {
                    queryData: queryData,
                    queryId: queryId,
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }
}
