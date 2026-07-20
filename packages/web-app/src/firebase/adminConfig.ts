import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n')
      })
    });
  } else {
    // Prevent build/compilation failure in environments without credentials (e.g. CI runners)
    console.warn("Warning: Firebase Admin credentials not found in environment. Initializing with mock config for build compilation.");
    admin.initializeApp({
      projectId: projectId || "mock-project-id"
    });
  }
}

export default admin;