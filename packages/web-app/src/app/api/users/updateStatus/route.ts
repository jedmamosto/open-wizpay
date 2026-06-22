import { UserStatus } from '@/schemas/users';
import queryDocument from '@/utils/queryDocument';
import updateDocument from '@/utils/updateDocument';
import { NextRequest, NextResponse } from 'next/server';

const collectionName = 'users';

interface UpdateStatusRequest {
    userStatus: UserStatus.active | UserStatus.inactive;
}

export async function PATCH(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');

        if (!uid)
            return NextResponse.json(
                { error: 'UID is required' },
                { status: 400 }
            );

        const newUserStatus = (await request.json()) as UpdateStatusRequest;
        if (
            !newUserStatus?.userStatus ||
            !Object.values(UserStatus).includes(newUserStatus.userStatus)
        ) {
            return NextResponse.json(
                { error: 'Invalid user status provided' },
                { status: 400 }
            );
        }

        const user = await queryDocument(collectionName, 'userId', uid);

        if (!user?.queryId)
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );

        // console.log('User ID:', user?.id)

        await updateDocument(collectionName, user.queryId, newUserStatus);

        return NextResponse.json(
            { message: 'User status updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Failed to update user status:', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
