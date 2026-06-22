import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export default async function getCollection(path: string, idFieldName: string = 'id') {
  const collectionRef = collection(db, path)

  try {

    const querySnapShot = await getDocs(collectionRef)

    const docData = querySnapShot.docs.map((doc) => ({ [idFieldName]: doc.id, ...doc.data() }))

    return docData;

  } catch (error) {
    console.error("Error fetching data: ", error)
    return []
  }
}