import admin from '@/firebase/adminConfig';

export default async function queryDocument(
    collectionName: string,
    fieldName: string,
    searchValue: string
) {
    const db = admin.firestore();
    if (fieldName === 'id') {
        try {
            const docSnap = await db.collection(collectionName).doc(searchValue).get();
            if (docSnap.exists) {
                return docSnap.data() || null;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching document by ID:', error);
            return null;
        }
    } else {
        try {
            const querySnapShot = await db
                .collection(collectionName)
                .where(fieldName, '==', searchValue)
                .limit(1)
                .get();
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
