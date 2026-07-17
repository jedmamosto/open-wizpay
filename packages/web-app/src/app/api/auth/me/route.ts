import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/utils/authHelpers';

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({
            user: {
                uid: user.uid,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Verify session API error:', error);
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
