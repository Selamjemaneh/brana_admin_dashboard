import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    
    return Response.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )
  } catch (error) {
    return Response.json(
      { message: 'Logout failed' },
      { status: 500 }
    )
  }
}
