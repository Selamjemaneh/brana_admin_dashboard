import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return Response.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For demo purposes, accept any email/password combination
    // In production, verify against a database
    const cookieStore = await cookies()
    cookieStore.set('admin_session', JSON.stringify({ email, loggedInAt: new Date() }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return Response.json(
      { message: 'Logged in successfully' },
      { status: 200 }
    )
  } catch (error) {
    return Response.json(
      { message: 'Authentication failed' },
      { status: 500 }
    )
  }
}
