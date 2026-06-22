import admin from "@/firebase/adminConfig";
import { SignUps } from "@/schemas/signups";

export default async function createUser(signUpData: SignUps) {
  const { signUpEmail, signUpPassword, signUpName }: SignUps = signUpData

  try {
    const userRecord = await admin.auth().createUser({
      email: signUpEmail,
      password: signUpPassword,
      displayName: signUpName
    })

    if (userRecord) return (
      {
        userRecord: userRecord,
        uid: userRecord.uid
      }
    )
  } catch (error) {
    console.error('Error at createUser():', error)
  }
}