import getCollection from "@/utils/getCollection";
import { NextResponse } from "next/server";

const collectionName = 'users'
const idFieldName = 'userId'

export async function GET() {

  try {
    const data = await getCollection(collectionName, idFieldName)
    return NextResponse.json({ data: data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching users: ', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}