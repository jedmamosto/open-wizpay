import { NextRequest, NextResponse } from 'next/server';
import queryDocument from '@/utils/queryDocument';
import { getAuthenticatedUser } from '@/utils/authHelpers';
import { UserRole } from '@/schemas/users';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const caller = await getAuthenticatedUser(request);
    if (!caller) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow admins/superAdmins or the owner of the UID to fetch credentials
    if (caller.role !== UserRole.admin && caller.role !== UserRole.superAdmin && caller.uid !== uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await queryDocument('users', 'userId', uid);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ userStatus: user.queryData.userStatus, userRole: user.queryData.userRole }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}