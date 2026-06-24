import { UserRole } from "@/schemas/users";
import { getAuthenticatedUser } from "@/utils/authHelpers";
import getCollection from "@/utils/getCollection";
import { NextRequest, NextResponse } from "next/server";

const collectionName = 'users'
const idFieldName = 'userId'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || (user.role !== UserRole.admin && user.role !== UserRole.superAdmin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await getCollection(collectionName, idFieldName)
    return NextResponse.json({ data: data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching users: ', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}