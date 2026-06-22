import { SignUps } from '@/schemas/signups';
import { User, UserRole, UserStatus } from '@/schemas/users';
import createUser from '@/utils/createUser';
import uploadDocument from '@/utils/uploadDocument';
import { NextRequest, NextResponse } from 'next/server';
import admin from '@/firebase/adminConfig';

// GET: Deprecated since signup approval is bypassed. Returns empty list.
export async function GET() {
    return NextResponse.json({ data: [] }, { status: 200 });
}

// POST: Registers user in Firebase Auth and adds them to users collection with appropriate security roles
export async function POST(request: NextRequest) {
    try {
        const signUpFormData: SignUps = await request.json();
        if (!signUpFormData) {
            return NextResponse.json({ error: 'Sign Up Data is required.' }, { status: 400 });
        }

        const { signUpName, signUpEmail } = signUpFormData;

        // Directly create in Firebase Auth (propagates errors like duplicate email)
        const userCredentials = await createUser(signUpFormData);

        if (!userCredentials) {
            return NextResponse.json({ error: 'Create User Failed.' }, { status: 500 });
        }

        // Determine role and status: first user is active superAdmin, others are inactive users
        const db = admin.firestore();
        const usersSnapshot = await db.collection('users').limit(1).get();
        const isFirstUser = usersSnapshot.empty;

        const userData: User = {
            userId: userCredentials.uid,
            userName: signUpName,
            userEmail: signUpEmail,
            userRole: isFirstUser ? UserRole.superAdmin : UserRole.user,
            userStatus: isFirstUser ? UserStatus.active : UserStatus.inactive
        };

        await uploadDocument('users', userData);

        const statusMessage = isFirstUser 
            ? 'Super Admin registered and activated successfully.'
            : 'Registration received. Your account is pending administrator approval.';

        return NextResponse.json({ 
            message: statusMessage, 
            status: userData.userStatus 
        }, { status: 201 });
    } catch (error: any) {
        console.error('Signup error:', error);
        
        let errorMessage = 'Signup failed. Please try again.';
        let statusCode = 500;

        if (error.code === 'auth/email-already-exists') {
            errorMessage = 'This email address is already registered.';
            statusCode = 409;
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please provide a valid email address.';
            statusCode = 400;
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'The password is too weak. Choose a stronger password.';
            statusCode = 400;
        }

        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}

// DELETE: Deprecated
export async function DELETE() {
    return NextResponse.json({ message: 'Deprecated endpoint' }, { status: 400 });
}

