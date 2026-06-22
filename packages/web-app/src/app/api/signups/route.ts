import { SignUps } from '@/schemas/signups';
import { User, UserRole, UserStatus } from '@/schemas/users';
import createUser from '@/utils/createUser';
import uploadDocument from '@/utils/uploadDocument';
import { NextRequest, NextResponse } from 'next/server';

// GET: Deprecated since signup approval is bypassed. Returns empty list.
export async function GET() {
    return NextResponse.json({ data: [] }, { status: 200 });
}

// POST: Directly registers user in Firebase Auth and adds them to users collection
export async function POST(request: NextRequest) {
    try {
        const signUpFormData: SignUps = await request.json();
        const { signUpName, signUpEmail } = signUpFormData;

        if (!signUpFormData) {
            return NextResponse.json({ error: 'Sign Up Data is not found.' }, { status: 400 });
        }

        // Directly create in Firebase Auth
        const userCredentials = await createUser(signUpFormData);

        if (!userCredentials) {
            return NextResponse.json({ error: 'Create User Failed.' }, { status: 500 });
        }

        // Store directly in users collection with active status and admin role
        const userData: User = {
            userId: userCredentials.uid,
            userName: signUpName,
            userEmail: signUpEmail,
            userRole: UserRole.admin,
            userStatus: UserStatus.active
        };

        await uploadDocument('users', userData);

        return NextResponse.json({ message: 'User registered and activated successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: error.message || 'Signup failed' }, { status: 500 });
    }
}

// DELETE: Deprecated
export async function DELETE() {
    return NextResponse.json({ message: 'Deprecated endpoint' }, { status: 400 });
}

