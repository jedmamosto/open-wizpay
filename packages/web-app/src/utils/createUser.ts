import admin from "@/firebase/adminConfig";
import { SignUps } from "@/schemas/signups";

export default async function createUser(signUpData: SignUps) {
  const { signUpEmail, signUpPassword, signUpName }: SignUps = signUpData

  const userRecord = await admin.auth().createUser({
    email: signUpEmail,
    password: signUpPassword,
    displayName: signUpName
  })

  return {
    userRecord: userRecord,
    uid: userRecord.uid
  }
}